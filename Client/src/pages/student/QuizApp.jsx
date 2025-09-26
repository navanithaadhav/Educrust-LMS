import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar1 from "../../component/student/Navbar1";

const questions = [
  {
    numb: 1,
    question: "What does HTML stands for?",
    answer: "C. Hyper Text Markup Language",
    options: [
      "A. Hyper Type Multi Language",
      "B. Hyper Text Multiple Language",
      "C. Hyper Text Markup Language",
      "D. Home Text Multi Language",
    ],
  },
  {
    numb: 2,
    question: "What does CSS stand for?",
    answer: "A. Cascading Style Sheet",
    options: [
      "A. Cascading Style Sheet",
      "B. Cute Style Sheet",
      "C. Computer Style Sheet",
      "D. Codehal Style Sheet",
    ],
  },
  {
    numb: 3,
    question: "What does PHP stand for?",
    answer: "A. Hypertext Preprocessor",
    options: [
      "A. Hypertext Preprocessor",
      "B. Hometext Programming",
      "C. Hypertext Preprogramming",
      "D. Programming Hypertext Preprocessor",
    ],
  },
  {
    numb: 4,
    question: "What does SQL stand for?",
    answer: "D. Structured Query Language",
    options: [
      "A. Strength Query Language",
      "B. Stylesheet Query Language",
      "C. Science Question Language",
      "D. Structured Query Language",
    ],
  },
  {
    numb: 5,
    question: "What does XML stand for?",
    answer: "D. Extensible Markup Language",
    options: [
      "A. Excellent Multiple Language",
      "B. Explore Multiple Language",
      "C. Extra Markup Language",
      "D. Extensible Markup Language",
    ],
  },
];

const QuizApp = () => {
  const [showStart, setShowStart] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate()

  const startQuiz = () => {
    setShowPopup(true);
    setShowStart(false);
  };

  const exitPopup = () => {
    setShowPopup(false);
    setShowStart(true);
  };

  const continueQuiz = () => {
    setShowPopup(false);
    setShowQuiz(true);
  };

  const selectOption = (option) => {
    setSelectedOption(option);
    if (option === questions[currentQuestion].answer) {
      setUserScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setShowQuiz(false);
      setShowResult(true);
    }
  };

  const tryAgain = () => {
    setCurrentQuestion(0);
    setUserScore(0);
    setSelectedOption(null);
    setShowResult(false);
    setShowQuiz(true);
    setProgress(0);
  };

  const goHome = () => {
    setCurrentQuestion(0);
    setUserScore(0);
    setSelectedOption(null);
    setShowResult(false);
    setShowStart(true);
    setProgress(0);
  };

  useEffect(() => {
    if (showResult) {
      let startValue = 0;
      const endValue = (userScore / questions.length) * 100;
      const interval = setInterval(() => {
        startValue++;
        setProgress(startValue);
        if (startValue >= endValue) clearInterval(interval);
      }, 15);
    }
  }, [showResult, userScore]);

  return (
    
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
     
      <div className="w-full max-w-md">
        
        {/* Start Screen */}
         <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 z-50">
        {showStart && (
          <section className="bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
       
            <h1 className="text-4xl font-bold mb-4">Welcome Boss</h1>
            <p className="mb-6 text-gray-300">
              Ready to Play? Let’s Quiz It Up!
            </p>
            <button
              onClick={startQuiz}
              className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
            >
              Start Quiz
            </button>
         </section>
        )}

        {/* Popup Rules */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            <div className="bg-gray-800 p-6 rounded-xl w-80 text-center shadow-xl">
              <h2 className="text-2xl font-bold mb-4">Rules & Regulations</h2>
              <p className="mb-2">1. One correct answer per question</p>
              <p className="mb-2">2. No negative marking.</p>
              <p className="mb-4">3. Just use your brain to answer.</p>
              <div className="flex justify-between mt-4">
                <button
                  className="bg-red-500 px-4 py-2 rounded hover:bg-red-400 transition"
                  onClick={exitPopup}
                >
                  Exit
                </button>
                <button
                  className="bg-green-500 px-4 py-2 rounded hover:bg-green-400 transition"
                  onClick={continueQuiz}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Section */}
        {showQuiz && (
          <section className="bg-gray-800 p-10 pt-5 m-12 rounded-2xl shadow-lg">
            <h1 className="text-3xl font-bold mb-4">Quizzy</h1>
            <div className="flex justify-between mb-4 text-gray-300">
              <span>Questions are...</span>
              <span className="font-semibold">
                Score: {userScore}/{questions.length}
              </span>
            </div>
            <h2 className="text-xl font-medium mb-6">
              {questions[currentQuestion].numb}.{" "}
              {questions[currentQuestion].question}
            </h2>
            <div className="grid grid-cols-1 gap-4 mb-6">
              {questions[currentQuestion].options.map((option, idx) => {
                const isCorrect = option === questions[currentQuestion].answer;
                const isSelected = option === selectedOption;
                const bgColor =
                  selectedOption
                    ? isCorrect
                      ? "bg-green-500 text-white"
                      : isSelected
                      ? "bg-red-500 text-white"
                      : "bg-gray-700 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white";
                return (
                  <button
                    key={idx}
                    className={`px-4 py-3 rounded-lg font-medium transition ${bgColor}`}
                    onClick={() => !selectedOption && selectOption(option)}
                    disabled={!!selectedOption}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between items-center text-gray-300">
              <span>
                {currentQuestion + 1} of {questions.length} questions
              </span>
              <button
                className={`px-4 py-2 rounded-lg bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 transition ${
                  selectedOption ? "" : "opacity-50 cursor-not-allowed"
                }`}
                onClick={nextQuestion}
                disabled={!selectedOption}
              >
                Next
              </button>
            </div>
          </section>
        )}

        {/* Result Section */}
        {showResult && (
          <section className="bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Quiz Result!</h2>
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                <div className="absolute w-32 h-32 rounded-full bg-gray-700"></div>
                <div
                  className="absolute w-32 h-32 rounded-full"
                  style={{
                    background: `conic-gradient(rgb(255,217,0) ${
                      progress * 3.6
                    }deg, rgba(255,255,255,.1) 0deg)`,
                    transition: "background 0.2s linear",
                  }}
                ></div>
                <span className="text-xl font-bold relative z-10">
                  {Math.round(progress)}%
                </span>
              </div>
              <span className="text-lg font-medium">
                You scored {userScore} out of {questions.length}
              </span>
            </div>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-400 transition font-medium"
                onClick={tryAgain}
              >
                Try Again
              </button>
              <button
                className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-400 transition font-medium"
                onClick={()=>navigate('/')}
              >
                Go Home
              </button>
            </div>
          </section>
        )}
        </div>
      </div>
    </div>
  );
};

export default QuizApp;
