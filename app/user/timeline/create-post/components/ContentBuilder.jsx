'use client'
import React, { useState } from "react";
import AddQuestion from "./AddQuestion";
import CreateExamForm from "@/app/exam/components/CreateExamForm";
import FacebookStyleEditor from "./FeedMakerrr";


const ContentBuilder = () => {
  const [variance, setVariance] = useState('mcq');
  return (
    <div className="bg-white">
          <div className="py-2">
            <div className="flex font-semibold  justify-center items-center gap-4 w-fit mx-auto my-3 text-gray-900">
              <button onClick={() => { setVariance('mcq') }} className={`border-b-2 ${variance == 'mcq' ? "border-black" : "border-white"} px-2 py-1`}>Create MCQ</button>
              <button onClick={() => { setVariance('exam') }} className={`border-b-2 ${variance == 'exam' ? "border-black" : "border-white"} px-2 py-1`}>Create Exam</button>
              <button onClick={() => { setVariance('post') }} className={`border-b-2 ${variance == 'post' ? "border-black" : "border-white"} px-2 py-1`}>Create Post</button>
            </div>
            <div className="overflow-y-scroll w-full h-[90vh] md:h-[70vh] py-2">

            {
              variance == 'mcq' && <div className="md:px-10 px-4"><AddQuestion /></div>
            }
            {
              variance == 'exam' && <CreateExamForm />
            }
            {
              variance == 'post' &&  <div className="md:w-[40vw] mx-auto"><FacebookStyleEditor  /></div>
            }
            </div>


          </div>
    </div>
  );
};

export default ContentBuilder;
