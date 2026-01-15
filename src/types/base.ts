export const STATUS = {
  DISABLE: 0,
  ENABLE: 1,
} as const;
export type STATUS = (typeof STATUS)[keyof typeof STATUS];

export const IS_ADMIN = {
  NO: 0,
  YES: 1,
} as const;
export type IS_ADMIN = (typeof IS_ADMIN)[keyof typeof IS_ADMIN];
