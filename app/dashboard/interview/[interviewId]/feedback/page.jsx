"use client";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { use, useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown, Star, StarHalf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

function Feedback({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const router = useRouter();

  const [expandedIndex, setExpandedIndex] = useState(null);

  const [feedbackList, setFeedbackList] = useState([]);

  //   console.log(params)
  useEffect(() => {
    getFeedback();
  }, []);

  const getFeedback = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);

    console.log(result);
    setFeedbackList(result);
  };
  //   console.log()

  const overallRating =
    feedbackList.length > 0
      ? Math.round(
          feedbackList.reduce((sum, item) => sum + item.rating, 0) /
            feedbackList.length
        )
      : 0;
  const handleToggle = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {feedbackList.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-gray-600">
              No Interview Feedback Record Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              It seems you haven't completed any interviews yet. Start an
              interview to see your feedback here.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.replace("/dashboard")}>
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-green-500">
                Congratulations!
              </CardTitle>
              <CardDescription className="text-xl">
                Here's your interview feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Overall Interview Rating
                </h3>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) =>
                    star <= 3 ? (
                      <Star
                        key={star}
                        className="w-6 h-6 text-yellow-400 fill-yellow-400"
                      />
                    ) : star === 4 ? (
                      <StarHalf
                        key={star}
                        className="w-6 h-6 text-yellow-400 fill-yellow-400"
                      />
                    ) : (
                      <Star key={star} className="w-6 h-6 text-gray-300" />
                    )
                  )}
                  <span className="ml-2 text-2xl font-bold">7/10</span>
                </div>
              </div>
              <Progress value={overallRating * 10} className="h-2 mb-4" />
              <p className="text-sm text-gray-500">
                Below you'll find each interview question with the correct
                answer, your answer, and feedback for improvement.
              </p>
            </CardContent>
          </Card>

          {feedbackList.map((item, index) => (
            <Collapsible
              key={index}
              open={expandedIndex === index}
              onOpenChange={() => handleToggle(index)}
              className="mb-4"
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{`Question ${
                        index + 1
                      }`}</CardTitle>
                      <ChevronsUpDown className="h-4 w-4 text-gray-500" />
                    </div>
                    <CardDescription className="text-base font-medium text-gray-700">
                      {item.question}
                    </CardDescription>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                        <span className="font-semibold">Rating:</span>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= item.rating / 2
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-2 font-bold">
                            {item.rating}/10
                          </span>
                        </div>
                      </div>
                      <div className="p-3 border rounded-lg bg-red-50">
                        <h3 className="font-semibold text-red-700 mb-1">
                          Your Answer
                        </h3>
                        <p className="text-sm text-red-900">{item.userAns}</p>
                      </div>
                      <div className="p-3 border rounded-lg bg-green-50">
                        <h3 className="font-semibold text-green-700 mb-1">
                          Correct Answer
                        </h3>
                        <p className="text-sm text-green-900">
                          {item.correctAns}
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg bg-blue-50">
                        <h3 className="font-semibold text-blue-700 mb-1">
                          Feedback
                        </h3>
                        <p className="text-sm text-blue-900">{item.feedback}</p>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}

          <div className="flex justify-between mt-8">
            {/* <Button
              onClick={() => router.replace("/dashboard")}
              variant="outline"
            >
              <Home className="mr-2 h-4 w-4" /> Go to Dashboard
            </Button>
            <Button onClick={handleDownloadPDF}>
              <Download className="mr-2 h-4 w-4" /> Download PDF Report
            </Button> */}
          </div>
        </>
      )}
    </div>
  );
}

export default Feedback;
