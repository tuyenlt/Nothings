import axios from "axios";
import * as cheerio from 'cheerio';
import { useState, useEffect } from "react";
import SelectAndSubmit from "../shared/SelectAndSubmit";
import { Card } from "../ui/card";
import { CnnpostCategories } from "@/types/dailynews";
import { invalidateGetCnnPost, useGetCnnPosts } from "@/lib/daily-news/mutationAndQueries";
import Loader from "../shared/Loader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCnnPosts } from "@/lib/daily-news/api";







function Cnn() {
    const [postCategory, setPostCategory] = useState<string>(CnnpostCategories['Teach'])
    const onSubmitHandle = async (selectedCategory: string) => {
        setPostCategory(CnnpostCategories[selectedCategory])
    };

    // const { data: cnnPosts, isPending } = useGetCnnPosts(postCategory, 20)

    const { data: cnnPosts, isLoading } = useQuery(
        ['cnnPosts', postCategory], 
        () => getCnnPosts(postCategory, 20), 
        { keepPreviousData: true } // Keeps previous data while fetching new data
    );


    const handleClick = (link: string | undefined) => {
        if (link) {
            window.open(link, '_blank');
        }
    };


    return (
        <Card className="card">
            <nav className="px-8 mt-5 mb-5 w-full">
                <div className="w-full flex items-center justify-center">
                    <div>
                        <img
                            src="./public/assets/icons/cnn.png"
                            alt=""
                            style={{ maxWidth: '50px', margin: '0 20px 0 20px' }}
                        />
                    </div>
                    <SelectAndSubmit onSubmit={onSubmitHandle} selectValues={Object.keys(CnnpostCategories)} buttonText="Reload" />
                </div>
            </nav>
            <ul className="space-y-2">
                {isPending ? <Loader /> : cnnPosts?.map((post, index) => (
                    <li
                        className="p-4 border border-border cursor-pointer hover:bg-primary-500"
                        role="button"
                        key={index}
                        onClick={() => handleClick(post.link)}
                    >
                        <strong>{post.name}</strong>
                    </li>
                ))}
            </ul>
        </Card>
    );
}

export default Cnn;