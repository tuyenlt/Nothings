import CommentInput from '@/components/shared/CommentInput'
import CommentSection from '@/components/shared/CommentSection'
import Loader from '@/components/shared/Loader'
import PostStats from '@/components/shared/PostStats'
import { Button } from '@/components/ui/button'
import { useUserContext } from '@/context/AuthContext'
import { useGetPostById } from '@/lib/react-query/queriesAndMutations'
import { multiFormatDateString } from '@/lib/utils'
import { Link, useParams } from 'react-router-dom'

const PostDetails = () => {
    const { id } = useParams()
    const { data: post, isPending: isLoading } = useGetPostById(id)
    const { user } = useUserContext()
    if (post == undefined) return

    return (
        <div className="container">
            <div className='post_details-container'>
                <Button className='w-20 ml-3 flex-grow-0' variant="ghost">
                    <Link to="/">
                        <img
                            src="/assets/icons/back-arrow.svg"
                            alt="back"
                            className='w-10'
                        />
                    </Link>
                </Button>
                {isLoading ? <Loader /> : (
                    <div className="post-card">
                        <div className="flex-between">
                            <div className="flex items-center gap-3">
                                <Link to={`/profile/${post.creator.$id}`}>
                                    <img
                                        src={
                                            post.creator?.imageUrl ||
                                            "/assets/icons/profile-placeholder.svg"
                                        }
                                        alt="creator"
                                        className="w-12 lg:h-12 rounded-full"
                                    />
                                </Link>

                                <div className="flex flex-col">
                                    <p className="base-medium lg:body-bold text-light-1">
                                        {post.creator.name}
                                    </p>
                                    <div className="flex items-center gap-2 text-light-3">
                                        <p className="subtle-semibold lg:small-regular ">
                                            {multiFormatDateString(post.$createdAt)}
                                        </p>
                                        •
                                    </div>
                                </div>
                            </div>

                        </div>

                        <Link to={`/posts/${post.$id}`}>
                            <div className="small-medium lg:base-medium py-5">
                                <p>{post.caption}</p>
                                <ul className="flex gap-1 mt-2">
                                    {post.tags.map((tag: string, index: string) => (
                                        <li key={`${tag}${index}`} className="text-light-3 small-regular">
                                            #{tag}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {
                                post.imageUrl ?
                                    <img
                                        src={post.imageUrl}
                                        alt="post image"
                                        className="post-detail_img"
                                    />
                                    : <div></div>
                            }
                        </Link>

                        <PostStats post={post} userId={user.id} />
                        <hr className="border-t border-border my-4" />
                        <CommentSection post={post} currentUserId={user.id} />
                        <hr className="border-t border-border my-4" />
                        <CommentInput userId={user.id} postId={post.$id} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default PostDetails