import {getAuthSession} from "@/lib/auth";
import {db} from "@/lib/db";
import {SubrreditValidator} from "@/lib/validators/subrredit";
import {z} from "zod"
import {NextApiRequest, NextApiResponse} from "next";
import {INFINITE_SCROLL_PAGINATION_RESULTS} from "@/config";

export async function POST(req : Request) {
    try {
        const session = await getAuthSession()
        if(!session?.user) {
            return new Response('Unauthorized', {status: 401})
        }
        const body = await req.json()
        const {name} = SubrreditValidator.parse(body)
        const existedSubbredit = await db.subreddit.findFirst({
            where: {
                name,
            },
        })
        if (existedSubbredit) {
            return new Response('Subreddit already existed', {status: 409})
        }
        const subreddit = await db.subreddit.create({
            data: {
                userId: session.user.id,
                name
            }
        })
        await db.subscription.create({
            data: {
                subredditId: subreddit.id,
                userId: session.user.id
            }
        })
        return new Response(subreddit.name)
    } catch (e) {
        if (e instanceof z.ZodError) {
            return new Response(e.message, {status: 422})
        }
        return new Response('Could not create subreddit', {status: 500})
    }
}

export async function GET(req: NextApiRequest,res : NextApiResponse) {
    const {query: {name}} = req
    try {
        const subreddit = await db.subreddit.findFirst({
            where: {
                // @ts-ignore
                name
            },
            include: {
                posts: {
                    include: {
                        author: true,
                        votes: true,
                        comments: true,
                        subreddit: true
                    }
                }
            },
            take: INFINITE_SCROLL_PAGINATION_RESULTS
        })
        if(!subreddit) {
            return new Response(null)
        }
        return res.json(subreddit)
    } catch (e) {
        return new Response('Could find subreddit', {status: 500})
    }
}