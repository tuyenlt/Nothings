import { CnnpostCategories, Coin, ContestInterface, PostData, VnePostCategories } from "@/types/dailynews";
import axios from "axios";
import { convertSecondsToDate } from "../utils";
import * as cheerio from 'cheerio';

const CODEFORCEAPI_URL = "https://codeforces.com/api/contest.list?gym=false"
const corsUrl = "https://proxy.cors.sh/"
const VnexpressUrl = "https://vnexpress.net"
const CnnUrl = "https://edition.cnn.com"




export async function getCodeforceContest() {
    let contestList: ContestInterface[] = [];
    const response = await axios.get(CODEFORCEAPI_URL)
    console.log(response.data.result)
    for (let constest of response.data.result) {
        if (constest.phase == "FINISHED") break;
        contestList.push({
            id: constest.id,
            name: constest.name,
            beforeStart: convertSecondsToDate(-constest.relativeTimeSeconds),
            duration: convertSecondsToDate(constest.durationSeconds)
        })
    }
    return contestList
}

export const fetchCoins = async (): Promise<Coin[]> => {
    const response = await axios.get<Coin[]>(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 10,
                page: 1,
                sparkline: false,
            },
        }
    );
    return response.data;
};

export async function getVnexpessPosts(postCategory = VnePostCategories["Bất động sản"], postLimit = 20): Promise<PostData[]> {
    let VnexpessPosts: PostData[] = [];
    try {
        console.log(corsUrl + VnexpressUrl + postCategory)
        const response = await axios.get(corsUrl + VnexpressUrl + postCategory, {
            headers: {
                'x-cors-api-key': 'temp_eee25594c24c213d5c989a1a7681fb80'
            }
        });
        const $ = cheerio.load(response.data);
        let postEles = $('h3.title-news').toArray();
        let countPostLimit = 0;

        for (const ele of postEles) {
            let eleData: PostData = {
                "link": $(ele).find('a').attr('href'),
                "name": $(ele).find('a').text(),
            };
            if (eleData.name == "") continue;
            countPostLimit++;
            if (countPostLimit === postLimit) break;
            VnexpessPosts.push(eleData);
        }
    } catch (error) {
        console.log(`Error fetching the URL: ${VnexpressUrl}`, error);
    }
    return VnexpessPosts;
}


export async function getCnnPosts(postCategory = CnnpostCategories.Tech, postLimit = 20): Promise<PostData[]> {
    let cnnPosts: PostData[] = [];
    try {
        console.log(postCategory)
        const response = await axios.get(CnnUrl + postCategory);
        const $ = cheerio.load(response.data);
        let postEles = $('a.container__link').toArray();
        let countPostLimit = 0;

        for (const ele of postEles) {
            let eleData: PostData = {
                "link": CnnUrl + $(ele).attr('href'),
                "name": $(ele).find('span.container__headline-text').text(),
            };
            if (eleData.name == "") continue;
            countPostLimit++;
            if (countPostLimit === postLimit) break;
            cnnPosts.push(eleData);
        }
    } catch (error) {
        console.log(`Error fetching the URL: ${CnnUrl}`, error);
    }
    return cnnPosts;
}