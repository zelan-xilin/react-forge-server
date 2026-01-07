import { Request, Response } from "express"
import { z } from "zod"
import { userService } from "../user/user.service"
import { authService } from "./auth.service"

const LoginDTO = z.object({
  username: z.string().min(1, "用户名不能为空"),
  password: z.string().min(6, "密码至少 6 位"),
})

export const authController = {
  async login(req: Request, res: Response) {
    const parsed = LoginDTO.safeParse(req.body)

    if (!parsed.success) {
      const errors = parsed.error.issues.map(issue => ({
        field: issue.path.join("."),
        message: issue.message,
      }))
      return res.status(400).json({ errors })
    }

    const { username, password } = parsed.data
    const user = await userService.validate(username, password)
    if (!user) return res.status(401).json({ error: "Invalid credentials" })

    const token = authService.sign(user.id)
    res.json({ token })
  },
}
