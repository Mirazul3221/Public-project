"use client"
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useContext, useEffect, useRef, useState } from "react";
import storeContext from "./createContex";
import CallReceiverRoom from "../user/components/messanger/video-audio-callcenter/CallReceiverRoom";
import loading from '@/public/background-loading.gif'
import Image from "next/image";
import { requestNotificationPermission, showNotification } from "../user/global/UseBrowserNotification";
import { subscribeUser } from "../user/utils/subscribe";
import DisableRightClick from "../components/InspectLocked";
import CallingUI from "../user/components/messanger/video-audio-callcenter/CallingUI";
import { ringtons } from "./common";
import { useSocket } from "../user/global/SocketProvider";
import LikedContainer from "../user/timeline/components/LikedContainer";
import ContentBuilder from "../user/timeline/create-post/components/ContentBuilder";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { suburl } from "../config";
import FeedContainer from "../user/timeline/components/FeedContainer";
import axios from "axios";
export const MYONLINEFRIEND = []
const ProtectRoute = ({ children, questions = [], isFeedLoading }) => {
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false)
  const { store, dispatch } = useContext(storeContext)
  const router = useRouter();
  const { socket } = useSocket()
  // const queryClient = useQueryClient();
  const feedId = searchParams.get('feedid');
  const type = searchParams.get('type');
  const parentcommentid = searchParams.get('parentcommentid');
  const commentid = searchParams.get('commentid');
  const reactiontype = searchParams.get('reactiontype');
  const paramsData = {
    feedId,type,parentcommentid,commentid,reactiontype
  }

// const queries = queryClient.getQueriesData({
//   queryKey: ['questions'],
// });


 const [modalFeed, setModalFeed] = useState(null);
  const getFeedById = async () => {
    const endpoint =
      type === "mcq"
        ? "userquestions"
        : type === "exam"
          ? "user-exam-initiation"
          : "userposts";

    const { data } = await axios.get(
      `${suburl}/${endpoint}/findsingle${type}/${feedId}`
    );

    return data;
  };

  const fetchedRef = useRef(null);

  useEffect(() => {
    const loadFeed = async () => {
      if (!feedId) {
        setModalFeed(null);
        fetchedRef.current = null;
        return;
      }

      // wait until homepage feed loaded
      if (isFeedLoading) return;

      const existingFeed =
        questions.find((f) => f._id === feedId);

      if (existingFeed) {
        setModalFeed(existingFeed);
        return;
      }

      // prevent duplicate calls for same id
      if (fetchedRef.current === feedId) return;

      fetchedRef.current = feedId;

      try {
        const data = await getFeedById();
        setModalFeed(data);
      } catch (error) {
        fetchedRef.current = null;
        console.error(error);
      }
    };

    loadFeed();
  }, [feedId, questions, isFeedLoading]);




  useEffect(() => {
    setIsMounted(true)
    requestNotificationPermission()
    if (Notification.permission === 'granted') {
      subscribeUser(store?.userInfo?.id);
    }
  }, []);

  useEffect(() => {
  if ( store?.call?.isCalling || store?.isOpenFeedMaker) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [store?.isOpenFeedMaker, store?.call?.isCalling]);
  const [data, setData] = useState(null)
  const [randomRingtone, setRandomRingtone] = useState('');

  useEffect(() => {
    socket?.on('signal-call', (data) => {
      setData(data)
      setRandomRingtone(ringtons[Math.floor(Math.random() * ringtons.length)])
    })
    return () => {
      socket?.off("signal-call");
    };
  }, [socket]);

  if (!isMounted) return <div className="flex justify-center fixed top-0 left-0 items-center w-screen h-screen"><Image src={loading} alt="Loading image" /></div>;
  const protectRouter = () => {
    router.push("/login")
  }
  if (store?.userInfo?.id) {
    return <div>
      {
        store?.call?.isCalling && (
          <CallingUI callingData={store.call} dispatch={dispatch} />
        )
      }
      {
        store?.isOpenLikedContainer?.openBox && (
          <LikedContainer feedData={store.isOpenLikedContainer} />
        )
      }
      <DisableRightClick />
      {
        data && <CallReceiverRoom data={data} setData={setData} randomRingtone={randomRingtone} />
      }

         <div className={`${store?.isOpenFeedMaker ? 'md:flex' : 'hidden'} fixed top-0 left-0 z-[9999] justify-center items-center w-[100dvw] h-[100dvh] bg-black/50 backdrop-blur-sm`}>
            <div className="md:max-w-[80vw] md:h-[90vh] rounded-2xl w-full h-full bg-white p-1 relative">
              <button className="absolute top-3 right-2" onClick={()=>dispatch({ type: "CLOSE_FEEDMAKER" })}>Close</button>
             <ContentBuilder/>
            </div>
        </div>
      <div>
        {children}
      </div>
              {
          modalFeed && <div className="fixed top-0 left-0 z-[999] w-[100dvw] h-[100dvh] bg-gray-10 backdrop-blur-sm flex justify-center items-center">
            <div className="p-4 bg-white md:max-1/2">
              <FeedContainer feed={modalFeed} paramsData={paramsData} />
            </div>

          </div>
        }
    </div>
  } else {
    protectRouter()
  }
}

const Suspen = (props) => (
  <Suspense fallback={null}>
    <ProtectRoute {...props} />
  </Suspense>
);

export default Suspen;
//
