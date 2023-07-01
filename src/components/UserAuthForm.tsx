'use client'
import {FC, useState} from "react";
import {Button} from "@/components/ui/Button";
import {cn} from "@/lib/utils";
import {Icons} from '@/components/Icon'
import {signIn} from 'next-auth/react'
import {useToast} from "@/hooks/use-toast";


interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
}

export const UserAuthForm: FC<UserAuthFormProps> = ({className, ...props}) => {
    const [isLoading, setIsLoading] = useState(false)
    const {toast} = useToast();
    const loginWithGoogle = async () => {
        setIsLoading(true)
        try {
            await signIn('google')
        } catch (e) {
            toast({
                title: 'Error',
                description: 'There was an error logging in with Google',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className={cn('flex justify-center', className)} {...props}>
            <Button
                isLoading={isLoading}
                type='button'
                size='sm'
                className='w-full'
                onClick={loginWithGoogle}
                disabled={isLoading}>
                {isLoading ? null : <Icons.google className='h-4 w-4 mr-2'/>}
                Google
            </Button>
        </div>
    )
}