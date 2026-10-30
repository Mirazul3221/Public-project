"use client";

import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { viewurl } from "@/app/config";
import React from "react";

const Page = () => {
  const openaNewWindow = () => {
    window.open(`${viewurl}/register`, "_blank");
  };

  return (
    <div>
      <Header />

      <h1 className="md:text-3xl text-2xl font-bold text-center text-white py-5 md:py-10 bg-[#3E19FA]">
        How to Create an EduPlusPlus Account
      </h1>

      <main className="px-4 md:px-10 mt-4">

        {/* Introduction */}

        <p className="text-center md:px-20 text-md leading-8">
          <strong>EduPlusPlus</strong> একটি কমিউনিটি-ভিত্তিক MCQ শেয়ারিং ও
          পরীক্ষার প্রস্তুতির প্ল্যাটফর্ম। এখানে BCS Preliminary, ব্যাংক,
          শিক্ষক নিবন্ধনসহ বিভিন্ন প্রতিযোগিতামূলক পরীক্ষার জন্য নিয়মিত MCQ
          অনুশীলন করতে পারবেন। একটি অ্যাকাউন্ট তৈরি করলে আপনি প্রশ্নের উত্তর
          দিতে, নিজের অগ্রগতি পর্যবেক্ষণ করতে এবং আপনার পারফরম্যান্স
          স্বয়ংক্রিয়ভাবে প্রোফাইলে সংরক্ষণ করতে পারবেন।
          <br />
          <br />
          নিচের ধাপগুলো অনুসরণ করলে মাত্র ৫ মিনিটের মধ্যেই আপনি
          <strong> EduPlusPlus </strong>
          পরিবারের একজন সদস্য হয়ে যেতে পারবেন।
        </p>

        {/* Step 1 */}

        <div className="md:flex justify-between items-center gap-6 mt-8">
          <div className="md:w-1/2 px-2 md:px-6 leading-8">

            <h2 className="text-[#3E19FA] font-bold text-2xl mb-4">
              Step 1
            </h2>

            <p>
              প্রথমে আপনার মোবাইলের জন্য EduPlusPlus অ্যাপটি
            </p>

            <a
              href="/app/eduplusplus.apk"
              download
              className="inline-block mt-2 mb-4 px-4 py-2 rounded bg-[#623bff] text-white hover:bg-[#4b20ff]"
            >
              Download Android App
            </a>

            <p>
              অ্যাপটি ইনস্টল করার পর উপরের ডান পাশে থাকা
              <strong> Join </strong>
              বাটনে ক্লিক করুন অথবা
              <span
                onClick={openaNewWindow}
                className="text-[#3E19FA] font-bold cursor-pointer"
              >
                {" "}
                এখানে ক্লিক করুন
              </span>
              ।
            </p>

            <br />

            <p>রেজিস্ট্রেশন ফর্মে নিচের তথ্যগুলো পূরণ করুন।</p>

            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>আপনার পূর্ণ নাম (ইংরেজিতে)</li>
              <li>একটি সচল (Valid) ইমেইল ঠিকানা</li>
              <li>ন্যূনতম ৬ অক্ষরের একটি শক্তিশালী পাসওয়ার্ড</li>
            </ul>

            <br />

            <p>
              সব তথ্য সঠিকভাবে পূরণ করার পর
              <strong> Verify Email </strong>
              বাটনে ক্লিক করুন।
            </p>

            <p className="mt-4 font-semibold text-green-600">
              ✔️ আপনার রেজিস্ট্রেশনের প্রথম ধাপ সম্পন্ন হয়েছে।
            </p>
          </div>

          <div className="md:w-1/2 mt-6 md:mt-0">
            <img
              className="border-4 border-gray-100 rounded-lg"
              src="/blogs/how-to-create-an-account-in-eduplusplus/register-form.jpg"
              alt="Registration Form"
            />
          </div>
        </div>

        {/* Step 2 */}

        <div className="md:flex justify-between items-center gap-6 mt-12">

          <div className="md:w-1/2 hidden md:block">
            <img
              className="border-4 border-gray-100 rounded-lg"
              src="/blogs/how-to-create-an-account-in-eduplusplus/mail-md.jpg"
              alt="Verification Mail"
            />
          </div>

          <div className="md:w-1/2 leading-8">

            <h2 className="text-[#3E19FA] font-bold text-2xl mb-4">
              Step 2
            </h2>

            <p>
              Verify Email বাটনে ক্লিক করার পর আপনার ইমেইল ঠিকানায় একটি
              ভেরিফিকেশন ইমেইল পাঠানো হবে।
            </p>

            <br />

            <p>
              সাধারণত ইমেইলটি সঙ্গে সঙ্গেই পৌঁছে যায়। তবে কিছু ক্ষেত্রে
              সর্বোচ্চ ৫ মিনিট পর্যন্ত সময় লাগতে পারে।
            </p>

            <br />

            <p>
              যদি Inbox-এ ইমেইলটি না পান, তাহলে
              <strong> Spam অথবা Junk </strong>
              Folder-এ একবার দেখে নিন।
            </p>

            <br />

            <p>
              ইমেইলটি ওপেন করে
              <strong> Verify Email </strong>
              বাটনে ক্লিক করলেই আপনার অ্যাকাউন্ট সম্পূর্ণভাবে সক্রিয় হয়ে যাবে।
            </p>

            <p className="mt-4 font-semibold text-green-600">
              ✔️ আপনার অ্যাকাউন্ট এখন ব্যবহার করার জন্য প্রস্তুত।
            </p>

          </div>

          <img
            className="border-4 border-gray-100 rounded-lg mt-6 md:hidden"
            src="/blogs/how-to-create-an-account-in-eduplusplus/mail-md.jpg"
            alt="Verification Mail"
          />
        </div>

        {/* Step 3 */}

        <div className="md:flex justify-between items-center gap-6 mt-12">

          <div className="md:w-1/2 leading-8">

            <h2 className="text-[#3E19FA] font-bold text-2xl mb-4">
              Step 3
            </h2>

            <p>
              অ্যাকাউন্ট সক্রিয় হওয়ার পর একটি সুন্দর
              <strong> প্রোফাইল ছবি </strong>,
              <strong> টাইটেল </strong>
              এবং নিজের সম্পর্কে একটি সংক্ষিপ্ত পরিচিতি যুক্ত করুন।
            </p>

            <br />

            <p>
              এরপর আপনি MCQ অনুশীলন শুরু করতে পারবেন।
            </p>

            <br />

            <p>
              আপনার প্রতিটি সঠিক ও ভুল উত্তর
              <strong> স্বয়ংক্রিয়ভাবে </strong>
              আপনার প্রোফাইলে সংরক্ষণ হবে।
            </p>

            <br />

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <strong>গুরুত্বপূর্ণ:</strong>

              <br />

              প্রতিটি প্রশ্নের জন্য শুধুমাত্র
              <strong> প্রথম উত্তরটিই </strong>
              আপনার পারফরম্যান্স হিসেবে গণনা করা হবে।

              <br />
              <br />

              একই প্রশ্ন পরে আবার উত্তর পরিবর্তন করলেও স্কোর পরিবর্তন হবে না।
              তাই উত্তর দেওয়ার আগে ভালোভাবে চিন্তা করে সঠিক অপশন নির্বাচন করুন।
            </div>

            <br />

            <p className="font-semibold text-green-600">
              🎉 অভিনন্দন! এখন আপনি EduPlusPlus ব্যবহার করার জন্য সম্পূর্ণ প্রস্তুত।
            </p>

          </div>

          <div className="md:w-1/2 mt-6 md:mt-0">
            <img
              className="border-4 border-gray-100 rounded-lg"
              src="/desktop_view.jpg"
              alt="EduPlusPlus Dashboard"
            />
          </div>

        </div>

        {/* Desktop */}

        <div className="my-12">

          <h2 className="text-center text-2xl font-bold text-[#3E19FA] mb-6">
            Desktop Application
          </h2>

          <p className="text-center md:text-xl italic text-amber-600 mb-8">
            আপনি চাইলে Desktop App-ও ব্যবহার করতে পারেন। নিচের ছবিতে ডান পাশে
            নির্দেশিত Install আইকনে ক্লিক করে খুব সহজেই EduPlusPlus আপনার
            কম্পিউটারে ইনস্টল করুন।
          </p>

          <img
            className="border-4 border-gray-100 rounded-lg"
            src="/blogs/how-to-create-an-account-in-eduplusplus/desktop-app.jpg"
            alt="Desktop App"
          />

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default Page;