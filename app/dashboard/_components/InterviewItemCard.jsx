import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
// import { useRouter } from 'next/router'
import React from "react";

function InterviewItemCard({ interview }) {
  const router = useRouter();

  const onStart = async () => {
    router.push("/dashboard/interview/" + interview?.mockId);
  };
  const onFeedback = async () => {
    router.push("/dashboard/interview/" + interview?.mockId + "/feedback");
  };

  return (
    <div className="border shadow-sm rounded-lg p-3 ">
      <h2 className="font-bold capitalize text-primary">
        {interview?.jobPosition}
      </h2>
      <h2 className="text-sm text-gray-600">
        {interview?.jobExperience} Years of Experience
      </h2>
      <h2 className="text-sm text-gray-400">
        Created at : {interview?.createdAt}
      </h2>
      <div className="flex justify-between mt-2 gap-5">
        <Button size="sm" onClick={onFeedback} variant="outline" className="w-full">
          Feedback
        </Button>
        <Button size="sm" onClick={onStart} className="w-full">
          Start
        </Button>
      </div>
    </div>
  );
}

export default InterviewItemCard;
