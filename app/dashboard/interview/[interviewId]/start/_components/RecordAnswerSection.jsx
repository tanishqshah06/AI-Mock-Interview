"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import img2 from "../../../../../../public/webcam.png";
import { Button } from "@/components/ui/button";

import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModal";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import moment from "moment/moment";

function RecordAnswerSection({
  mockInterviewQuestion = {},
  activeQuestionIndex,
  interviewData,
}) {
  const questions = mockInterviewQuestion?.interviewQuestions || [];

  const [userAnswer, setUserAnswer] = useState();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    results.map((result) =>
      setUserAnswer((prevAns) => prevAns + result?.transcript)
    );
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer?.length > 10) {
      UpdateUserAnswer();
    }
  }, [userAnswer]);

  const StartStopRecording = async () => {
    if (isRecording) {
      // setLoading(true);
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  // const StartStopRecording = async () => {};

  const UpdateUserAnswer = async () => {
    console.log(userAnswer);
    setLoading(true);
    const feedbackPrompt =
      "Question: " +
      questions[activeQuestionIndex]?.question +
      ", User Answer: " +
      userAnswer +
      ", Depending on question and user answer for the given interview question" +
      "please give us rating for answer and feedback as area of improvement, if any" +
      "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field.";

    const result = await chatSession.sendMessage(feedbackPrompt);

    console.log("question", questions[activeQuestionIndex]?.answer);

    const mockJsonResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");

    // console.log(mockJsonResp);
    const JsonFeedbackResp = JSON.parse(mockJsonResp);

    const resp = await db.insert(UserAnswer).values({
      mockIdRef: interviewData?.mockId,
      question: questions[activeQuestionIndex]?.question,
      correctAns: questions[activeQuestionIndex]?.answer,
      userAns: userAnswer,
      feedback: JsonFeedbackResp?.feedback,
      rating: JsonFeedbackResp?.rating,
      userEmail: user?.email,
      createdAt: moment().format("DD-MM-yyyy"),
    });
    if (resp) {
      console.log("resposne", resp);
      toast("User Answer recorded successfully");
      setResults([]);
    }
    setResults([]);
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col justify-center items-center bg-black rounded-lg p-5 my-16">
        <Image
          src={img2}
          alt=""
          className="absolute"
          width={200}
          height={200}
        />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>
      <Button
        disabled={loading}
        onClick={StartStopRecording}
        variant="outline"
        className="my-10"
      >
        {isRecording ? (
          <h2 className="text-red-600 flex gap-2">
            <StopCircle />
            'Stop Recording....'
          </h2>
        ) : (
          <h2 className="text-primary items-center flex gap-2">
            <Mic />
            Record Answer
          </h2>
        )}
      </Button>

      {/* <Button onClick={() => console.log(userAnswer)}>Show user answer</Button> */}
    </div>
  );
}

export default RecordAnswerSection;
