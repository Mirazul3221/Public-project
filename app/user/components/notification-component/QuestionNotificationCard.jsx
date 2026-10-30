import { viewurl } from '@/app/config'
import React from 'react'
import { formatRelativeTime } from '../../timeline/components/common'
import { LuTextQuote } from 'react-icons/lu';
import { GrTextWrap } from 'react-icons/gr';
import Link from 'next/link';
import { BsQuestionLg } from 'react-icons/bs';
const QuestionNotificationCard = ({ item, onNavigate }) => {
    const handleNavigate = () => {
    if (onNavigate == null) return;
    const url = `/?feedid=${item?.pointerId}&type=${item.type}`;
    window.history.pushState({}, "", url);
    onNavigate?.(item?.pointerId, item.type);
  }
  return (
    <div  onClick={handleNavigate} className='py-2 border-b mb-2 rounded-md'>
        {formatRelativeTime(item?.createdAt)}
        <div className='flex gap-4 items-center'>
          <div>
            <div className="w-12 h-12 relative text-gray-700">
              <div className="bg-[#7305fa] border p-1 rounded-full flex justify-center items-center absolute -right-1 -bottom-1">
                {
                  item.type == 'mcq' ? <BsQuestionLg color="#ffffff" size={15} /> : <GrTextWrap color="#ffffff" size={15} />
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
            <h2>          <Link
                        href={`/profile/${item?.senderId?._id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="font-bold text-[#7305fa] hover:underline">
                          {item?.senderId.name}
                        </span>
                      </Link>{" "} {item.type == 'mcq' ? 'shared a question' : 'shared a post'} {` "${item?.title}`}..."</h2>
          </div>
        </div>
    </div>
  )
}

export default QuestionNotificationCard
