import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganizer extends Document {
  userId: mongoose.Types.ObjectId;
  name?: string;
  organizationName?: string;
  email?: string;
  profileCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizerSchema: Schema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    name: { 
      type: String 
    },
    organizationName: { 
      type: String 
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

export default mongoose.model<IOrganizer>('Organizer', OrganizerSchema);