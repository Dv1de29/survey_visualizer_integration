import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, Tooltip, XAxis, YAxis } from "recharts";

import '../styles/Charts.css'

import { questionType } from "./types";


interface ChartsProps{
    questions: questionType[],
}

function Charts({questions}: ChartsProps){

    const categoryMap: Record<string, number> = {};
    const difficultyMap: Record<string, number> = {};

    questions.forEach((qst) => {
        if ( qst.category.includes("Entertainments")){
            categoryMap[qst.category.slice(16)] = (categoryMap[qst.category] || 0) + 1;
        }
        categoryMap[qst.category.slice(qst.category.includes("Entertainment") === true ? 15 : 0)] = (categoryMap[qst.category] || 0) + 1;
        difficultyMap[qst.difficulty] = (difficultyMap[qst.difficulty] || 0) + 1;
    })

    const categoryData = Object.entries(categoryMap).map(([category, count]) => ({
        category,
        count,
    }))
    const difficultyData = Object.entries(difficultyMap).map(([difficulty, count]) => ({
        difficulty,
        count
    }))

    const COLORS = ["#82ca9d", "#8884d8", "#ffc658"];


    return (
        <>
            <div className="info">
                <h2 className="statistics-title">📊 Question Statistics</h2>
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

                <div className="charts-container">
                    <div className="barchart">
                        <h3>Questions by Category</h3>
                        <BarChart className="barchart-el" data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" interval={0} angle={90} textAnchor="start" height={150} tick={{ fill: "#000" }} />
                        <YAxis tick={{ fill: "#000" }}/>
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
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