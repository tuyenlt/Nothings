import { Models } from "appwrite";
import { useState } from "react";
import { useLocation } from "react-router-dom";

import { checkIsLiked } from "@/lib/utils";
import { useLikePost } from "@/lib/react-query/queriesAndMutations";

type PostStatsProps = {
    post: Models.Document;
    userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
    const location = useLocation();
    const likesList = post.likes.map((user: Models.Document) => user.$id);
    const commentsList = post.comments.map((user: Models.Document) => user.$id)
    const [likes, setLikes] = useState<string[]>(likesList);

    const { mutate: likePost } = useLikePost();


    const handleLikePost = (
        e: React.MouseEvent<HTMLImageElement, MouseEvent>
    ) => {
        e.stopPropagation();

        let likesArray = [...likes];

        if (likesArray.includes(userId)) {
            likesArray = likesArray.filter((Id) => Id !== userId);
        } else {
            likesArray.push(userId);
        }

        setLikes(likesArray);
        likePost({ postId: post.$id, likesArray });
    };


    const containerStyles = location.pathname.startsWith("/profile")
        ? "w-full"
        : "";

    return (
        <div
            className={`flex items-center z-20 ${containerStyles}`}>
            <div className="flex gap-2 mr-5">
                <img
                    src={`${checkIsLiked(likes, userId)
                        ? "/assets/icons/liked.svg"
                        : "/assets/icons/like.svg"
                        }`}
                    alt="like"
                    width={20}
                    height={20}
                    onClick={(e) => handleLikePost(e)}
                    className="cursor-pointer"
                />
                <p className="small-medium lg:base-medium">{likes.length}</p>
            </div>
            <div className="flex gap-2 mr-5">
                <img
                    src="/assets/icons/comments.svg"
                    alt="like"
                    width={20}
                    height={20}
                />
                <p className="small-medium lg:base-medium">{commentsList.length}</p>
            </div>

        </div>
    );
};

export default PostStats