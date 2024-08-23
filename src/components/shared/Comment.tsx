import { useLikeComment } from '@/lib/react-query/queriesAndMutations'
import { checkIsLiked, multiFormatDateString } from '@/lib/utils'
import { Models } from 'appwrite'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

type Probs = {
    comment: Models.Document
    userId: string
}

const Comment = ({ comment, userId }: Probs) => {

    const likesList = comment.likes.map((user: Models.Document) => user.$id);
    const [likes, setLikes] = useState<string[]>(likesList);

    const { mutate: likeComment } = useLikeComment();

    const handleLikeComment = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        e.stopPropagation()
        let likesArray = [...likes];

        if (likesArray.includes(userId)) {
            likesArray = likesArray.filter((Id) => Id !== userId);
        } else {
            likesArray.push(userId);
        }

        setLikes(likesArray);
        likeComment({ commentId: comment.$id, likesArray: likesArray });
    }

    return (
        <div className="comment-single">
            <div className="flex-between">
                <div className="flex gap-3">
                    <Link to={`/profile/${comment.creator.$id}`}>
                        <img
                            src={
                                comment.creator?.imageUrl ||
                                "/assets/icons/profile-placeholder.svg"
                            }
                            alt="creator"
                            className="w-10 lg:h-10 rounded-full"
                        />
                    </Link>

                    <div className="flex flex-col">
                        <p className="base-comment  text-light-1">
                            {comment.creator.name}
                        </p>
                        <div className="flex items-center gap-2 text-light-3 ">
                            <p className="subtle-semibold lg:small-regular ">
                                {multiFormatDateString(comment.$createdAt)}
                            </p>
                            •
                        </div>
                        <div className="small-medium">
                            {comment.content}
                        </div>
                        <div className="flex gap-2 mr-5">
                            <img
                                src={`${checkIsLiked(likes, userId)
                                    ? "/assets/icons/liked.svg"
                                    : "/assets/icons/like.svg"
                                    }`}
                                alt="like"
                                width={15}
                                height={15}
                                onClick={(e) => handleLikeComment(e)}
                                className="cursor-pointer"
                            />
                            <p className="small-medium lg:smal-medium text-light-3">{likes.length}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Comment