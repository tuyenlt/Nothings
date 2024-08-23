import { Client, Account, Databases, Storage, Avatars } from "appwrite";

export const appwriteConfig = {
    projectId : import.meta.env.VITE_APPWRITE_PROJECT_ID,
    url : import.meta.env.VITE_APPWRITE_URL,
    databaseID : import.meta.env.VITE_APPWRITE_DATABASE_ID,
    storageID : import.meta.env.VITE_APPWRITE_STORAGE_ID,
    userCollectionId : import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
    postCollectionId : import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID,
    commentCollectionId : import.meta.env.VITE_APPWRITE_COMMENT_COLLECTION_ID,
}

export const client = new Client()

client.setEndpoint(appwriteConfig.url)
client.setProject(appwriteConfig.projectId)

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)
export const avartars = new Avatars(client)