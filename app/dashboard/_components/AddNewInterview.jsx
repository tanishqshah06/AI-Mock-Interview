"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModal";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);

  const router = useRouter();

  const { user } = useUser();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(jobDesc, jobPosition, jobExperience);

    const InputPrompt =
      "Job position : " +
      jobPosition +
      ", Job Description : " +
      jobDesc +
      ", Years of Experience : " +
      jobExperience +
      ", depending on Job Postion, Job Description & Years of Experience give us " +
      process.env.NEXT_PUBLIC_INTERVIEW_QUESTIONCOUNT +
      " interview questions along with answers in JSON format, give us question and answer field in JSON format.";
    const result = await chatSession.sendMessage(InputPrompt);

    const MockJsonResponse = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");
    // console.log("resp", MockJsonResponse);
    setJsonResponse(MockJsonResponse);

    if (MockJsonResponse) {
      const resp = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: MockJsonResponse,
          jobPosition: jobPosition,
          jobDesc: jobDesc,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress.emailAddress,
          createdAt: moment().format("DD-MM-yyyy"),
        })
        .returning({ mockId: MockInterview.mockId });

      console.log("inserted ID:", resp);
      if (resp) {
        setOpenDialog(false);
        router.push("/dashboard/interview/" + resp[0].mockId);
      }
    } else {
      console.log("Error");
    }
    setLoading(false);
  };

  return (
    <div className="">
      <div
        className="p-10 border rounded-xl bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all duration-300 ease-in-out transform flex flex-col items-center gap-2"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg font-semibold text-center text-primary">
          + Add New
        </h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl p-6 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Tell us more about your job interview
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Add details about your job position, job description, and years of
              experience.
            </DialogDescription>
          </DialogHeader>

          {/* Form Section */}
          <form onSubmit={onSubmit} className="space-y-5 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Job Role/Position
              </label>
              <Input
                placeholder="Ex: Software Engineer"
                required
                className="w-full rounded-lg border px-4 py-2"
                onChange={(event) => setJobPosition(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Job Description/Tech Stack
              </label>
              <Textarea
                placeholder="Ex: React, Node.js"
                required
                className="w-full rounded-lg border px-4 py-2"
                onChange={(event) => setJobDesc(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Years of Experience
              </label>
              <Input
                placeholder="Ex: 5"
                type="number"
                max="100"
                required
                className="w-full rounded-lg border px-4 py-2"
                onChange={(event) => setJobExperience(event.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <Button
                type="button"
                variant="ghost"
                className="px-4 py-2 rounded-lg hover:bg-gray-100"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin" /> Generating from AI
                  </>
                ) : (
                  "Start Interview"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
