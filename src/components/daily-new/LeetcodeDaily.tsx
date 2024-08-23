import { useEffect, useState } from "react";
import axios from "axios"

const API_URL = "https://alfa-leetcode-api.onrender.com/daily"

interface QuestionInterface {
    htmlString: string
    link: string
    title: string
}

async function getDailyQuestion(): Promise<QuestionInterface> {
    const response = await axios.get(API_URL)
    console.log(response.data)
    let questionData: QuestionInterface = {
        htmlString: response.data.question,
        link: response.data.questionLink,
        title: response.data.questionTitle
    }
    console.log(questionData)
    return questionData
}

function LeetcodeDaily() {
    const [questionData, setQuestionData] = useState<QuestionInterface>({ htmlString: "", title: "fetching question ", link: "#" })
    async function fetchQuestion() {
        let response = await getDailyQuestion()
        setQuestionData(response)
    }
    useEffect(() => {
        fetchQuestion()
    }, []);
    return <div className="card">
        <h4 className="card-header">Leetcode Daily Question</h4>
        <div className="card-body">

            <a href={questionData.link} target="#">
                <h4>{questionData.title}</h4>
            </a>
            <div
                dangerouslySetInnerHTML={{ __html: questionData.htmlString }}
            />
        </div>
    </div>
}

export default LeetcodeDaily