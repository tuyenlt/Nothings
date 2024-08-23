import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";

import { IUser } from "@/types";
import { getCurrentUser } from "@/lib/appwrite/api";

export const INITIAL_USER = {
    id: "",
    name: "",
    username: "",
    email: "",
    imageUrl: "",
    bio: "",
    friendsList: []
};

const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => { },
    setIsAuthenticated: () => { },
    checkAuthUser: async () => false as boolean,
};

type IContextType = {
    user: IUser;
    isLoading: boolean;
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const [user, setUser] = useState<IUser>(INITIAL_USER);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const checkAuthUser = async () => {
        setIsLoading(true);
        try {
            const currentAccount = await getCurrentUser();
            if (currentAccount) {
                setUser({
                    id: currentAccount.$id,
                    name: currentAccount.name,
                    username: currentAccount.userName,
                    email: currentAccount.email,
                    imageUrl: currentAccount.imageUrl,
                    bio: currentAccount.bio,
                    friendsList: currentAccount.friendsList,
                });
                setIsAuthenticated(true);
                return true;
            }

            return false;
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const cookieFallback = localStorage.getItem("cookieFallback");
        if (
            cookieFallback === null ||
            cookieFallback === undefined ||
            cookieFallback === "[]"
        ) {
            navigate("/sign-in");
        }

        checkAuthUser();
        if (!isAuthenticated) navigate("/sign-in");
    }, []);

    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useUserContext = () => useContext(AuthContext);