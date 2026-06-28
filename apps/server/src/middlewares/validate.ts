import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';

export const validate = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: (error as any).errors.map((e: any) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  };
};
