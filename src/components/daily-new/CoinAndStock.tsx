import React from 'react';
import { useFetchCoins } from '@/lib/daily-news/mutationAndQueries';
import Loader from '../shared/Loader';


const CoinAndStock: React.FC = () => {

    const { data: coins, isPending } = useFetchCoins()

    return (
        <div className="w-full border border-border mx-auto bg-background shadow-md rounded-lg overflow-hidden mt-6">
            <h2 className="text-center text-2xl font-bold py-4 text-white">Top 10 Cryptocurrencies</h2>
            <ul className="divide-y divide-gray-700">
                {isPending ? <Loader /> : coins?.map((coin) => (
                    <li className="flex items-center p-4 text-white" key={coin.id}>
                        <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-4" />
                        <span className="font-medium">{coin.name}</span>
                        <span className="ml-4">{coin.symbol.toUpperCase()}</span>
                        <span className="ml-auto text-green-400 font-semibold">${coin.current_price}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CoinAndStock;
