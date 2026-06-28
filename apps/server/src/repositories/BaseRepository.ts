import mongoose, { Model, Document } from 'mongoose';
import { IPaginationOptions } from '../types';

export class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    const document = new this.model(data);
    return await document.save();
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async findOne(filter: Record<string, any>): Promise<T | null> {
    return await this.model.findOne(filter).exec();
  }

  async findAll(filter: Record<string, any> = {}, options: IPaginationOptions = {}): Promise<{ data: T[]; total: number }> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;
    
    const sort: any = {};
    if (options.sort) {
      sort[options.sort] = options.order === 'desc' ? -1 : 1;
    }

    const [data, total] = await Promise.all([
      this.model.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.model.countDocuments(filter).exec()
    ]);

    return { data, total };
  }

  async update(id: string, data: mongoose.UpdateQuery<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
