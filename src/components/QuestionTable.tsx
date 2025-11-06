import { useMemo, useState } from "react"

import ImageInteractive from "./ImageInteractive";
import MultipleAnswers from "./MultipleAnswer";

import '../styles/QuestionTable.css'

import { questionType } from "./types"

interface QuestionTableProps{
    questions: questionType[],
}

//// This component is the main table of questions responsible for their showing and interactivity
function QuestionTable({questions} : QuestionTableProps){


    //// This can be improved with a useReducer with growing of the database and improvement on the API's conditions
    const [ activeQuestion, setActiveQuestion] = useState<questionType | null>(null);
    const [ activeFilter, setActiveFilter] = useState<string | null>(null);
    const [ activePage, setActivePage ] = useState<number>(1);

    const maxQstPage = 14;

    const totalPages = useMemo(() => {
        return Math.ceil(questions.length / maxQstPage)
    }, [questions, maxQstPage])

    //// This returns the page numbers preset
    const getPageNumbers = () => {

        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (activePage <= 3) {
            return [1, 2, 3, 4];
        }

        if (activePage >= totalPages - 2) {
            return [totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }

        return [activePage - 1, activePage, activePage + 1];
    };

    //// This filters the questions list that is used in the return
    const sortedQuestions: questionType[] = useMemo(() => {
        if ( !activeFilter || activeFilter === "id" ) return questions
            
        const key = activeFilter as keyof questionType

        return [...questions].sort((a,b) => {
            const vala = a[key]
            const valb = b[key]

            if ( typeof vala === "string" && typeof valb === "string"){
                return vala.localeCompare(valb)
            }

            if ( typeof vala === "number" && typeof valb === "number" ){
                return vala-valb
            }

            return 0
        })
    }, [questions, activeFilter])

    const getImageCategory = (): string => {
        if ( !activeQuestion ){
            return "Default"
        }

        let tempQuestCat = activeQuestion.category;

        if ( tempQuestCat.includes("Entertainment") ){
            tempQuestCat = tempQuestCat.slice(15)
        }

        tempQuestCat = tempQuestCat.replaceAll(" ", "").replaceAll("&", "")

        return tempQuestCat
    }

    return (
        <>
            <div className="question-container">
                {/* The ImageInteractive components returns an image with a Kotlin (here at the begining) and a JetBrains (at the end) logo that is customised based on the active question category that is pressed. Keep in mind that I didn't created customized logos for all categories, just for some (VideoGaes, GeneralKnwoledge, History, etc.) */}
                <ImageInteractive logo="Kotlin" category={getImageCategory()}/>
                <div className="table-container">
                    <div className="table-header">
                        <span>{"Filter: "}</span>
                        <select 
                            name="table-filter" id="table-filter"
                            onChange={(e) => {
                                setActiveFilter(e.target.value)
                            }}
                            >
                            <option value="id">{"Id"}</option>
                            <option value="category">{"Category"}</option>
                            <option value="difficulty">{"Difficulty"}</option>
                        </select>
                    </div>
                    <div className="questions-list">
                        <div className="row" id="titles">
                            <span>{"Id:"}</span>
                            <span>{"Category:"}</span>
                            <span>{"QuestionText:"}</span>
                            <span>{"Difficulty:"}</span>
                            <span>{"Type:"}</span>
                        </div>
                        {/* Here we generate only the maxQstPage questions based on what page we are on */}
                        {sortedQuestions.slice((activePage - 1) * maxQstPage, activePage * maxQstPage).map((el, i) => {
                            return(
                                <>
                                    {el !== activeQuestion && (
                                        <div 
                                            className="row" 
                                            key={el.id}
                                            onClick={() => setActiveQuestion(el)}
                                        >
                                            <span>{el.id}</span>
                                            <span>{el.category.slice((el.category.includes("Entertainment") === true) ? 15 : 0)}</span>
                                            <span>{el.questionText}</span>
                                            <span>{el.difficulty}</span>
                                            <span>{el.type}</span>
                                        </div>
                                    )}
                                    {el === activeQuestion && (
                                        <div 
                                            className="active-row"
                                            key={el.id}
                                            onClick={() => setActiveQuestion(null)}
                                        >
                                            <div className="active-title">
                                                <span>{`${el.id}.`}</span>
                                                <span>{`Category: ${el.category}`}</span>
                                                <span>{`Question type: ${el.type}`}</span>
                                            </div>
                                            <div className="qst-texts">
                                                <span className="qst-tx">{el.questionText}</span>
                                                <div className="qst-ans">
                                                    <MultipleAnswers qst={el}/>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )
                        })}
                    </div>

                    {/* This is the page number container that is responsible for showing questions based on a constant number and iterate through all with the pages */}
                    <div className="pages-list"
                        style={{
                            gridTemplateColumns:
                            totalPages < 5
                                ? `repeat(${totalPages + 2}, 1fr)`
                                : "repeat(7, 1fr)",
                        }}
                    >
                        { activePage !== 1 && (
                            <button 
                                className="antem"
                                onClick={() => setActivePage(activePage > 1 ? activePage - 1 : 1)}
                            >
                                {"<"}
                            </button>)}
                        { (activePage > 3 && totalPages > 5) && (
                            <>
                                <div className="lessss">...</div>
                            </>
                        )}
                        {getPageNumbers().map((page, i) => (
                            <button
                            key={page}
                            className={`page-number ${page === activePage ? "active" : ""}`}
                            onClick={() => setActivePage(page)}
                            >
                            {page}
                            </button>
                        ))}

                        { (activePage < totalPages - 2 && totalPages > 5)  && (
                            <>
                                <div className="moreee">...</div>
                            </>
                        )}
                        { activePage !== totalPages && (
                        <button 
                            className="post"
                            onClick={() => setActivePage(activePage < totalPages ? activePage + 1 : totalPages)}
                        >
                            {">"}
                        </button>
                        )}
                    </div>
                
                </div>
                {/* This is the customized JetBrains logo that is mentioned above */}
                <ImageInteractive logo="JB" category={getImageCategory()}/>
            </div>
        </>
    )
}

export default QuestionTable;