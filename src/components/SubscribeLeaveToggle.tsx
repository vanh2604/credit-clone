'use client'
import {FC, startTransition} from "react";
import {Button} from "@/components/ui/Button";
import {useMutation} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import {SubscribeToSubredditPayload} from "@/lib/validators/subrredit";
import {toast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {useCustomToasts} from "@/hooks/useCustomToast";

interface SubscribeLeaveToggleProps {
    isSubscribed: boolean,
    subredditId: string,
    subredditName: string
}


const SubscribeLeaveToggle : FC<SubscribeLeaveToggleProps> = ({ isSubscribed, subredditName, subredditId }) => {
    const router = useRouter()
    const {loginToast} = useCustomToasts()
    const {mutate : subscribe,isLoading: isSubLoading } = useMutation({
        mutationFn: async () => {
            const payload : SubscribeToSubredditPayload = {
                subredditId,
            }
            console.log(typeof subredditId)
            const {data} = await axios.post('/api/subreddit/subscribe',payload)
            return data as string
        },
        onError: (error) => {
          if(error instanceof AxiosError) {
              console.log(error?.response)
              if (error.response?.status === 401) {
                  return loginToast()
              }
          }
            return toast({
                title: 'There was a problem.',
                description: 'Something went wrong. Please try again.',
                variant: 'destructive',
            })
        },
        onSuccess: () => {
            startTransition(() => {
                // Refresh the current route and fetch new data from the server without
                // losing client-side browser or React state.
                router.refresh()
            })
            toast({
                title: 'Subscribed!',
                description: `You are now subscribed to r/${subredditName}`,
            })
        },
    })
    const {mutate : unsubscribe,isLoading: isUnSubLoading } = useMutation({
        mutationFn: async () => {
            const payload : SubscribeToSubredditPayload = {
                subredditId,
            }
            const {data} = await axios.post('/api/subreddit/unsubscribe',payload)
            return data as string
        },
        onError: (error) => {
            if(error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    return loginToast()
                }
            }
            return toast({
                title: 'There was a problem.',
                description: 'Something went wrong. Please try again.',
                variant: 'destructive',
            })
        },
        onSuccess: () => {
            startTransition(() => {
                // Refresh the current route and fetch new data from the server without
                // losing client-side browser or React state.
                router.refresh()
            })
            toast({
                title: 'Unsubscribed!',
                description: `You are now unsubscribed from r/${subredditName}`,
            })
        },
    })
    return (
        <>
            {isSubscribed ? (
            <Button
                className='w-full mt-1 mb-4'
                isLoading={isUnSubLoading}
                onClick={() => unsubscribe()}>
                Leave community
            </Button>
            ) : (
            <Button
                className='w-full mt-1 mb-4'
                isLoading={isSubLoading}
                onClick={() => subscribe()}>
                Join to post
            </Button>
            )}
        </>
    );
};

export default SubscribeLeaveToggle
