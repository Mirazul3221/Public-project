import { viewurl } from '@/app/config'
import React from 'react'
import { FaRegCommentDots, FaThumbsUp } from 'react-icons/fa'
import { formatRelativeTime } from '../../timeline/components/common'
import Link from 'next/link'

const CommentCard = ({ item }) => {
    const handleNavigate = () => {
        const url = `/?feedid=${item?.pointerId}&type=${item.type === 'mcq_comment' ? "mcq" : item.type === 'exam_comment' ? "exam" : item.type === 'post_comment' ? "post" : ""
            }&commentid=${item.commentId || null}`;
        window.history.pushState({}, "", url);
    }
    return (
        <div
            onClick={handleNavigate}
            className="group rounded-xl mb-2 hover:bg-gray-50 border-b cursor-pointer transition-all duration-200"
        >
            <div className="flex gap-3">
                {/* Avatar */}
                    <div>
                                        <div className="relative shrink-0">
                    <Link
                        href={`/profile/${item?.senderId?._id}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={item?.senderId?.profile}
                            alt={item?.senderId?.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    </Link>

                    <div className="absolute -bottom-1 -right-1 bg-[#7305fa] rounded-full p-1 border-2 border-white">
                        <FaRegCommentDots size={12} color="white" />
                    </div>
                </div>
                    </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-800 leading-relaxed">
                        <Link
                            href={`/profile/${item?.senderId?._id}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span className="font-semibold hover:text-[#7305fa]">
                                {item?.senderId?.name}
                            </span>
                        </Link>

                        {" commented "}

                        {item?.feedAuthorId ? (
                            <>
                                on{" "}
                                <Link
                                    href={`/profile/${item?.feedAuthorId?._id}`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <span className="font-semibold text-[#7305fa] hover:underline">
                                        {item?.feedAuthorId?.name}'s
                                    </span>
                                </Link>{" "}
                                {item.type === "mcq_comment"
                                    ? "question"
                                    : item.type === "exam_comment"
                                        ? "exam"
                                        : "post"}  where you participated.
                            </>
                        ) : (
                            <>
                                on your{" "}
                                {item.type === "mcq_comment"
                                    ? "question"
                                    : item.type === "exam_comment"
                                        ? "exam"
                                        : "post"}
                            </>
                        )}
                    </div>

                    {/* Headline */}
                    {item?.title && (
                        <div className="mt-1 text-sm text-gray-600 line-clamp-1">
                            <span className="font-medium">Headline:</span> {item.title}
                        </div>
                    )}

                    {/* Comment Preview */}
                    {item?.message && (
                        <div className="mt-2 bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700 line-clamp-2">
                            "{item.message}"
                        </div>
                    )}

                    {/* Time */}
                    <div className="mt-2 text-xs text-gray-500">
                        {formatRelativeTime(item?.createdAt)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommentCard
