# DeLinked
A decentralized career identity platform that combats professional fraud by anchoring user experiences—such as employment history, certifications, and education records—on the blockchain.

Client:

While settting up the client these are the commands I've followed:

npx create-next-app@latest delinked-client --typescript
cd delinked-client

npm install ethers@6.7.1 axios web3modal

mkdir -p src/components src/hooks src/utils src/services src/interfaces

Create a .env.local file in the root directory:
NEXT_PUBLIC_API_URL=http://localhost:5000/api

Update your next.config.js:

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

Server :

mkdir delinked-server
cd delinked-server

npm init -y

npm install express mongoose dotenv cors helmet morgan jsonwebtoken ethers@6.7.1 typescript ts-node @types/express @types/node @types/mongoose @types/cors @types/morgan @types/jsonwebtoken

npx tsc --init

Update the tsconfig.json file

mkdir -p src/controllers src/models src/routes src/middleware src/utils src/config

Create a .env file in the root directory

npm install -g ts-node-dev



Running the application:

cd delinked-client
npm run dev

cd delinked-server
npm run dev

Or run everything by : 

docker-compose up

This will start:

Next.js client on http://localhost:3000
Node.js server on http://localhost:5001