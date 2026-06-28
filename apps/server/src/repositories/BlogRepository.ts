import { BaseRepository } from './BaseRepository';
import { Blog, IBlog } from '../models/Blog';

export class BlogRepository extends BaseRepository<IBlog> {
  constructor() {
    super(Blog);
  }

  async findBySlug(slug: string): Promise<IBlog | null> {
    return this.findOne({ slug, isDeleted: false });
  }

  async findPublished(): Promise<IBlog[]> {
    return this.model.find({ status: 'PUBLISHED', isDeleted: false }).sort({ publishedAt: -1 }).exec();
  }
}
