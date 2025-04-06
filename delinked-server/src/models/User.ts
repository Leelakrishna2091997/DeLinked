import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  address: string;
  nonce: string;
  userType: 'organizer' | 'candidate';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    address: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true 
    },
    nonce: { 
      type: String, 
      required: true 
    },
    userType: { 
      type: String, 
      enum: ['organizer', 'candidate'],
      required: true 
    }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);