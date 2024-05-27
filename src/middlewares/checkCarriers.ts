
import { NextFunction, Response } from 'express';

export const checkCarriers = (req: any, res: Response, next: NextFunction) => {
  const { carrier } = req.body || {};

  if (carrier) {
    if (process.env.SUPPORTED_CARRIERS.includes(carrier)) {
      next();
    } else {
      return res.status(401).json({ message: `${carrier} is not a supported carrier!` });
    }
  } else {
    return res.status(400).json({ message: "BAD REQUEST | Required parameter 'Carrier' is missing" });
  }
}
