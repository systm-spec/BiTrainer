import React, { useState, useEffect } from "react";
import questions from "../data/questions.json";

interface Question {
    id: string;
    text: string;
    images: string[];
    choices: string[];
    correct: number;
}

const Quiz = () => {
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [answers, setAnswers] = useState<boolean[]>([]);
    const [selected, setSelected] = useState<number | null>(null);
    const [finished, setFinished] = useState(false);

    const question: Question = questions[current];

    const handleAnswer = (index: number) => {
        if (selected !== null) return;
        setSelected(index);
        const correct = index === question.correct;
        setAnswers([...answers, correct]);
        if (correct) setScore(score + 1);
        localStorage.setItem(
            `answer-${question.id}`,
            JSON.stringify({ correct, index })
        );

        setTimeout(() => {
            if (current + 1 < questions.length) {
                setCurrent(current + 1);
                setSelected(null);
            } else {
                setFinished(true);
            }
        }, 1000);
    };

    const downloadResults = () => {
        const blob = new Blob(
            [
                JSON.stringify(
                    {
                        answers,
                        total: questions.length,
                        percent: Math.round((score / questions.length) * 100),
                    },
                    null,
                    2
                ),
            ],
            { type: "application/json" }
        );
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "results.json";
        a.click();
    };

    return (
        <div className="bg-white p-4 rounded shadow-md">
            {!finished ? (
                <div>
                    <p className="mb-2">
                        Frage {current + 1} / {questions.length}
                    </p>
                    <p className="font-semibold mb-2">{question.text}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {question.images.map((img, i) => (
                            <img
                                key={i}
                                src={`/questions/${question.id}/${img}`}
                                alt=""
                                className="w-40 h-auto border rounded"
                            />
                        ))}
                    </div>
                    <div className="flex flex-col gap-2">
                        {question.choices.map((choice, index) => (
                            <button
                                key={index}
                                className={`p-2 border rounded ${
                                    selected === index
                                        ? index === question.correct
                                            ? "bg-green-200"
                                            : "bg-red-200"
                                        : "bg-gray-100 hover:bg-gray-200"
                                }`}
                                onClick={() => handleAnswer(index)}>
                                {choice}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <p className="text-xl font-semibold">Quiz abgeschlossen!</p>
                    <p className="mb-2">
                        Richtige Antworten: {score} / {questions.length}
                    </p>
                    <p className="mb-4">
                        Prozentsatz:{" "}
                        {Math.round((score / questions.length) * 100)}%
                    </p>
                    <button
                        onClick={downloadResults}
                        className="px-4 py-2 bg-blue-500 text-white rounded">
                        Ergebnisse herunterladen
                    </button>
                </div>
            )}
        </div>
    );
};

export default Quiz;
