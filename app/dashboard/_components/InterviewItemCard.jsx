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
    <div className="border shadow-md rounded-lg p-5 bg-white hover:shadow-lg transition-all duration-300 ease-in-out transform">
      {/* Job Title & Experience */}
      <div className="mb-3">
        <h2 className="text-xl font-semibold text-primary capitalize">
          {interview?.jobPosition}
        </h2>
        <p className="text-sm text-gray-600">
          {interview?.jobExperience} Years of Experience
        </p>
      </div>

      {/* Created At Date */}
      <p className="text-xs text-gray-500">
        Created at:{" "} 
        {interview?.createdAt
          ? new Date(interview.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "N/A"}
      </p>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        <Button
          size="sm"
          onClick={onFeedback}
          variant="outline"
          className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
        >
          Feedback
        </Button>
        <Button
          size="sm"
          onClick={onStart}
          className="w-full bg-primary text-white hover:bg-opacity-90 transition-all"
        >
          Start
        </Button>
      </div>
    </div>
  );
}

export default InterviewItemCard;
