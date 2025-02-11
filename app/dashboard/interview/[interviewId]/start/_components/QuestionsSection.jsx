"use client";
import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";

function QuestionsSection({ mockInterviewQuestion = {}, activeQuestionIndex }) {
  const questions =
    Object.values(mockInterviewQuestion || {}).find((val) =>
      Array.isArray(val)
    ) || [];

  // console.log("questions:", questions);
  // console.log("mockInterviewQuestion:", mockInterviewQuestion);

  if (!Array.isArray(questions)) {
    console.error("interview_questions is not an array:", questions);
    return <p>No questions available.</p>;
  }

  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry your browser does not support text to speech");
    }
  };

  return (
    questions && (
      <div className="p-5 border rounded-lg my-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {questions.length > 0 ? (
            questions.map((questionObj, index) => (
              <h2
                key={index}
                className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${
                  activeQuestionIndex === index
                    ? "bg-violet-500 text-white"
                    : ""
                }`}
              >
                Question #{index + 1}
              </h2>
            ))
          ) : (
            <p>No questions available.</p>
          )}
        </div>
        <h2 className="my-5 text-md md:text-lg">
          {questions[activeQuestionIndex]?.question}
        </h2>

        <Volume2
          className="cursor-pointer"
          onClick={() => textToSpeech(questions[activeQuestionIndex]?.question)}
        />

        <div className="border rounded-lg p-5 bg-blue-100 mt-20">
          <h2 className="flex gap-2 items-center text-primary">
            <Lightbulb />
            <strong>Note : </strong>
          </h2>
          <h2 className="text-sm text-primary my-2">
            {process.env.NEXT_PUBLIC_QUESTION_NOTE}
          </h2>
        </div>
      </div>
    )
  );
}

export default QuestionsSection;
