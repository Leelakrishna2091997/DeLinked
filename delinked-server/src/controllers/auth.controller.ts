import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Organizer from '../models/Organizer';
import Candidate from '../models/Candidate';
import { generateNonce, verifySignature } from '../utils/web3.utils';

// Get nonce for an address
export const getNonce = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    
    if (!address) {
      return res.status(400).json({ success: false, message: 'Address is required' });
    }
    
    const lowercaseAddress = address.toLowerCase();
    
    // Find user or create a new one
    let user = await User.findOne({ address: lowercaseAddress });
    let isNewUser = false;
    
    if (!user) {
      isNewUser = true;
    } else {
      // Update nonce for existing user
      const nonce = generateNonce();
      user.nonce = nonce;
      await user.save();
    }
    
    return res.status(200).json({ 
      success: true, 
      nonce: user ? user.nonce : generateNonce(),
      isNewUser,
      userType: user ? user.userType : undefined
    });
  } catch (error) {
    console.error('Error in getNonce:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Authenticate with MetaMask
export const authenticate = async (req: Request, res: Response) => {
  try {
    const { address, signature, nonce, userType } = req.body;
    
    if (!address || !signature || !nonce) {
      return res.status(400).json({ success: false, message: 'Address, signature and nonce are required' });
    }
    
    const lowercaseAddress = address.toLowerCase();
    
    // Verify signature
    const isValid = verifySignature(lowercaseAddress, nonce, signature);
    
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid signature' });
    }
    
    // Find or create user
    let user = await User.findOne({ address: lowercaseAddress });
    let isNewUser = false;
    
    if (!user) {
      // Require userType for new users
      if (!userType || !['organizer', 'candidate'].includes(userType)) {
        return res.status(400).json({ 
          success: false, 
          message: 'New users must specify a valid userType (organizer or candidate)' 
        });
      }
      
      // Create new user
      user = await User.create({
        address: lowercaseAddress,
        nonce: generateNonce(), // Generate new nonce after login
        userType
      });
      
      // Create corresponding profile
      if (userType === 'organizer') {
        await Organizer.create({ userId: user._id });
      } else {
        await Candidate.create({ userId: user._id });
      }
      
      isNewUser = true;
    } else {
      // Update nonce after successful login
      user.nonce = generateNonce();
      await user.save();
    }
    
    // Generate JWT
    const token = jwt.sign(
      { id: user._id, address: user.address, userType: user.userType },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );
    
    // Return user info and token
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        address: user.address,
        userType: user.userType
      },
      isNewUser
    });
  } catch (error) {
    console.error('Error in authenticate:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const user = await User.findById(req.user.id).select('-nonce');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};