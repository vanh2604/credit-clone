import {FC} from "react";
import {AvatarProps} from "@radix-ui/react-avatar";
import {User} from "next-auth";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Icons} from '@/components/Icon'
import Image from "next/image";
interface UserAvatarProps extends AvatarProps{
    user: Pick<User, 'image' | 'name'>
}
export const UserAvatar : FC<UserAvatarProps> = ({user,...props }) => {
    return (
        <Avatar {...props}>
            {user?.image ? (
            <div className='relative aspect-square h-full w-full'>
                <Image
                    fill
                    // @ts-ignore
                    src={user.image}
                    alt='profile picture'
                    referrerPolicy='no-referrer'
                />
            </div>
            ) : (
            <AvatarFallback>
                <span className='sr-only'>{user?.name}</span>
                <Icons.user className='h-4 w-4' />
            </AvatarFallback>
            )}
        </Avatar>
    );
};
