import React, { useState } from 'react';
import { Lecture } from '../../../types';

interface QuizPlayerProps {
    playerData: Lecture | null;
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({ playerData }) => {
    const [showQuiz, setShowQuiz] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userScore, setUserScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    if (playerData?.resourceType !== 'quiz') return null;

    const startQuiz = () => {
        setShowQuiz(true);
        setShowResult(false);
        setCurrentQuestion(0);
        setUserScore(0);
        setSelectedOption(null);
    };

    const selectOption = (option: string) => {
        setSelectedOption(option);
        if (playerData?.questions && playerData.questions[currentQuestion]) {
            if (option === playerData.questions[currentQuestion].correctAnswer) {
                setUserScore((prev) => prev + 1);
            }
        }
    };

    const nextQuestion = () => {
        if (playerData?.questions && currentQuestion < playerData.questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
            setSelectedOption(null);
        } else {
            setShowQuiz(false);
            setShowResult(true);
        }
    };

    const tryAgain = () => {
        startQuiz();
    };

    return (
        <div className="bg-gray-900 text-white p-8 min-h-[500px] flex flex-col justify-center items-center">
            {!showQuiz && !showResult ? (
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Quiz: {playerData?.lectureTitle}</h1>
                    <p className="mb-6 text-gray-300">Test your knowledge!</p>
                    <button onClick={startQuiz} className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition">Start Quiz</button>
                </div>
            ) : showQuiz ? (
                <div className="w-full max-w-2xl">
                    <div className="flex justify-between mb-4 text-gray-300">
                        <span>Question {currentQuestion + 1} of {(playerData?.questions || []).length}</span>
                        <span className="font-semibold">Score: {userScore}</span>
                    </div>
                    <h2 className="text-xl font-medium mb-6">{(playerData?.questions || [])[currentQuestion]?.question}</h2>
                    <div className="grid grid-cols-1 gap-4 mb-6">
                        {(playerData?.questions || [])[currentQuestion]?.options.map((option, idx) => {
                            const isCorrect = option === (playerData?.questions || [])[currentQuestion].correctAnswer;
                            const isSelected = option === selectedOption;
                            let bgColor = "bg-gray-700 hover:bg-gray-600 text-white";
                            if (selectedOption) {
                                if (isCorrect) bgColor = "bg-green-500 text-white";
                                else if (isSelected) bgColor = "bg-red-500 text-white";
                                else bgColor = "bg-gray-700 text-white opacity-50";
                            }

                            return (
                                <button
                                    key={idx}
                                    className={`px-4 py-3 rounded-lg font-medium transition ${bgColor} text-left`}
                                    onClick={() => !selectedOption && selectOption(option)}
                                    disabled={!!selectedOption}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex justify-end">
                        <button
                            className={`px-4 py-2 rounded-lg bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 transition ${selectedOption ? "" : "opacity-50 cursor-not-allowed"}`}
                            onClick={nextQuestion}
                            disabled={!selectedOption}
                        >
                            {currentQuestion < (playerData?.questions || []).length - 1 ? 'Next Question' : 'Finish Quiz'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Quiz Result!</h2>
                    <p className="text-xl mb-6">You scored {userScore} out of {(playerData?.questions || []).length}</p>
                    <button className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-400 transition font-medium text-white" onClick={tryAgain}>Try Again</button>
                </div>
            )}
        </div>
    );
};

export default QuizPlayer;
