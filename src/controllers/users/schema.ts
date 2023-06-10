import { z as zod } from 'zod';
const passwordSchema = zod
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
  );

export const loginSchema = zod.object({
  email: zod.string().email(),
  password: passwordSchema,
});

export type LoginSchema = zod.infer<typeof loginSchema>;

export const registerSchema = zod
  .object({
    firstName: zod.string().nonempty(),
    lastName: zod.string().nonempty(),
    email: zod.string().nonempty(),
    password: passwordSchema,
    confirmPassword: passwordSchema,
    bossId: zod.string().uuid().nullable(),
    role: zod.string().nonempty(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // path of error
  });

export type RegisterSchema = zod.infer<typeof registerSchema>;

export const updateBossSchema = zod.object({
  bossId: zod.string().uuid(),
  id: zod.string().uuid(),
});

export type UpdateBossSchema = zod.infer<typeof updateBossSchema>;
