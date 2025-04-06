import { Request, Response } from 'express';
import Organizer from '../models/Organizer';

// Get organizer profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const organizer = await Organizer.findOne({ userId: req.user.id });
    
    if (!organizer) {
      return res.status(404).json({ success: false, message: 'Organizer profile not found' });
    }
    
    res.status(200).json({ success: true, organizer });
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update organizer profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const { name, organizationName, email } = req.body;
    
    // Find and update the organizer
    const organizer = await Organizer.findOneAndUpdate(
      { userId: req.user.id },
      { 
        name, 
        organizationName, 
        email,
        profileCompleted: Boolean(name && organizationName && email)
      },
      { new: true }
    );
    
    if (!organizer) {
      return res.status(404).json({ success: false, message: 'Organizer profile not found' });
    }
    
    res.status(200).json({ success: true, organizer });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};