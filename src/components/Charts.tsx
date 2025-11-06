import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import '../styles/Charts.css'

import { questionType } from "./types";


interface ChartsProps{
    questions: questionType[],
}


//// this component is responsible for the built of the charts based on the questions props that is passed
function Charts({questions}: ChartsProps){

    ///// categoryMap/Data is used for building the data that will be passed to the chart
    const categoryMap: Record<string, number> = {};
    const difficultyMap: Record<string, number> = {};

    questions.forEach((qst) => {
        if ( qst.category.includes("Entertainments")){
            categoryMap[qst.category.slice(15)] = (categoryMap[qst.category] || 0) + 1;
        }
        categoryMap[qst.category.slice(qst.category.includes("Entertainment") === true ? 15 : 0)] = (categoryMap[qst.category] || 0) + 1;
        difficultyMap[qst.difficulty] = (difficultyMap[qst.difficulty] || 0) + 1;
    })

    const categoryData = Object.entries(categoryMap).map(([category, count]) => ({
        category,
        count,
    }))

    console.log(categoryData)

    const difficultyData = Object.entries(difficultyMap).map(([difficulty, count]) => ({
        difficulty,
        count
    }))

    const COLORS = ["#82ca9d", "#8884d8", "#ffc658"];


    return (
        <>
            <div className="info">
                <h2 className="statistics-title">📊 Question Statistics</h2>
                {/* This shows the list of all categories and their question count */}
                <div className="category-container">
                    <h3>Categories</h3>
                    <div className="categories-list">
                    {categoryData.map((c, i) => (
                        <span 
                            key={i} 
                            style={{
                                gridColumn: (i === categoryData.length - 1 && i % 3 === 0) ? "2 / 3" : undefined
                            }}
                        >{c.category} ({c.count} questions)</span>
                    ))}
                    </div>
                </div>

                {/* This is where the charts are made based on the questions category/difficulty */}
                <div className="charts-container">
                    <div className="barchart">
                        <h3>Questions by Category</h3>
                        <ResponsiveContainer width={`100%`} height={400}>
                            <BarChart  className="barchart-el" data={categoryData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" interval={0} angle={90} textAnchor="start" height={150} tick={{ fill: "#000" }} />
                            <YAxis tick={{ fill: "#000" }}/>
                            <Tooltip />
                            <Bar dataKey="count" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="piechart">
                        <h3>Questions by Difficulty</h3>
                        <PieChart width={400} height={300}>
                        <Pie
                            data={difficultyData}
                            dataKey="count"
                            nameKey="difficulty"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {difficultyData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                        </PieChart>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Charts;