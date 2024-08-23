import Cnn from "@/components/daily-new/Cnn"
import CodeforceContest from "@/components/daily-new/CodeforceContest"
import CoinAndStock from "@/components/daily-new/CoinAndStock"
import TodoList from "@/components/daily-new/TodoList"
import LeetcodeDaily from "@/components/daily-new/LeetcodeDaily"
import Vnexpess from "@/components/daily-new/Vnexpress"

function DailyNews() {
    return (
        <div className="container flex flex-col space-y-4">
            <CodeforceContest></CodeforceContest>
            <CoinAndStock></CoinAndStock>
            <Cnn></Cnn>
            {/* <LeetcodeDaily></LeetcodeDaily> */}
            <Vnexpess></Vnexpess>
        </div>
    )
}

export default DailyNews
