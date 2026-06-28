import { BaseRepository } from './BaseRepository';
import { Project, IProject } from '../models/Project';

export class ProjectRepository extends BaseRepository<IProject> {
  constructor() {
    super(Project);
  }

  async findBySlug(slug: string): Promise<IProject | null> {
    return this.findOne({ slug, isDeleted: false });
  }

  async findPublished(): Promise<IProject[]> {
    return this.model.find({ status: 'PUBLISHED', isDeleted: false }).sort({ publishedAt: -1 }).exec();
  }
}
