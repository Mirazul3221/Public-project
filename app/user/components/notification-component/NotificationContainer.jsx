import moment from 'moment';
import React from 'react'
import { IoNotificationsOffOutline } from "react-icons/io5";
import InvitationCard from './InvitationCard';
import { RxCross2 } from "react-icons/rx";
import FriendRequest from './FriendRequest';
import QuestionLikeCard from './QuestionLikeCard';
import QuestionCommentCard from './QuestionCommentCard';
import QuestionNotificationCard from './QuestionNotificationCard';
import Link from 'next/link';
import { FaUserPlus } from 'react-icons/fa';
import CommentCard from './CommentCard';
import CommentReplyCard from './CommentReplyCard';
const NotificationContainer = ({ notificationList, sayThanks, notifContainerRef, handleNotificationToggle, onNavigate }) => {
  return (
    <div ref={notifContainerRef} className="text-sm px-2 absolute top-0 md:top-20 shadow-2xl py-4 right-0 md:right-28 w-full md:w-3/12 bg-white h-screen md:h-[80vh] border rounded-2xl z-50">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl ml-4">Notifications</h2>
        <span onClick={() => handleNotificationToggle()} className='text-gray-700 md:hidden'><RxCross2 size={20} /></span>
      </div>
      <div className="overflow-y-scroll w-full h-[92vh] md:h-[70vh]">
        <div className="w-full ">
          <QuestionCommentCard
          />
        </div>
        {notificationList?.length > 0 ? (
          <div className="md:rounded-md md:px-6 w-full">
            {notificationList?.map((item, i) => {
              // -------------------------------------------------------------------------------------------------
              if (item.type === "friend-request") {
                return (
                  <div key={i} className="mb-4 border-b py-2">
                    <FriendRequest item={item} />
                  </div>
                );
              }
              //---------------------------------------------------------------------------------------------------------------
              if (item.type === "accept-request") {
                return (
                  <div key={i} className="mb-4 border-b py-2">
                    <p>{moment(item.createdAt).fromNow()}</p>
                    <div className="flex gap-2">
                      <div>
                        <div className="w-12 h-12 relative text-gray-700">
                          <div className="bg-white border p-1 rounded-full flex justify-center items-center absolute -right-1 -bottom-1">
                            <FaUserPlus color="#7305fa" size={15} style={{
                              filter: "drop-shadow(0 0 0 white) drop-shadow(0 0 1px white)",
                            }} />
                          </div>
                          <Link
                            href={`/profile/${item?.senderId?._id}`}
                          //  onClick={(e) => e.stopPropagation()}
                          >
                            <img
                              className="rounded-full"
                              src={item?.senderId.profile}
                              alt={item?.senderId.name}
                            />
                          </Link>
                        </div>
                      </div>
                      <div className="">
                        <h2 className="font-semibold md:text-lg">
                          {item?.senderId.name}
                        </h2>
                        <p>
                          <span className="text-violet-700">
                            {item?.senderId.name}
                          </span>{" "}
                          Accept your request
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              if (item.type === "respond-from-invitation") {
                return (
                  <div key={i} className="mb-4 border-b py-2">
                    <p>{moment(item.createdAt).fromNow()}</p>
                    <div className=" gap-2 flex">
                      <div className="w-1/2">
                        <div className="relative w-fit">
                          <img
                            className="w-20 h-20 rounded-full border-2 border-gray-500"
                            src={item.message[0].requesterProfie}
                            alt={item.message[0].requesterName}
                          />
                          <h2 className="bg-[#3e19fa] w-10 h-10 rounded-full absolute text-white text-[10px] p-1 border-2 border-white flex justify-center items-center -bottom-2 -right-3">
                            {item?.message[0]?.requesterStatus}
                          </h2>
                        </div>
                      </div>
                      <div className="">
                        <h2 className="font-semibold md:text-lg ml-2 text-gray-700">
                          {item?.message[0]?.requesterName}
                        </h2>
                        <p className="ml-2 text-gray-600">
                          Thank you{" "}
                          {item?.message[0]?.responderName} for
                          the invitation. I am happy as you
                          remember me and inform of reading
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }


              if (item.type === "reading-notification") {
                return (
                  <div key={i} className="mb-4 border-b py-2">
                    <p>{moment(item.createdAt).fromNow()}</p>
                    <div className=" gap-2 flex">
                      <div className="w-1/2">
                        <div className="relative w-fit">
                          <img
                            className="w-20 h-20 rounded-full border-2 border-gray-500"
                            src={item.message[0].requesterProfie}
                            alt={item.message[0].requesterName}
                          />
                          <h2 className="bg-[#3e19fa] w-10 h-10 rounded-full absolute text-white text-[10px] p-1 border-2 border-white flex justify-center items-center -bottom-2 -right-3">
                            {item?.message[0]?.requesterStatus}
                          </h2>
                        </div>
                      </div>
                      <div className="">
                        <h2 className="font-semibold md:text-lg ml-2 text-gray-700">
                          {item?.message[0]?.requesterName}
                        </h2>
                        <p className="ml-2 text-gray-600">
                          {`${item.message[0].requesterName} has already completed 50+ question from "${item.message[0].topic}"`}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
              //-------------------------------------------------------------------------------------------------------------------------
              if (item.type === 'mcq_like' || item.type === 'exam_like' || item.type === 'post_like'|| 
                item.type === 'mcq_haha' || item.type === 'exam_haha' || item.type === 'post_haha' || 
                item.type === 'mcq_love' || item.type === 'exam_love' || item.type === 'post_love' ||
                item.type === 'mcq_sad' || item.type === 'exam_sad' || item.type === 'post_sad' ||
                item.type === 'mcq_wow' || item.type === 'exam_wow' || item.type === 'post_wow' ||
                item.type === 'mcq_angry' || item.type === 'exam_angry' || item.type === 'post_angry'
              ) {
                return (
                  <div className="w-full" key={i}>
                    {item.type}
                    <QuestionLikeCard onNavigate={onNavigate}
                      item={item}
                    />
                  </div>
                )
              }
              //-------------------------------------------------------------------------------------------------------------------------
              if (item.type === 'mcq_comment' || item.type === 'exam_comment' || item.type === 'post_comment') {
                return (
                  <div className="w-full" key={i}>
                    <CommentCard onNavigate={onNavigate}
                      item={item}
                    />
                  </div>
                )
              }
              //-------------------------------------------------------------------------------------------------------------------------
              if (item.type === 'mcq_reply_comment' || item.type === 'exam_reply_comment' || item.type === 'post_reply_comment') {
                return (
                  <div className="w-full" key={i}>
                    <CommentReplyCard onNavigate={onNavigate}
                      item={item}
                    />
                  </div>
                )
              }
              //-------------------------------------------------------------------------------------------------------------------------
              if (item.type === 'comment-question') {
                return (
                  <div className="w-full " key={i}>
                    <QuestionCommentCard
                      item={item}
                    />
                  </div>
                )
              }
              //-------------------------------------------------------------------------------------------------------------------------
              if (item.type === 'mcq') {
                return (
                  <div className="w-full " key={i}>
                    <QuestionNotificationCard
                      item={item}
                    />
                  </div>
                )
              }
              if (item.type === 'post') {
                return (
                  <div className="w-full " key={i}>
                    <QuestionNotificationCard
                      item={item}
                    />
                  </div>
                )
              }
              //-------------------------------------------------------------------------------------------------------------------------
            })}
          </div>
        ) : (
          <div className="h-full w-full text-gray-300 flex justify-center items-center">
            <div>
              <IoNotificationsOffOutline
                className="w-fit mx-auto"
                size={40}
              />
              <p className="mt-2">Notification Not Found</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationContainer
