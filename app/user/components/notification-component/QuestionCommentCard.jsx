import { viewurl } from "@/app/config";
import React, { useState } from "react";
import { FaComment } from "react-icons/fa";
import { formatRelativeTime } from "../../timeline/components/common";
import { IoIosArrowDown, IoIosSend } from "react-icons/io";
const QuestionCommentCard = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div className="py-2 border-b px-2">
        <a href={`${viewurl}/user/timeline`}>
          {/* <span>{formatRelativeTime(item.createdAt)}</span> */}
          <div className="flex items-center gap-4">
            <div>
              <div className="w-12 h-12">
                <div className="relative text-gray-700">
                  {/* <FaComment
                  className="absolute right-0 bottom-0"
                  color="#7305fa"
                  size={20}
                /> */}
                  <img
                    className="rounded-full"
                    src={'https://www.gmc.edu.bd/resources/images/uploads/gmc-logo.png'}
                  // alt={item?.message[0]?.requesterName}
                  />
                </div>
              </div>
            </div>
            <div className="w-9/12">
              <h2>
                <span className="font-bold text-[#7305fa]">
                  {/* {item?.message[0]?.requesterName} */}
                </span>{" "}
                mirazul islam commented on your post
                {/* commented {`"${item?.message[0]?.Comment}"`} on your question{" "} */}
                {/* {` "${item?.message[0]?.question}"`} */}
              </h2>
            </div>
          </div>
        </a>
<div className="flex flex-col justify-center items-center gap-1 w-fit mx-auto">
  <h2 onClick={() => setIsOpen(!isOpen)} className="text-sm cursor-pointer">
    Quick Reply
  </h2>

  <IoIosArrowDown
    className={`transition-transform duration-300 ${
      isOpen ? "rotate-180" : ""
    }`}
  />
</div>

<div
  className={`overflow-hidden transition-all duration-300 ${
    isOpen
      ? "max-h-20 opacity-100 mt-2"
      : "max-h-0 opacity-0"
  }`}
>
  <div className="flex gap-2 items-center">
    <input
      className="w-full p-1 border rounded-md"
      type="text"
    />
    <button>
      <IoIosSend size={15} />
    </button>
  </div>
</div>
      </div>
    </div>
  );
};

export default QuestionCommentCard;
