import { z } from "zod";

//validacões de campos usando zod

export const registerSchema = z.object({
  Name: z.string().min(4),
  Email: z.string().email(),
  Password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export const loginSchema = z.object({
  Email: z.string().email(),
  Password: z.string().min(8),
});
