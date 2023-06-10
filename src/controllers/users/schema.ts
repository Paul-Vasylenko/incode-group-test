import { z as zod } from 'zod';

export const loginSchema = zod.object({
  email: zod.string().email(),
  password: zod
    .string()
    .min(4)
    .refine(
      (value) => {
        const hasNumber = /[0-9]/.test(value);
        const hasUppercase = /[A-Z]/.test(value);
        const hasSymbol = /[!@#$%^&*]/.test(value);

        return hasNumber && hasUppercase && hasSymbol;
      },
      {
        message:
          'Invalid password. Password must contain at least one number, one uppercase letter, and one symbol.',
      },
    ),
});

export type LoginSchema = zod.infer<typeof loginSchema>
