import axios from "axios";

import { useState } from "react";
import SelectAndSubmit from "../shared/SelectAndSubmit";
import { Card } from "../ui/card";
import { VnePostCategories } from "@/types/dailynews";
import { useGetVnexpessPosts } from "@/lib/daily-news/mutationAndQueries";
import Loader from "../shared/Loader";





const categoriesList = [
    "Bất động sản",
    "Khoa học",
    "Giải trí",
    "Thể thao",
    "Kinh doanh",
    "Thế giới"
];


function Vnexpess() {

    const [postCategory, setPostCategory] = useState<string>(VnePostCategories['Bất Động Sản'])

    const onSubmitHandle = async (selectedCategory: string) => {
        setPostCategory(VnePostCategories[selectedCategory])
    };

    console.log(postCategory)

    const { data: VnexpessPosts, isPending } = useGetVnexpessPosts(postCategory,20)

    const handleClick = (link: string | undefined) => {
        if (link) {
            window.open(link, '_blank');
        }
    };


    return (
        <Card className="card">
            <div className="px-8 mt-5 mb-5">
                <div className="w-full flex items-center justify-center">
                    <div>
                        <img
                            src="./public/assets/icons/vnexpress.svg"
                            alt=""
                            style={{ width: '120px', borderRadius: '2px', margin: '0 20px 0 20px' }}
                        />
                    </div>
                    <SelectAndSubmit onSubmit={onSubmitHandle} selectValues={categoriesList} buttonText="Reload" />
                </div>
            </div>
            <ul className="space-y-2">
                {isPending ? <Loader /> : VnexpessPosts?.map((post, index) => (
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

export default Vnexpess;