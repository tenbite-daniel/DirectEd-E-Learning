import dotenv from "dotenv";

dotenv.config();

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required");
  }
  return secret;
};

export { getJwtSecret };
