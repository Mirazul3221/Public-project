"use client";
import React from "react";
import { MdAddCall } from "react-icons/md";
import { MdOutlineMessage } from "react-icons/md";
import { IoShareSocialOutline } from "react-icons/io5";
import { Banner } from "../adsterra/Banner";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaSquareWhatsapp } from "react-icons/fa6";
const Footer = () => {
  return (
    <footer className="text-gray-700 dark:text-gray-200 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* About Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">About EduPlusPlus</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            EduPlusPlus offers unlimited MCQs across subjects like Math, Science, English, and more.
            Each question comes with detailed explanations to help you learn and prepare effectively.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Links</h3>
          <ul className="text-gray-600 dark:text-gray-300">
            <li>
              <a href="/blogs/static/how-to-create-an-account-in-eduplusplus" className="hover:text-blue-600 transition-colors duration-200">
                How to Start
              </a>
            </li>
            <li>
              <a href="/about-us" className="hover:text-blue-600 transition-colors duration-200">
                About Us
              </a>
            </li>
            <li>
              <a href="/privacy-policy" className="hover:text-blue-600 transition-colors duration-200">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/login" className="hover:text-blue-600 transition-colors duration-200">
                Login
              </a>
            </li>
            <li>
              <a href="/signup" className="hover:text-blue-600 transition-colors duration-200">
                Sign Up
              </a>
            </li>
          </ul>
        </div>

        {/* Contact / Social */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Connect with Us</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Have questions or suggestions? Contact us anytime.</p>
          <ul className="flex space-x-4 mt-2">
            <li>
              <a href="https://facebook.com" className="hover:text-blue-600 transition-colors duration-200">
                Facebook
              </a>
            </li>
            <li>
              <a href="https://twitter.com" className="hover:text-blue-500 transition-colors duration-200">
                Twitter
              </a>
            </li>
            <li>
              <a href="https://linkedin.com" className="hover:text-blue-700 transition-colors duration-200">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 text-center py-4 text-sm text-gray-500 dark:text-gray-400">
        © 2026 EduPlusPlus. All rights reserved. Designed for MCQ learners and exam preparation.
      </div>
    </footer>
//     <div className="bg-[#212529] md:pt-20 hidden md:block">
//       <div className="top md:grid grid-cols-3 gap-10">
//         <div className="item px-10">
//           <div className="heading">
//             <h2 className="mb-2 text-2xl text-white">Contact Info</h2>
//             <div className="w-full h-[1px] bg-gray-600">
//               <div className="w-1/3 h-[1px] bg-white"></div>
//             </div>
//           </div>
//           <div className="mt-4 space-y-6">
//             <div className="call flex gap-4 items-center">
//               <MdAddCall size={40} color="gray" />
//               <div className="">
//                 <p className="text-md text-gray-300">MON TO SUN : 24/7</p>
//                 <h3 className="text-2xl text-gray-300">UK +</h3>
//               </div>
//             </div>
//             <div className="call flex gap-4 items-center">
//               <MdOutlineMessage size={40} color="gray" />
//               <div className="">
//                 <p className="text-md text-gray-300">DO YOU HAVE A QUESTION?</p>
//                 <h3 className="text-2xl text-gray-300">
//                   lorem ipsum dolor.com
//                 </h3>
//               </div>
//             </div>
//             <div className="call flex gap-4 items-center">
//               <IoShareSocialOutline size={40} color="gray" />
//               <div className="">
//                 <p className="text-md text-gray-300">DO YOU HAVE A QUESTION?</p>
//                 <h3 className="text-2xl text-gray-300">
//                   lorem ipsum dolor.com
//                 </h3>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="item px-10">
//           <div className="heading">
//             <h2 className="mb-2 text-2xl text-white">Quick Links</h2>
//             <div className="w-full h-[1px] bg-gray-600">
//               <div className="w-1/3 h-[1px] bg-white"></div>
//             </div>
//           </div>
//           <div className="body flex gap-10 mt-4">
//             <div className="left">
//               <ul className="text-gray-300 space-y-3">
//                 <li>
//                   <a href="./">Home</a>
//                 </li>
//                 <li>
//                   <a href="./">Order a Resume</a>
//                 </li>
//                 <li>
//                   <a href="./">Cover Letter</a>
//                 </li>
//                 <li>
//                   <a href="./">Word Template</a>
//                 </li>
//                 <li>
//                   <a href="./">Blog</a>
//                 </li>
//                 <li>
//                   <a href="./">Url to PDF</a>
//                 </li>
//               </ul>
//             </div>
//             <div className="right">
//               <ul className="text-gray-300 space-y-3">
//                 <li>
//                   <a href="./">Download Apps</a>
//                 </li>
//                 <li>
//                   <a href="./">Resume</a>
//                 </li>
//                 <li>
//                   <a href="./">Website</a>
//                 </li>
//                 <li>
//                   <a href="./">Job Alert</a>
//                 </li>
//                 <li>
//                   <a href="./">Career</a>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//         <div className="item px-10">
//           <div className="heading">
//             <h2 className="mb-2 text-2xl text-white">Our Company</h2>
//             <div className="w-full h-[1px] bg-gray-600">
//               <div className="w-1/3 h-[1px] bg-white"></div>
//             </div>
//           </div>
//           <div className="body flex gap-10 mt-4">
//             <div className="left">
//               <ul className="text-gray-300 space-y-3">
//                 <li>
//                   <a href="./">About Us</a>
//                 </li>
//                 <li>
//                   <a href="./">Order a Resume</a>
//                 </li>
//                 <li>
//                   <a href="./">Privacy Policy</a>
//                 </li>
//                 <li>
//                   <a href="./">Affiliate Program</a>
//                 </li>
//               </ul>
//             </div>
//             <div className="right">
//               <ul className="text-gray-300 space-y-3">
//                 <li>
//                   <a href="./">Contact Us</a>
//                 </li>
//                 <li>
//                   <a href="./">Terms & Conditions</a>
//                 </li>
//                 <li>
//                   <a href="./Sponsorship">Sponsorship Program</a>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div>
//       <div>
      
//       <Banner/>
// <div className="footer flex justify-between items-center text-gray-300 py-4 md:px-10 px-4">
//    <div className="md:flex gap-1 items-center">
//    <h2>
//     © Copyright 2024 | All Rights Reserved 
//   </h2>
//   <h1>Bcs preparation online platform</h1>
//    </div>
//    <div className="flex gap-2">
//      <a href="/register">Sign Up</a>
//      <a href="/login">Log In</a>
//      <a href="https://en.wikipedia.org/wiki/BCS_Examination">Learn more</a>
//    </div>
//   <div className="flex items-center md:gap-4 gap-2">
//     <FaFacebook size={25} />
//     <FaSquareWhatsapp size={25} />
//     <FaLinkedin size={25} />
//   </div>
// </div>
// </div>
//       </div>
//     </div>
  );
};

export default Footer;
