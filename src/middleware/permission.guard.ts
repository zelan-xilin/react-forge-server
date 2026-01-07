import { NextFunction, Request, Response } from "express";

export function permissionGuard(moduleAction: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.isAdmin === 1 || req.user?.actions.includes(moduleAction)) {
      return next();
    }

    return res.status(403).json({ error: "No permission" });
  };
}
