import cors from "cors";
import express from "express";
import { areaRoutes } from "./modules/area/area.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { roleRoutes } from "./modules/role/role.routes";
import { userRoutes } from "./modules/user/user.routes";

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/roles", roleRoutes);
app.use("/users", userRoutes);
app.use("/areas", areaRoutes);
