import { useState } from "react";
import { questionType } from "./types";

import '../styles/MultipleAnswer.css'


interface MultipleAnswersProps{
    qst: questionType,
}

function MultipleAnswers({qst} : MultipleAnswersProps){
    const [ selected, setSelected ] = useState<string | null>(null);

    let ans = []

    if ( qst.type === "multiple" ){
        let k = 0
        for ( let i = 0; i <= qst.incorrect_answers.length; i++ ){
            console.log(selected)
            if ( i === qst.id % qst.incorrect_answers.length ){
                ans.push((
                    <span 
                        id={selected ? "correct" : ""}
                        onClick={(e) => {setSelected(`${i}`); e.stopPropagation()}}
                    >{qst.correct_answer}</span>
                ))
                continue
            }
            ans.push((
                <span 
                    id={selected === `${i}` ? "wrong" : ""}
                    onClick={(e) => {setSelected(`${i}`); e.stopPropagation()}}
                >{qst.incorrect_answers[k++]}</span>
            ))
        }
    }else if ( qst.type === "boolean" ){
        ans.push((
            <span 
                id={selected ? `${selected === "true" ? `${qst.correct_answer === "True" ? "correct" : "wrong"}` : `${qst.correct_answer === "True" ? "correct" : ""}`}` : ""}
                onClick={(e) => {setSelected("true"); e.stopPropagation()}}
            >True</span>
        ))
        ans.push((
            <span 
                id={selected ? `${selected === "false" ? `${qst.correct_answer === "True" ? "wrong" : "correct"}` : `${qst.correct_answer === "False" ? "correct" : ""}`}` : ""}
                onClick={(e) => {setSelected("false"); e.stopPropagation()}}
            >False</span>
        ))
    }


    return <>{ans}</>
}

export default MultipleAnswers;