import { Request, Response } from "express"
import { z } from "zod"
import { roleService } from "./role.service"

const CreateRoleDTO = z.object({
  name: z.string().min(1, "角色名不能为空").max(50, "角色名不能超过50个字符"),
  description: z.string().max(200, "描述不能超过200个字符").optional(),
})

const UpdateRoleDTO = z.object({
  name: z.string().min(1).max(50).optional(),
  description: z.string().max(200).optional(),
})

const SetRoutePermissionsDTO = z.object({
  paths: z.array(z.string()),
})

export const roleController = {
  async create(req: Request, res: Response) {
    const parsed = CreateRoleDTO.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.issues.map(issue => ({
          field: issue.path.join("."),
          message: issue.message,
        }))
      })
    }

    await roleService.create({
      ...parsed.data,
      userId: req.user?.userId,
    })

    res.json({ success: true })
  },

  async update(req: Request, res: Response) {
    const parsed = UpdateRoleDTO.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.issues.map(issue => ({
          field: issue.path.join("."),
          message: issue.message,
        }))
      })
    }

    await roleService.update(Number(req.params.id), {
      ...parsed.data,
      userId: req.user?.userId,
    })

    res.json({ success: true })
  },

  async delete(req: Request, res: Response) {
    await roleService.delete(Number(req.params.id))
    res.json({ success: true })
  },

  async list(req: Request, res: Response) {
    const data = await roleService.list()
    res.json(data)
  },

  async page(req: Request, res: Response) {
    const page = Number(req.query.page) || 1
    const pageSize = Number(req.query.pageSize) || 10
    const name = typeof req.query.name === "string" && req.query.name ? req.query.name : undefined
    const data = await roleService.page({ name, page, pageSize })
    res.json(data)
  },

  async setRoutePermissions(req: Request, res: Response) {
    const parsed = SetRoutePermissionsDTO.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.issues.map(issue => ({
          field: issue.path.join("."),
          message: issue.message,
        }))
      })
    }

    await roleService.setRoutePermissions(Number(req.params.id), parsed.data.paths)
    res.json({ success: true })
  },

  async getRoutePermissions(req: Request, res: Response) {
    const data = await roleService.getRoutePermissions(Number(req.params.id))
    res.json(data)
  },
}