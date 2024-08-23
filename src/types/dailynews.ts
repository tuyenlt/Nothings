export interface ContestInterface {
    name: string
    beforeStart: string
    duration: string
    id: string
}


export interface Coin {
    id: string;
    name: string;
    symbol: string;
    current_price: number;
    image: string;
}

export interface PostData {
    link: string | undefined;
    name: string | undefined;
}


export const VnePostCategories: Record<string, string> = {
    "Bất động sản": "/bat-dong-san",
    "Khoa học": "/khoa-hoc",
    "Giải trí": "/giai-tri",
    "Thể thao": "/the-thao",
    "Kinh doanh": "/kinh-doanh",
    "Thế giới": "/the-gioi",
};

export const CnnpostCategories: Record<string, string> = {
    Tech: "/business/tech",
    Sports: "/sport",
    Science: "/science",
    Markets: "/markets",
    Health: "/health",
    Entertainment: "/entertainment",
};