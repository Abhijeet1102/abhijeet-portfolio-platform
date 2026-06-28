import slugify from 'slugify';
import { BlogRepository } from '../repositories/BlogRepository';
import { CreateBlogDto, UpdateBlogDto } from '../validators/blog.dto';

export class BlogService {
  private blogRepository: BlogRepository;

  constructor() {
    this.blogRepository = new BlogRepository();
  }

  async getAllBlogs(query: any) {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const filter: any = { isDeleted: false };
    
    if (query.categories) filter.categories = query.categories;
    if (query.status) filter.status = query.status;
    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { excerpt: { $regex: query.search, $options: 'i' } }
      ];
    }

    return this.blogRepository.findAll(filter, {
      page,
      limit,
      sort: query.sort as string || 'createdAt',
      order: query.order as 'asc' | 'desc' || 'desc',
    });
  }

  async getBlogBySlug(slug: string) {
    const blog = await this.blogRepository.findBySlug(slug);
    if (!blog) throw new Error('Blog not found');
    
    // Increment view count could go here
    return blog;
  }

  async createBlog(data: CreateBlogDto, authorId: string) {
    const slug = slugify(data.title, { lower: true, strict: true });
    
    const existing = await this.blogRepository.findBySlug(slug);
    if (existing) {
      throw new Error('Blog with this title already exists');
    }

    return this.blogRepository.create({
      ...data,
      slug,
      author: authorId as any,
      publishedAt: data.status === 'PUBLISHED' ? new Date() : undefined
    });
  }

  async updateBlog(id: string, data: UpdateBlogDto) {
    const blog = await this.blogRepository.findById(id);
    if (!blog || blog.isDeleted) throw new Error('Blog not found');

    const updateData: any = { ...data };
    
    if (data.title && data.title !== blog.title) {
      updateData.slug = slugify(data.title, { lower: true, strict: true });
    }

    if (data.status === 'PUBLISHED' && blog.status !== 'PUBLISHED') {
      updateData.publishedAt = new Date();
    }

    const updated = await this.blogRepository.update(id, updateData);
    if (!updated) throw new Error('Failed to update blog');
    return updated;
  }

  async deleteBlog(id: string) {
    const blog = await this.blogRepository.findById(id);
    if (!blog || blog.isDeleted) throw new Error('Blog not found');

    return this.blogRepository.update(id, { isDeleted: true });
  }
}
