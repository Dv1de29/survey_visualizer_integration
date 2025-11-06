// This is the question type that is used in the app
export interface questionType{
    id: number,
    type: string,
    category: string,
    questionText: string,
    difficulty: string,
    correct_answer: string,
    incorrect_answers: string[],
    creator: string,
}