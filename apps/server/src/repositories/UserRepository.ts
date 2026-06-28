import { User, IUser } from '../models/User';
import mongoose from 'mongoose';

export class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).exec();
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id).exec();
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return user.save();
  }

  async update(id: string, updateData: mongoose.UpdateQuery<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async find(filter: Record<string, any> = {}): Promise<IUser[]> {
    return User.find(filter).exec();
  }

  async delete(id: string): Promise<IUser | null> {
    return User.findByIdAndDelete(id).exec();
  }
}
