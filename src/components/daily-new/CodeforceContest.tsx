
import React from "react";
import {
    Card,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { useGetCodeforceContest } from "@/lib/daily-news/mutationAndQueries";
import { Loader } from "lucide-react";


const regesterUrl = "https://codeforces.com/contestRegistration/"


function CodeforceContest() {
    const { data: constestList, isPending } = useGetCodeforceContest()

    const handleRegister = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        let link = regesterUrl + event.currentTarget.getAttribute('data-id')
        window.open(link, '_blank')
    }

    return (
        <Card className="">
            <CardHeader className="text-center" >
                <CardTitle className="text-light-1">
                    Codefores Upcomming Contest List
                </CardTitle>
            </CardHeader>
            <ul className="space-y-4">
                {isPending ? <Loader /> :
                    constestList?.map((contest) => (
                        <li className="p-4 border border-border">
                            <h5 className="font-semibold text-lg">{contest.name}</h5>
                            <div className="text-sm text-gray-500">Before start: {contest.beforeStart}</div>
                            <div className="text-sm text-gray-500">Duration: {contest.duration}</div>
                            <button className="mt-2 px-4 py-2 border border-border rounded text-gray-700 hover:bg-gray-100" data-id={contest.id} onClick={handleRegister}>
                                Register
                            </button>
                        </li>
                    ))}
            </ul>
        </Card>
    )

}

export default CodeforceContest