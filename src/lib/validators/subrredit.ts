import {z} from 'zod'

export const SubrreditValidator = z.object({
    name : z.string().min(3).max(21)
})

export const SubreditSubcriptionValidator = z.object({
    subredditId: z.string()
})

export type SubscribeToSubredditPayload = z.infer<typeof SubreditSubcriptionValidator>
export type CreateSubredditPayload = z.infer<typeof SubrreditValidator>