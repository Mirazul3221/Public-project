import { viewurl } from '@/app/config'
import React from 'react'
import { FaThumbsUp } from 'react-icons/fa'
import { formatRelativeTime } from '../../timeline/components/common'
import Link from 'next/link'

const QuestionLikeCard = ({ item }) => {
  const handleNavigate = () => {
    const url = `/?feedid=${item?.pointerId}&type=${item.type === 'mcq_liked' ? "mcq" : item.type === 'exam_liked' ? "exam" : item.type === 'post_liked' ? "post" : ""
      }&reactiontype=like`;
    window.history.pushState({}, "", url);
    // onNavigate?.(item?.pointerId, item.type === 'mcq_liked' ? "mcq" : item.type === 'exam_liked' ? "exam" : item.type === 'post_liked' ? "post" : "");
  }
  return (
    <div
      onClick={handleNavigate}
      className="py-2 border-b mb-2 rounded-md cursor-pointer"
    >
      <div>
        {formatRelativeTime(item?.createdAt)}

        <div className="flex items-center gap-4">
          <div>
            <div className="w-12 h-12 relative text-gray-700">
              <div className="bg-[#7305fa] border rounded-full flex justify-center items-center absolute -right-1 -bottom-1 text-lg">

                {
                  item.type === "mcq_like"
                    ? <FaThumbsUp
                      color="gray"
                      size={15}
                      style={{
                        filter:
                          "drop-shadow(0 0 0 white) drop-shadow(0 0 1px white)",
                      }}
                    />
                    : item.type === "exam_like"
                      ? <FaThumbsUp
                        color="gray"
                        size={15}
                        style={{
                          filter:
                            "drop-shadow(0 0 0 white) drop-shadow(0 0 1px white)",
                        }}
                      />
                      : item.type === "post_like"
                        ? <FaThumbsUp
                          color="gray"
                          size={15}
                          style={{
                            filter:
                              "drop-shadow(0 0 0 white) drop-shadow(0 0 1px white)",
                          }}
                        />


                        : item.type === "mcq_love"
                          ? <img className='w-5' src="/lottie/love.svg" alt="love" />
                          : item.type === "exam_love"
                            ? <img className='w-5' src="/lottie/love.svg" alt="love" />
                            : item.type === "post_love"
                              ? <img className='w-5' src="/lottie/love.svg" alt="love" />

                              : item.type === "mcq_haha"
                                ? <img className='w-5' src="/lottie/haha.svg" alt="sad" />
                                : item.type === "exam_haha"
                                  ? <img className='w-5' src="/lottie/haha.svg" alt="sad" />
                                  : item.type === "post_haha"
                                    ? <img className='w-5' src="/lottie/haha.svg" alt="sad" />

                                    : item.type === "mcq_sad"
                                      ? <img className='w-5' src="/lottie/sad.svg" alt="sad" />
                                      : item.type === "exam_sad"
                                        ? <img className='w-5' src="/lottie/sad.svg" alt="sad" />
                                        : item.type === "post_sad"
                                          ? <img className='w-5' src="/lottie/sad.svg" alt="sad" />

                                          : item.type === "mcq_angry"
                                            ? <img className='w-5' src="/lottie/angry.svg" alt="angry" />
                                            : item.type === "exam_angry"
                                              ? <img className='w-5' src="/lottie/angry.svg" alt="angry" />
                                              : item.type === "post_angry"
                                                ? <img className='w-5' src="/lottie/angry.svg" alt="angry" />


                                                : item.type === "mcq_wow"
                                                  ? <img className='w-5' src="/lottie/wow.svg" alt="sad" />
                                                  : item.type === "exam_wow"
                                                    ? <img className='w-5' src="/lottie/wow.svg" alt="sad" />
                                                    : item.type === "post_wow"
                                                      ? <img className='w-5' src="/lottie/wow.svg" alt="sad" />
                                                      : ""
                }
              </div>

              <Link
                href={`/profile/${item?.senderId?._id}`}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  className="rounded-full"
                  src={item?.senderId.profile}
                  alt={item?.senderId.name}
                />
              </Link>
            </div>
          </div>

          <div>
            <h2>
              <Link
                href={`/profile/${item?.senderId?._id}`}
                onClick={(e) => e.stopPropagation()}
              >
                <span className="font-bold text-[#7305fa] hover:underline">
                  {item?.senderId.name}
                </span>
              </Link>{" "}
              react your post
              {` "${item?.title}"...`}
            </h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionLikeCard
