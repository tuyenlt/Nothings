import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery
} from '@tanstack/react-query'
import { fetchCoins, getCnnPosts, getCodeforceContest, getVnexpessPosts } from './api';

export const  useGetCodeforceContest = () =>{
    return useQuery({
        queryKey: ["getCodeforceContest"],
        queryFn: getCodeforceContest,
    });
}
export const  useFetchCoins = () =>{
    return useQuery({
        queryKey: ["fetchCoins"],
        queryFn: fetchCoins
    });
}

export const  useGetVnexpessPosts = (postCategory : string, postLimit : number) =>{
    return useQuery({
        queryKey: ["getVnexpessPosts"],
        queryFn: () => getVnexpessPosts(postCategory,postLimit),
    });
}
export const  useGetCnnPosts = (postCategory : string, postLimit : number) =>{
    return useQuery({
        queryKey: ["getCnnPosts"],
        queryFn: () => getCnnPosts(postCategory,postLimit),
    });
}

export const invalidateGetCnnPost = () =>{
    const queryClient = useQueryClient();
    queryClient.invalidateQueries({
      queryKey: ["getCnnPosts"],
    });
  }