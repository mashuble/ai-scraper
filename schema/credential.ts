import { z } from "zod";

export const createCredentialSchema = z.object({
    name: z.string().min(1),
    value: z.string(),
});

export type CreateCredentialSchemaType = z.infer<typeof createCredentialSchema>;