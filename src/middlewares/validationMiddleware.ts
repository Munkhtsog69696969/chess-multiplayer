import { Response, Request, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validationMiddleware = [
  body('name')
    .isLength({ min: 3, max: 50 })
    .withMessage('Name must be between 2 and 50 characters long'),
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
]