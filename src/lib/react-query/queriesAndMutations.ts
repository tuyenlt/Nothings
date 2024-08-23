import { INewComment, INewPost, INewUser, IUpdatePost } from '@/types'
import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery
} from '@tanstack/react-query'
import { QUERY_KEYS } from './queryKeys'

import { createUserAcount, signInAccount, signOutAccount , createPost, getRecentPosts, getUsers, likePost, getCurrentUser, getPostById, getUserById, createNewComment, likeComment} from '../appwrite/api'
import { Models } from 'appwrite'
import { getCnnPosts } from '../daily-news/api'

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn : (user : INewUser) => createUserAcount(user)
    })
}
export const useSigninAccount = () => {
    return useMutation({
        mutationFn : (user : {email : string, password : string}) => signInAccount(user)
    })
}
export const useSignOutAccount = () => {
    return useMutation({
        mutationFn : () => signOutAccount()
    })
}

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (post: INewPost) => createPost(post),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
      },
    });
  };

//   export const useUpdatePost = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//       mutationFn: (post: IUpdatePost) => updatePost(post),
//       onSuccess: (data) => {
//         queryClient.invalidateQueries({
//           queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
//         });
//       },
//     });
//   };


export const useGetRecentPosts = () => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      queryFn: getRecentPosts,
    });
  };

export const useGetUsers = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(limit),
  });
};
  

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string;
      likesArray: string[];
    }) => likePost(postId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};


export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};


export const useGetPostById = (postId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};

// export const useGetCommentsList = (post : Models.Document) => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.GET_POST_BY_ID, post],
//     queryFn: () => getCommentsList(post),
//   });
// };


export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};


export const useCreateNewComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      comment
    : INewComment) => createNewComment(comment),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.post.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};


export const useLikeComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      commentId,
      likesArray,
    }: {
      commentId: string;
      likesArray: string[];
    }) => likeComment(commentId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.post.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

