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
import { v4 as uuidv4 } from 'uuid';
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

  const router = useRouter()

  const {user} = useUser()

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
    console.log("resp", MockJsonResponse);
    setJsonResponse(MockJsonResponse);

    if(MockJsonResponse){
        const resp = await db.insert(MockInterview).values({
            mockId : uuidv4(),
            jsonMockResp: MockJsonResponse,
            jobPosition: jobPosition,
            jobDesc: jobDesc,
            jobExperience: jobExperience,
            createdBy: user?.primaryEmailAddress.emailAddress,
            createdAt:  moment().format('DD-MM-yyyy')
        }).returning({mockId : MockInterview.mockId})
    
        console.log("inserted ID:", resp)
        if(resp){
            setOpenDialog(false)
            router.push('/dashboard/interview/'+resp[0].mockId)
        }
    } else{
        console.log("Error")
    }
    setLoading(false);
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-sm cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interviewing
            </DialogTitle>

            {/* Remove <p> inside DialogDescription */}
            <DialogDescription>
              Add details about your job position/role, job description, and
              years of experience.
            </DialogDescription>

            {/* Move the form outside of DialogDescription */}
            <form onSubmit={onSubmit}>
              <div className="mt-7 my-3">
                <label>Job Role/Job Position</label>
                <Input
                  placeholder="Ex: Software Engineer"
                  required
                  onChange={(event) => setJobPosition(event.target.value)}
                />
              </div>
              <div className="my-3">
                <label>Job Description/Tech Stack (In Short)</label>
                <Textarea
                  placeholder="Ex: React, Node.js"
                  required
                  onChange={(event) => setJobDesc(event.target.value)}
                />
              </div>
              <div className="my-3">
                <label>Years of Experience</label>
                <Input
                  placeholder="Ex: 5"
                  type="number"
                  max="100"
                  required
                  onChange={(event) => setJobExperience(event.target.value)}
                />
              </div>

              <div className="flex gap-5 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      {" "}
                      <LoaderCircle className="animate-spin" />
                      'Generating from AI'{" "}
                    </>
                  ) : (
                    "Start Interview"
                  )}
                </Button>
              </div>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
