declare global {
  namespace Express {
    interface Request {
      user:
        | {
            userId: number;
            username: string;
            roleId: number | null;
            status: number;
            isAdmin: number;
            actions: string[];
          }
        | undefined;
    }
  }
}

export {};
