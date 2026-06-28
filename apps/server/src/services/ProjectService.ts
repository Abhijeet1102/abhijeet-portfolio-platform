import slugify from 'slugify';
import { ProjectRepository } from '../repositories/ProjectRepository';
import { CreateProjectDto, UpdateProjectDto } from '../validators/project.dto';

export class ProjectService {
  private projectRepository: ProjectRepository;

  constructor() {
    this.projectRepository = new ProjectRepository();
  }

  async getAllProjects(query: any) {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const filter: any = { isDeleted: false };
    
    // Support searching and filtering
    if (query.category) filter.category = query.category;
    if (query.status) filter.status = query.status;
    if (query.search) {
      filter.title = { $regex: query.search, $options: 'i' };
    }

    return this.projectRepository.findAll(filter, {
      page,
      limit,
      sort: query.sort as string || 'createdAt',
      order: query.order as 'asc' | 'desc' || 'desc',
    });
  }

  async getPublishedProjects() {
    return this.projectRepository.findPublished();
  }

  async getProjectBySlug(slug: string) {
    const project = await this.projectRepository.findBySlug(slug);
    if (!project) throw new Error('Project not found');
    return project;
  }

  async createProject(data: CreateProjectDto) {
    const slug = slugify(data.title, { lower: true, strict: true });
    
    // Check if slug exists
    const existing = await this.projectRepository.findBySlug(slug);
    if (existing) {
      throw new Error('Project with this title already exists');
    }

    return this.projectRepository.create({
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      slug,
      publishedAt: data.status === 'PUBLISHED' ? new Date() : undefined
    } as any);
  }

  async updateProject(id: string, data: UpdateProjectDto) {
    const project = await this.projectRepository.findById(id);
    if (!project || project.isDeleted) throw new Error('Project not found');

    const updateData: any = { ...data };
    
    if (data.title && data.title !== project.title) {
      updateData.slug = slugify(data.title, { lower: true, strict: true });
    }

    if (data.status === 'PUBLISHED' && project.status !== 'PUBLISHED') {
      updateData.publishedAt = new Date();
    }

    const updated = await this.projectRepository.update(id, updateData);
    if (!updated) throw new Error('Failed to update project');
    return updated;
  }

  async deleteProject(id: string) {
    const project = await this.projectRepository.findById(id);
    if (!project || project.isDeleted) throw new Error('Project not found');

    // Soft delete
    return this.projectRepository.update(id, { isDeleted: true });
  }
}
