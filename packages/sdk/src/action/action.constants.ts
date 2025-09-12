import { z } from 'zod';

export const defaultActionSchema = z.object({
  playerId: z.string()
});
export type DefaultSchema = typeof defaultActionSchema;
