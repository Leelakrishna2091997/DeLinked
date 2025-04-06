import mongoose, { Document, Schema } from 'mongoose';

export interface ICandidate extends Document {
  userId: mongoose.Types.ObjectId;
  name?: string;
  skills?: string[];
  experience?: number;
  email?: string;
  profileCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CandidateSchema: Schema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    name: { 
      type: String 
    },
    skills: { 
      type: [String] 
    },
    experience: { 
      type: Number 
    },
    email: { 
      type: String 
    },
    profileCompleted: { 
      type: Boolean, 
      default: false 
    }
  },
  { timestamps: true }
);

export default mongoose.model<ICandidate>('Candidate', CandidateSchema);