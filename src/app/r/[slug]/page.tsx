
import {db} from "@/lib/db";
import {INFINITE_SCROLL_PAGINATION_RESULTS} from "@/config";
import {notFound} from "next/navigation";
import {getAuthSession} from "@/lib/auth";
import MiniCreatePost from "@/components/MiniCreatePost";

interface PageProps {
    params : {
        slug: string
    }
}
interface subreddit {
    name : string
}
const Page  = async ({params} : PageProps) => {
    const session = await getAuthSession()
    const {slug} = params
    const subreddit = await db.subreddit.findFirst({
        where: { name: slug },
        include: {
            posts: {
                include: {
                    author: true,
                    votes: true,
                    comments: true,
                    subreddit: true,
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: INFINITE_SCROLL_PAGINATION_RESULTS,
            },
        },
    })

    if (!subreddit) return notFound()
    return (
        <>
            <h1 className='font-bold text-3xl md:text-4xl h-14'>
                r/{subreddit.name}
            </h1>
            <MiniCreatePost session={session} />
        </>
    );
};

export default Page