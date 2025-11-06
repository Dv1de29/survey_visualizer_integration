import { useEffect, useRef, useState } from "react";

import Charts from "./Charts";
import QuestionTable from "./QuestionTable";

import '../styles/Questions.css';

import { questionType } from "./types";


let nextId = 1

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));



///// this is the fethcing part where we parse the data into json and put it into the questiontype[] vector with decoding the encode=url13986
const getData = async (token: string): Promise<questionType[]> => {
    const QuestionNumber = 50;

    const apiUrl = `https://opentdb.com/api.php?amount=${QuestionNumber}&token=${token}&encode=url3986`

    const response = await fetch(apiUrl)

    if ( !response.ok ){
        throw new Error(`Error fetching data: ${response.status}, ${response.statusText}`)
    }

    const data = await response.json()

    if ( data.response_code !== 0 ){
        throw new Error(`API returned error code: ${data.response_code}`);
    }

    const decoder = (str: string) => decodeURIComponent(str)

    console.log(data.results)

    const questions: questionType[] = data.results.map((qst: any) => ({
        id: nextId++,
        category: decoder(qst.category),
        type: qst.type,
        difficulty: qst.difficulty,
        questionText: decoder(qst.question),
        correct_answer: decoder(qst.correct_answer),
        incorrect_answers: qst.incorrect_answers.map((ans: string) => decoder(ans)),
        creator: "",
    }))


    return questions
}


// This is the fetching main part with retrying in case of error or when we need to wait the 5s span in which we can only call one api request
const fetchRetry = async (): Promise<questionType[]> => {
    let attempts = 0
    const maxAttempts = 3

    let responseToken = await fetch("https://opentdb.com/api_token.php?command=request")
    let resToken = await responseToken.json()
    let token = resToken.token

    while ( attempts < maxAttempts ){
        try{
            const quest = await getData(token)
            return quest
        }catch(e: any){
            if ( e.message.includes("429") || e.message.includes("Too many Requests")){
                console.warn("Too quickly fetched")
                await sleep(5000)
                attempts++
            }
            else{
                throw e
            }
        }
    }

    throw new Error("Failed to fetch quesstions after retrying")
}


function Questions(){
    const [ questions, setQuestions ] = useState<questionType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    ///This is for avoiding the useEffect to run twice and compromise my ID assignment to the questions, due to React Strict Mode running it twice 
    const didFetch = useRef(false);


    ///fetching data
    useEffect(() => {
        const fetched = async () => {
            if ( didFetch.current ) return
            didFetch.current = true


            try{
                const qst1 = await fetchRetry()
                setQuestions(qst1)
                setLoading(false)
                console.log("DONE 1")

                await sleep(5000)
                const qst2 = await fetchRetry()
                setQuestions(prevQuest => [...prevQuest, ...qst2])
            }
            catch(e){
                console.error(`Catched error: ${e}`)
                setError("Failed to load questions. Please refresh.")
            }
            finally{
                setLoading(false);
            }
        }

        fetched()     
    }, [])



    return (
        <>
            <div className="main-container">
                {questions.length > 0 && (
                <>
                    <div className="table">
                        <QuestionTable
                            questions={questions}
                        />
                    </div>
                    <Charts
                        questions={questions}
                    />
                </>
                )}
                {/* This is the loading/error handling on the UI */}
                {loading && (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        Loading questions...
                    </div>
                )}

                {error && (
                    <div className="error-message">{error}</div>
                )}
            </div>
        </>
    )
}

export default Questions;