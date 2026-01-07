import cors from "cors";
import express from "express";
import { authRoutes } from "./modules/auth/auth.routes";
import { roleRoutes } from "./modules/role/role.routes";
import { userRoutes } from "./modules/user/user.routes";

export const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/role", roleRoutes);
app.use("/user", userRoutes);
