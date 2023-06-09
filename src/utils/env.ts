import { z as zod } from "zod";

const EnvSchema = zod.object({
    PORT: zod.string().nonempty()
});

type TEnv = zod.infer<typeof EnvSchema>;

export const getValidEnv = () : TEnv => {
    const env = EnvSchema.safeParse(process.env);

    if (!env.success) {
        const formatted = env.error.format();

        console.error("### ENV validation error");
        throw new Error(JSON.stringify(formatted));
    }

    return env.data;
}