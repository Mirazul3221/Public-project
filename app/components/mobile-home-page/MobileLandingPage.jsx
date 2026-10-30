'use client'
import React from 'react'
import Link from 'next/link'
import { QuizPreview } from '@/components/quiz-preview'

const MobileLandingPage = () => {
  const howToStart = () => {
  window.location.href = '/blogs/static/how-to-create-an-account-in-eduplusplus'
}
  return (
                <main className="h-screen w-screen relative mx-auto">
            <div className="bg-gradient-to-r from-[#f720b0] via-blue-600 to-cyan-500">
              <div>
                <div className="py-4">
                  <img
                    className="w-20 mx-auto"
                    src={"icons/icon-192x192.png"}
                  />
                </div>
              </div>
              <div className="p-2">
                <QuizPreview />
              </div>
              <div onClick={howToStart} className="text-center text-white py-1 mb-2 rounded-full border border-whitr w-fit px-10 mx-auto">কিভাবে শুরু করবো?</div>
              <div className="bg-white rounded-t-2xl w-full relative p-5">
                <h2 className="text-lg py-2 mb-2 text-center border-b">
                  <span className="inline">
                    Don't have an account?
                  </span>
                  <Link href={"/register"}>
                    <span className="px-2 py-1 rounded-md text-white ml-2 bg-gradient-to-r from-[#f720b0] via-blue-600 to-cyan-500">
                      Sign Up
                    </span>
                  </Link>
                </h2>
              </div>
            </div>
          </main>
  )
}

export default MobileLandingPage