// blockchain-text-storage.js
// Required packages:
// npm install ethers express dotenv solc

const { ethers } = require("ethers");
const express = require("express");
const fs = require("fs");
const dotenv = require("dotenv");
const solc = require("solc");

// Load environment variables
dotenv.config();

// Set up Express app
const app = express();
app.use(express.json());

// Compile the Solidity contract
function compileContract() {
  console.log("Compiling smart contract...");

  const contractSource = `
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.17;

  contract TextStorage {
      // Structure to store text data
      struct TextRecord {
          string text;        // The stored text
          address owner;      // Address of the owner
          uint256 timestamp;  // Time when the data was stored
      }
      
      // Mapping from block hash to text record
      mapping(bytes32 => TextRecord) private textRecords;
      
      // Mapping from address to their records
      mapping(address => bytes32[]) private userRecords;
      
      // Event emitted when text is stored
      event TextStored(
          address indexed owner,
          string text,
          bytes32 blockHash,
          uint256 timestamp
      );
      
      // Store text and associate it with the transaction's block hash
      function storeText(string memory _text) public returns (bytes32) {
          // Create a new text record
          TextRecord memory newRecord = TextRecord({
              text: _text,
              owner: msg.sender,
              timestamp: block.timestamp
          });
          
          // Get current block hash (using previous block for reliability)
          bytes32 blockHash = blockhash(block.number - 1);
          
          // Save the record
          textRecords[blockHash] = newRecord;
          
          // Add to user's records
          userRecords[msg.sender].push(blockHash);
          
          // Emit event
          emit TextStored(msg.sender, _text, blockHash, block.timestamp);
          
          return blockHash;
      }
      
      // Retrieve text by block hash
      function getTextByBlockHash(bytes32 _blockHash) public view returns (
          string memory,
          address,
          uint256
      ) {
          TextRecord memory record = textRecords[_blockHash];
          return (
              record.text,
              record.owner,
              record.timestamp
          );
      }
      
      // Get all block hashes for the caller
      function getUserRecords() public view returns (bytes32[] memory) {
          return userRecords[msg.sender];
      }
  }`;

  // Configure solc input
  const input = {
    language: "Solidity",
    sources: {
      "TextStorage.sol": {
        content: contractSource,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"],
        },
      },
    },
  };

  // Compile the contract
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const contractOutput = output.contracts["TextStorage.sol"]["TextStorage"];

  return {
    abi: contractOutput.abi,
    bytecode: contractOutput.evm.bytecode.object,
  };
}

// Deploy the contract
async function deployContract(provider, wallet, contractData) {
  console.log("Deploying contract to Sepolia network...");

  // Create a contract factory
  const factory = new ethers.ContractFactory(
    contractData.abi,
    contractData.bytecode,
    wallet
  );

  // Deploy the contract
  const contract = await factory.deploy();
  console.log(
    `Contract deployment transaction: ${contract.deployTransaction.hash}`
  );

  // Wait for deployment to be confirmed
  await contract.deployed();
  console.log(`Contract deployed at: ${contract.address}`);

  return contract;
}

// Main function
async function main() {
  try {
    // Initialize provider and wallet
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.SEPOLIA_RPC_URL
    );
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const walletAddress = await wallet.getAddress();

    console.log(`Using wallet address: ${walletAddress}`);

    // Check wallet balance
    const balance = await wallet.getBalance();
    console.log(`Wallet balance: ${ethers.utils.formatEther(balance)} ETH`);

    if (balance.lt(ethers.utils.parseEther("0.01"))) {
      console.warn(
        "Warning: Low balance. You may not have enough ETH for transactions."
      );
    }

    // Compile the contract
    const contractData = compileContract();

    // Deploy the contract
    const contract = await deployContract(provider, wallet, contractData);
    const contractAddress = contract.address;

    // Store contract address for later use
    console.log("Contract deployed successfully. Starting API server...");

    // API Routes

    // Store text
    app.post("/store", async (req, res) => {
      try {
        // Get text from request or default to "hello world"
        const textToStore = req.body.text || "hello world";

        console.log(`Storing text: "${textToStore}"`);

        // Call the contract to store the text
        const tx = await contract.storeText(textToStore);
        const receipt = await tx.wait();

        // Get the block hash from the transaction
        const blockHash = receipt.blockHash;

        console.log(`Text stored. Block hash: ${blockHash}`);

        // Return success response
        res.json({
          success: true,
          text: textToStore,
          blockHash: blockHash,
          transactionHash: receipt.transactionHash,
          blockNumber: receipt.blockNumber,
        });
      } catch (error) {
        console.error("Error storing text:", error);
        res.status(500).json({
          success: false,
          error: error.message,
        });
      }
    });

    // Retrieve text
    app.get("/retrieve/:blockHash", async (req, res) => {
      try {
        const { blockHash } = req.params;

        console.log(`Retrieving text for block hash: ${blockHash}`);

        // Call the contract to get the text data
        const [text, owner, timestamp] = await contract.getTextByBlockHash(
          blockHash
        );

        console.log(`Retrieved text: "${text}"`);

        // Return the retrieved data
        res.json({
          success: true,
          text,
          owner,
          timestamp: new Date(timestamp * 1000).toISOString(),
          blockHash,
        });
      } catch (error) {
        console.error("Error retrieving text:", error);
        res.status(500).json({
          success: false,
          error: error.message,
        });
      }
    });

    // Get all records for the user
    app.get("/records", async (req, res) => {
      try {
        // Get all block hashes for the user
        const blockHashes = await contract.getUserRecords();

        console.log(`Retrieved ${blockHashes.length} records for user`);

        // Return the block hashes
        res.json({
          success: true,
          count: blockHashes.length,
          blockHashes,
        });
      } catch (error) {
        console.error("Error getting user records:", error);
        res.status(500).json({
          success: false,
          error: error.message,
        });
      }
    });

    // Get contract address
    app.get("/contract", (req, res) => {
      res.json({
        success: true,
        contractAddress,
        network: "sepolia",
      });
    });

    app.get("/retrieve-by-tx/:txHash", async (req, res) => {
      try {
        const { txHash } = req.params;
        console.log(`🔍 Looking up logs for txHash: ${txHash}`);

        const provider = new ethers.providers.JsonRpcProvider(
          process.env.SEPOLIA_RPC_URL
        );
        // Get the transaction receipt
        const txReceipt = await provider.getTransactionReceipt(txHash);

        if (!txReceipt) {
          return res.status(404).json({
            success: false,
            error: "Transaction not found or not yet confirmed",
          });
        }

        // Step 2: Find the log for the TextStored event
        const eventTopic = contract.interface.getEventTopic("TextStored");

        console.log(txReceipt.logs);

        console.log("hello", eventTopic, contract);

        const log = txReceipt.logs.find(
          (l) =>
            // l.address.toLowerCase() === contract.address.toLowerCase() &&
            l.topics[0] === eventTopic
        );

        if (!log) {
          return res.status(404).json({
            success: false,
            error: "No TextStored event found in this transaction",
          });
        }

        // Step 3: Decode the event log using contract.interface
        const decoded = contract.interface.decodeEventLog(
          "TextStored",
          log.data,
          log.topics
        );

        res.json({
          success: true,
          transactionHash: txHash,
          text: decoded.text,
          owner: decoded.owner,
          blockHash: decoded.blockHash,
          timestamp: new Date(
            decoded.timestamp.toNumber() * 1000
          ).toISOString(),
        });
      } catch (error) {
        console.error("❌ Error retrieving text by transaction hash:", error);
        res.status(500).json({
          success: false,
          error: error.message,
        });
      }
    });

    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`
        =======================================================
        🚀 Blockchain Text Storage API running on port ${PORT}
        
        📝 Contract Address: ${contractAddress}
        🔗 Network: Sepolia
        
        Available Endpoints:
        
        POST /store
        - Stores text on the blockchain
        - Request body: { "text": "your text here" }
        - Defaults to "hello world" if no text provided
        
        GET /retrieve/:blockHash
        - Retrieves stored text by block hash
        
        GET /records
        - Lists all records stored by the current wallet
        
        GET /contract
        - Returns contract address and network info
        =======================================================
      `);
    });
  } catch (error) {
    console.error("Error in main function:", error);
    process.exit(1);
  }
}

// app.get('/retrieve-by-tx/:txHash', async (req, res) => {
//   try {
//     const { txHash } = req.params;

//     console.log(`Retrieving data for transaction hash: ${txHash}`);

//     // Get the transaction receipt
//     const txReceipt = await provider.getTransactionReceipt(txHash);

//     if (!txReceipt) {
//       return res.status(404).json({
//         success: false,
//         error: 'Transaction not found'
//       });
//     }

//     // Get the block hash from the transaction receipt
//     const blockHash = txReceipt.blockHash;

//     console.log(`Found block hash: ${blockHash} for transaction: ${txHash}`);

//     // Call the contract to get the text data using the block hash
//     const [text, owner, timestamp] = await contract.getTextByBlockHash(blockHash);

//     console.log(`Retrieved text: "${text}" from transaction: ${txHash}`);

//     // Return the retrieved data
//     res.json({
//       success: true,
//       text,
//       owner,
//       timestamp: new Date(timestamp * 1000).toISOString(),
//       blockHash,
//       transactionHash: txHash
//     });
//   } catch (error) {
//     console.error('Error retrieving text by transaction hash:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// });

// GET /retrieve-by-tx/:txHash

// Run the application
main();
