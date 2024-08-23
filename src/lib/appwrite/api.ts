import { INewComment, INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, appwriteConfig, avartars, databases , storage} from "./config";
import { ID ,Models,Query} from "appwrite";
import PostCard from "@/components/shared/PostCard";
import { Content } from "@radix-ui/react-select";

export async function createUserAcount(user : INewUser) {
    try{
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        )
        if(!newAccount) throw Error
        const avartarUrl = avartars.getInitials(user.name)

        const newUser = await saveUserToDB({
            accountId : newAccount.$id,
            email : newAccount.email,
            name : newAccount.name,
            userName : user.username,
            imageUrl : avartarUrl, 
        })

        return newUser
    }catch(error){
        console.log(error)
        return error
    }
}


export async function saveUserToDB(user : {
    accountId : string,
    email : string,
    name : string,
    imageUrl : URL, 
    userName : string,
}) {
    try{
        const newUser = await databases.createDocument(
            appwriteConfig.databaseID,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        )
        return newUser
    }catch (error){
        console.log(error)
    }
}
export async function signInAccount(user : {
    email : string,
    password : string
}) {
    try{
        const session = await account.createEmailPasswordSession(user.email,user.password)
        console.log(session)
        return session
    }catch (error){
        console.log(error)
    }
}

export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      console.log(error);
    }
  }

export async function getCurrentUser() {
    try {
      const currentAccount = await getAccount();
  
      if (!currentAccount) throw Error;
  
      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseID,
        appwriteConfig.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );
  
      if (!currentUser) throw Error;
  
      return currentUser.documents[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }

export async function signOutAccount() {
    try {
        const session = await account.deleteSession("current")
        return session
    } catch (error) {
        console.log(error)
    }
}


export async function createPost(post: INewPost) {
    try {
      // Upload file to appwrite storage
      let fileUrl = undefined
      let imgID = undefined
      if(post.file?.length > 0){
        const uploadedFile = await uploadFile(post.file[0]);
        
        if (!uploadedFile) throw Error;
        
        // Get file url
        fileUrl = getFilePreview(uploadedFile.$id);
        imgID = uploadedFile.$id

        if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }
    }
  
      // Convert tags into array
      const tags = post.tags?.replace(/ /g, "").split(",") || [];
  
      // Create post
      const newPost = await databases.createDocument(
        appwriteConfig.databaseID,
        appwriteConfig.postCollectionId,
        ID.unique(),
        {
          creator: post.userId,
          caption: post.caption,
          imageUrl: fileUrl,
          imageId: imgID,
          tags: tags,
        }
      );

      if (!newPost && imgID) {
        await deleteFile(imgID);
        throw Error;
      }
  
      return newPost;
    } catch (error) {
      console.log(error);
    }
  }
  


  // ============================== UPLOAD FILE
export async function uploadFile(file: File) {
    try {
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageID,
        ID.unique(),
        file
      );
  
      return uploadedFile;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== GET FILE URL
  export function getFilePreview(fileId: string) {
    try {
      const fileUrl = storage.getFilePreview(
        appwriteConfig.storageID,
        fileId,
        2000,
        2000,
        undefined,
        100
      );
  
      if (!fileUrl) throw Error;
  
      return fileUrl;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== DELETE FILE
  export async function deleteFile(fileId: string) {
    try {
      await storage.deleteFile(appwriteConfig.storageID, fileId);
  
      return { status: "ok" };
    } catch (error) {
      console.log(error);
    }
  }


  export async function updatePost(post: IUpdatePost) {
    const hasFileToUpdate = post.file.length > 0;
  
    try {
      let image = {
        imageUrl: post.imageUrl,
        imageId: post.imageId,
      };
  
      if (hasFileToUpdate) {
        // Upload new file to appwrite storage
        const uploadedFile = await uploadFile(post.file[0]);
        if (!uploadedFile) throw Error;
  
        // Get new file url
        const fileUrl = getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
          await deleteFile(uploadedFile.$id);
          throw Error;
        }
  
        image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
      }
  
      // Convert tags into array
      const tags = post.tags?.replace(/ /g, "").split(",") || [];
  
      //  Update post
      const updatedPost = await databases.updateDocument(
        appwriteConfig.databaseID,
        appwriteConfig.postCollectionId,
        post.postId,
        {
          caption: post.caption,
          imageUrl: image.imageUrl,
          imageId: image.imageId,
          tags: tags,
        }
      );
  
      // Failed to update
      if (!updatedPost) {
        // Delete new file that has been recently uploaded
        if (hasFileToUpdate) {
          await deleteFile(image.imageId);
        }
  
        // If no new file uploaded, just throw error
        throw Error;
      }
  
      // Safely delete old file after successful update
      if (hasFileToUpdate) {
        await deleteFile(post.imageId);
      }
  
      return updatedPost;
    } catch (error) {
      console.log(error);
    }
  }
  


  export async function getRecentPosts() {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseID,
        appwriteConfig.postCollectionId,
        [Query.orderDesc("$createdAt"), Query.limit(20)]
      );
  
      if (!posts) throw Error;
  
      return posts;
    } catch (error) {
      console.log(error);
    }
  }

  
  // ============================== GET POSTS
  export async function searchPosts(searchTerm: string) {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseID,
        appwriteConfig.postCollectionId,
        [Query.search("caption", searchTerm)]
      );
  
      if (!posts) throw Error;
  
      return posts;
    } catch (error) {
      console.log(error);
    }
  }
  
  export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
    const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];
  
    if (pageParam) {
      queries.push(Query.cursorAfter(pageParam.toString()));
    }
  
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseID,
        appwriteConfig.postCollectionId,
        queries
      );
  
      if (!posts) throw Error;
  
      return posts;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== GET POST BY ID
  export async function getPostById(postId?: string) {
    if (!postId) throw Error;
  
    try {
      const post = await databases.getDocument(
        appwriteConfig.databaseID,
        appwriteConfig.postCollectionId,
        postId
      );
  
      if (!post) throw Error;
  
      return post;
    } catch (error) {
      console.log(error);
    }
  }
  
  
  
  // ============================== DELETE POST
  export async function deletePost(postId?: string, imageId?: string) {
    if (!postId || !imageId) return;
  
    try {
      const statusCode = await databases.deleteDocument(
        appwriteConfig.databaseID,
        appwriteConfig.postCollectionId,
        postId
      );
  
      if (!statusCode) throw Error;
  
      await deleteFile(imageId);
  
      return { status: "Ok" };
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== LIKE / UNLIKE POST
  export async function likePost(postId: string, likesArray: string[]) {
    try {
      const updatedPost = await databases.updateDocument(
        appwriteConfig.databaseID,
        appwriteConfig.postCollectionId,
        postId,
        {
          likes: likesArray,
        }
      );
  
      if (!updatedPost) throw Error;
  
      return updatedPost;
    } catch (error) {
      console.log(error);
    }
  }
  
  
  // ============================== GET USER'S POST
  export async function getUserPosts(userId?: string) {
    if (!userId) return;
  
    try {
      const post = await databases.listDocuments(
        appwriteConfig.databaseID,
        appwriteConfig.postCollectionId,
        [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
      );
  
      if (!post) throw Error;
  
      return post;
    } catch (error) {
      console.log(error);
    }
  }
  
  
  // ============================================================
  // USER
  // ============================================================
  
  // ============================== GET USERS
  export async function getUsers(limit?: number) {
    const queries: any[] = [Query.orderDesc("$createdAt")];
  
    if (limit) {
      queries.push(Query.limit(limit));
    }
  
    try {
      const users = await databases.listDocuments(
        appwriteConfig.databaseID,
        appwriteConfig.userCollectionId,
        queries
      );
  
      if (!users) throw Error;
  
      return users;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== GET USER BY ID
  export async function getUserById(userId: string) {
    try {
      const user = await databases.getDocument(
        appwriteConfig.databaseID,
        appwriteConfig.userCollectionId,
        userId
      );
  
      if (!user) throw Error;
  
      return user;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== UPDATE USER
  export async function updateUser(user: IUpdateUser) {
    const hasFileToUpdate = user.file.length > 0;
    try {
      let image = {
        imageUrl: user.imageUrl,
        imageId: user.imageId,
      };
  
      if (hasFileToUpdate) {
        // Upload new file to appwrite storage
        const uploadedFile = await uploadFile(user.file[0]);
        if (!uploadedFile) throw Error;
  
        // Get new file url
        const fileUrl = getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
          await deleteFile(uploadedFile.$id);
          throw Error;
        }
  
        image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
      }
  
      //  Update user
      const updatedUser = await databases.updateDocument(
        appwriteConfig.databaseID,
        appwriteConfig.userCollectionId,
        user.userId,
        {
          name: user.name,
          bio: user.bio,
          imageUrl: image.imageUrl,
          imageId: image.imageId,
        }
      );
  
      // Failed to update
      if (!updatedUser) {
        // Delete new file that has been recently uploaded
        if (hasFileToUpdate) {
          await deleteFile(image.imageId);
        }
        // If no new file uploaded, just throw error
        throw Error;
      }
  
      // Safely delete old file after successful update
      if (user.imageId && hasFileToUpdate) {
        await deleteFile(user.imageId);
      }
  
      return updatedUser;
    } catch (error) {
      console.log(error);
    }
  }

//================================== comments

export async function createNewComment(comment : INewComment) {
  try {
    const newComment = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.commentCollectionId,
      ID.unique(),
      {
        creator : comment.userId,
        post : comment.postId,
        content : comment.content
      }
    )
    if(!newComment)throw Error
    return newComment
  } catch (error) {
    console.log(error)
  }
  
}

export async function likeComment(commentId: string, likesArray: string[]) {
  try {
    const updatedComment = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.commentCollectionId,
      commentId,
      {
        likes: likesArray,
      }
    );

    if (!updatedComment) throw Error;

    return updatedComment;
  } catch (error) {
    console.log(error);
  }
}