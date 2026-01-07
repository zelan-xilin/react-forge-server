import { NextFunction, Request, Response } from "express"

export function permissionGuard(requiredPath: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.isAdmin === 1) {
      return next()
    }

    return res.status(403).json({ error: "No permission" })
  }
}