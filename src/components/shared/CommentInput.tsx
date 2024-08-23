import { useCreateNewComment, useGetUserById } from '@/lib/react-query/queriesAndMutations'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from '../ui/textarea'
import { useToast } from '../ui/use-toast'
import { Loader } from 'lucide-react'

const formSchema = z.object({
    content: z.string().min(2, {
        message: "comment must be at least 2 characters.",
    }).max(2200, {
        message: "maximum size of comment is 2200 characters"
    }),
})

type Probs = {
    userId: string
    postId: string
}

const CommentInput = ({ userId, postId }: Probs) => {
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
        },
    })

    const { data: user } = useGetUserById(userId)
    const { mutateAsync: createComment, isPending } = useCreateNewComment()

    const onSubmit = async (value: z.infer<typeof formSchema>) => {
        const newComment = await createComment({
            userId: userId,
            postId: postId,
            content: value.content
        })

        if (!newComment) {
            toast({
                title: `add comment failed. Please try again.`,
            });
        } else {
            toast({
                title: `add comment success`,
            });
        }
        form.reset()
    }

    return (
        <div className="comment-input flex w-full items-center gap-4">
            <div className="w-15 flex-grow-0">
                <img
                    src={
                        user?.imageUrl ||
                        "/assets/icons/profile-placeholder.svg"
                    }
                    alt="creator"
                    className="w-14 lg:h-14 rounded-full"
                />
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-4 items-center flex-grow">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem className='flex-grow'>
                                <FormControl>
                                    <Textarea placeholder="Enter Your Comment" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        disabled={isPending}
                    >
                        {isPending ? <Loader /> : "Send"
                        }
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default CommentInput