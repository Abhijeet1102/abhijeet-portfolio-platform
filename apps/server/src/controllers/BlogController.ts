import { Request, Response } from 'express';
import { BlogService } from '../services/BlogService';

const blogService = new BlogService();

export class BlogController {
  async getAll(req: Request, res: Response) {
    try {
      const result = await blogService.getAllBlogs(req.query);
      res.status(200).json({ status: 'success', data: result });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getBySlug(req: Request, res: Response) {
    try {
      const blog = await blogService.getBlogBySlug(req.params.slug as string);
      res.status(200).json({ status: 'success', data: blog });
    } catch (error: any) {
      res.status(404).json({ status: 'error', message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      // User ID from auth middleware
      const authorId = (req as any).user.id;
      const blog = await blogService.createBlog(req.body, authorId);
      res.status(201).json({ status: 'success', data: blog });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const blog = await blogService.updateBlog(req.params.id as string, req.body);
      res.status(200).json({ status: 'success', data: blog });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await blogService.deleteBlog(req.params.id as string);
      res.status(200).json({ status: 'success', message: 'Blog deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
}
