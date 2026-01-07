import jwt from "jsonwebtoken";

const SECRET = "RBAC_SECRET";

export const authService = {
  sign(uid: number) {
    return jwt.sign({ uid }, SECRET, { expiresIn: "2h" });
  },
  verify(token: string) {
    return jwt.verify(token, SECRET) as { uid: number };
  },
};
