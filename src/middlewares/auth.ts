
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  if(req.header('Authorization')){
    const authHeader = req.header('Authorization').split(' ');

    if(authHeader.length > 0) {
      const token = authHeader[1];

      if(token){
        try {
          const decoded = jwt.verify(token, process.env.SECRET_KEY || 'secret');
          req.user = decoded;

          next();
        } catch (error) {
          return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
      } else {
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
      }
    }
  } else {
    res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

}
