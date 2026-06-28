import { Request, Response } from 'express';
import { ProjectService } from '../services/ProjectService';

const projectService = new ProjectService();

export class ProjectController {
  async getAll(req: Request, res: Response) {
    try {
      const result = await projectService.getAllProjects(req.query);
      res.status(200).json({ status: 'success', data: result });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getBySlug(req: Request, res: Response) {
    try {
      const project = await projectService.getProjectBySlug(req.params.slug as string);
      res.status(200).json({ status: 'success', data: project });
    } catch (error: any) {
      res.status(404).json({ status: 'error', message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const project = await projectService.createProject(req.body);
      res.status(201).json({ status: 'success', data: project });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const project = await projectService.updateProject(req.params.id as string, req.body);
      res.status(200).json({ status: 'success', data: project });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await projectService.deleteProject(req.params.id as string);
      res.status(200).json({ status: 'success', message: 'Project deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
}
