import { NextFunction, Request, Response } from "express";
import { DISABLE_API_PERMISSION_GUARD } from "../config";

export function permissionGuard(moduleAction: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (DISABLE_API_PERMISSION_GUARD || req.user?.isAdmin === 1 || req.user?.actions.includes(moduleAction)) {
      return next();
    }

    return res
      .status(403)
      .json({
        message: "权限不足",
        data: null
      });
  };
}
