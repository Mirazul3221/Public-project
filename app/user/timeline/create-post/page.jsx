'use client'
import React, { useState } from "react";
import SuperHeader from "../../components/SuperHeader";
import ProtectRoute from "@/app/global/ProtectRoute";
import Footer from "@/app/components/Footer";
import AddQuestion from "./components/AddQuestion";
import ExamInitForm from "../../components/exam-model-components/ExamInit";
import CreateExamForm from "@/app/exam/components/CreateExamForm";
import AddPost from "./components/AddPost";

const page = () => {
  const [variance, setVariance] = useState('mcq');
  return (
    <div className="bg-white">
      <ProtectRoute>
        <div>
          <div className="header px-4 py-3 md:px-10">
            <SuperHeader />
          </div>
          <div className="md:px-10 px-4 border-t py-4 md:pt-4 min-h-[80vh]">
            <div className="flex font-semibold  justify-center items-center gap-4 w-fit mx-auto my-3 text-gray-900">
              <button onClick={() => { setVariance('mcq') }} className={`border-b-2 ${variance == 'mcq' ? "border-black" : "border-white"} px-2 py-1`}>Create MCQ</button>
              <button onClick={() => { setVariance('exam') }} className={`border-b-2 ${variance == 'exam' ? "border-black" : "border-white"} px-2 py-1`}>Create Exam</button>
              <button onClick={() => { setVariance('post') }} className={`border-b-2 ${variance == 'post' ? "border-black" : "border-white"} px-2 py-1`}>Create Post</button>
            </div>
            {
              variance == 'mcq' && <AddQuestion />
            }
            {
              variance == 'exam' && <CreateExamForm />
            }
            {
              variance == 'post' && <AddPost />
            }


          </div>
          <Footer />
        </div>
      </ProtectRoute>
    </div>
  );
};

export default page;
