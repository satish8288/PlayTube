const baseOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
});

export const accessTokenOptions = () => ({
  ...baseOptions(),
  maxAge: 15 * 60 * 1000,
});

export const refreshTokenOptions = () => ({
  ...baseOptions(),
  maxAge: 7 * 24 * 60 * 60 * 1000,
});