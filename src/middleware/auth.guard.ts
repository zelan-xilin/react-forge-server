import { eq } from "drizzle-orm"
import { NextFunction, Request, Response } from "express"
import { db } from "../db"
import { authService } from "../modules/auth/auth.service"
import { user } from "../modules/user/user.schema"

export async function authGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.replace("Bearer ", "")
  if (!token) return res.sendStatus(401)

  try {
    const { uid } = authService.verify(token)

    const userData = await db.select().from(user).where(eq(user.id, uid)).limit(1)
    if (!userData.length) {
      return res.status(401).json({ error: "User not found" })
    }

    req.user = {
      userId: userData[0].id,
      username: userData[0].username,
      roleId: userData[0].roleId,
      status: userData[0].status,
    }

    next()
  } catch {
    res.status(401).json({ error: "Invalid token" })
  }
}
