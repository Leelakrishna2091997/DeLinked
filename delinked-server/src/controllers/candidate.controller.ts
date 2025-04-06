import { Request, Response } from 'express';
import Candidate from '../models/Candidate';

// Get candidate profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const candidate = await Candidate.findOne({ userId: req.user.id });
    
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found' });
    }
    
    res.status(200).json({ success: true, candidate });
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update candidate profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const { name, skills, experience, email } = req.body;
    
    // Find and update the candidate
    const candidate = await Candidate.findOneAndUpdate(
      { userId: req.user.id },
      { 
        name, 
        skills, 
        experience, 
        email,
        profileCompleted: Boolean(name && skills && skills.length > 0 && experience && email)
      },
      { new: true }
    );
    
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found' });
    }
    
    res.status(200).json({ success: true, candidate });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};