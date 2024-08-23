import BottomBar from '@/components/shared/BottomBar'
import LeftSideBar from '@/components/shared/LeftSideBar'
import TopBar from '@/components/shared/TopBar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
    return (
        <div className="w-screen md:flex">
            <TopBar />
            <LeftSideBar />
            <section className="flex flex-col flex-1 h-full w-full">
                <Outlet />
            </section>
            <BottomBar />
        </div>
    )
}

export default RootLayout