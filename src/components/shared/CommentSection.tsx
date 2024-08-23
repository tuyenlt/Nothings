import { multiFormatDateString } from '@/lib/utils'
import { Models } from 'appwrite'
import { Loader } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import Comment from './Comment'

type Probs = {
    post: Models.Document
    currentUserId: string
}

const CommentSection = ({ post, currentUserId }: Probs) => {
    const commentsList = post.comments

    return (
        <div className="comments-sections flex flex-col space-y-4 pt-4">
            {
                commentsList.map((comment: any) => (
                    <Comment comment={comment} userId={currentUserId} />
                ))

            }
        </div>
    )
}

export default CommentSection