import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

function AuthLayout() {
    let isAuthenticated = false;

    return (
        <>
            {isAuthenticated ? (
                <Navigate to="/" />
            ) : (
                <>
                    <section className="flex flex-1 justify-center items-center flex-col py-10">
                        <Outlet />
                    </section>

                    <img
                        src="/assets/images/auth-layout-img.jpeg"
                        alt="logo"
                        className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
                    />
                </>
            )}
        </>
    );
}

export default AuthLayout