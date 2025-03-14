'use client'

import { useState } from 'react'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Progress } from "@/components/ui/progress"

const questions = [
  {
    id: 1,
    question: "What does CSS stand for?",
    options: [
      "Computer Style Sheets",
      "Creative Style Sheets",
      "Cascading Style Sheets",
      "Colorful Style Sheets"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Which of the following is not a JavaScript data type?",
    options: [
      "Number",
      "Boolean",
      "String",
      "Float"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "What does the 'typeof' operator in JavaScript return for an array?",
    options: [
      "array",
      "object",
      "list",
      "collection"
    ],
    correctAnswer: 1
  },
  {
    id: 4,
    question: "Which HTTP method is used to send data to a server to create or update a resource?",
    options: [
      "GET",
      "POST",
      "PUT",
      "DELETE"
    ],
    correctAnswer: 1
  },
  {
    id: 5,
    question: "What does API stand for?",
    options: [
      "Application Programming Interface",//0
      "Advanced Programming Interface",
      "Automated Programming Interface",
      "Application Process Integration"
    ],
    correctAnswer: 1
  }
]

export default function DeveloperMCQTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState(Array(questions.length).fill(null))
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (answer) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const handleBefore = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion - 1)
    } else {
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      // Ensure we only compare if the question exists
      if (questions[index] && answer === questions[index].correctAnswer) {
        return score + 1;
      }
      return score;
    });
  }


  const analyzePerformance = (score) => {
    const percentage = (score / questions.length) * 100
    if (percentage >= 80) {
      return "Excellent! You have a strong grasp of fundamental coding concepts."
    } else if (percentage >= 60) {
      return "Good job! You have a solid understanding, but there's room for improvement."
    } else if (percentage >= 40) {
      return "You're on the right track, but you might want to review some core concepts."
    } else {
      return "It seems you're just starting out. Keep learning and practicing!"
    }
  }

  if (showResults) {
    const score = calculateScore()
    const analysis = analyzePerformance(score)
    return (
      <div className="m-5 w-full p-4 max-w-3xl mx-auto  border-black border-2 rounded-lg">
        <div>
          <div className='p-5 text-center text-3xl font-bold'>Test Results</div>
          <div>Here's how you performed on the coding ability test</div>
        </div>


        <div clas>
          <div className="space-y-4">
            <div>
              <div>Your Score</div>
              <div className="text-4xl font-bold">{score} / {questions.length}</div>
            </div>
            <div value={(score / questions.length) * 100} className="w-full bg-grey h-1 " ></div>
            <div>
              <div>Analysis:-</div>
              <p className="text-lg">{analysis}</p>
            </div>
          </div>
        </div>


          <div onClick={() => window.location.reload()} className="border-black border-2 rounded-lg w-fit justify-center align-middle">Retake Test</div>
      </div>
    )
  }

  return (
    <div className="w-full p-4 max-w-3xl mx-auto border-black border-2 rounded-lg mt-10">
      <div>
        <div className='text-center text-3xl font-bold p-4'>Coding Ability Test</div>
        <div className='text-center text-lg font-bold p-2'>Question {currentQuestion + 1} of {questions.length}</div>
      </div>
      <div className='mb-10 h-1 rounded-full opacity-15 bg-gray-400'></div>
      <div>
        <div className="space-y-4">
          <div className=" text-lg font-bold">{questions[currentQuestion].question}</div>
          <div value={answers[currentQuestion]?.toString()} onValueChange={(value) => handleAnswer(parseInt(value))}>
            {questions[currentQuestion].options.map((option, index) => (
              <div key={index} class="flex items-center space-x-2 ml-4">
                <input type="radio" id={`option-${index}`} name="option" value={index.toString()} class="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                <label htmlFor={`option-${index}`} class="ml-2 block text-sm text-gray-900">{option}</label>
              </div>
              // <div key={index} className="flex items-center space-x-2">
              //   <div value={index.toString()} id={`option-${index}`} />
              //   <label htmlFor={`option-${index}`}>{option}</label>
              // </div>
            ))}
          </div>
        </div>
      </div>
      <div className='flex justify-between p-4'>
        <div onClick={handleBefore} disabled={answers[currentQuestion] === null} className="mr-5 border-black border-2 rounded-lg p-2 hover:bg-light_yellow transition-all duration-300">
          {currentQuestion === questions.length - 1 ? 'Submit' : 'Previous'}
        </div>

        <div onClick={handleNext} disabled={answers[currentQuestion] === null} className="  border-black border-2 rounded-lg p-2 hover:bg-light_yellow transition-all duration-300 ">
          {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
        </div>
      </div>
    </div >
  )
}