'use client'
import { viewurl } from "@/app/config";
import { useStore } from "@/app/global/DataProvider";
import { useEffect } from "react";
import { useState } from "react";
import { FcPlus } from "react-icons/fc";
import { countExamRecord, myInfo, trackRecentActivities } from "../api";
import moment from "moment";
export default function Dashboard() {
  const {store} = useStore();
  const [myData,setMyData] = useState(null);
  const [recentActivities,setRecentActivities] = useState(null);
  const load =async ()=> {
    const data = await myInfo(store.token);
   const countAllRecord = await countExamRecord(store.token);
   const recentActivities = await trackRecentActivities(store.token);
   setRecentActivities(recentActivities);
    setMyData({...data,countAllRecord});
  }
  useEffect(() => {
     load()
  }, [])
  
    const redirectToAdd = ()=>{
        window.location.href = `${viewurl}/exam/create`
    }
    const redirectToQuestion = ()=>{
        window.location.href = `${viewurl}/user/timeline/create-post`
    }
let num = myData?.balance / 1000;
let result = num.toFixed(2);
const percentage =
  (
    (myData?.countAllRecord[0]?.count || 0) /
    ((myData?.countAllRecord[1]?.count || 0) +
     (myData?.countAllRecord[0]?.count || 0) || 1)
  ) * 100;

const finalPercentage = percentage.toFixed(2);
  return (
    <div className="relative min-h-screen bg-slate-100 text-gray-700 overflow-hidden">
      {/* Gradient Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 px-4 py-6 md:px-10">
        {/* Header */}
        {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              Good Evening, <span className="text-purple-400">তরিকুল ইসলাম</span> 👋
            </h1>
            <p className="text-sm text-gray-400">
              Your performance snapshot for today
            </p>
          </div>

          <div className="glass px-4 py-2 rounded-xl text-sm">
            22 January, 2026
          </div>
        </div> */}

        {/* Balance Card */}
        <div className="glass rounded-3xl p-10 md:p-8 mb-10 bg-black/5">
          <p className="text-gray-400 text-sm">Current Balance</p>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-2">
            ৳ {result}
          </h2>

          <div className="flex flex-wrap gap-3 mt-6">
            <ActionPill label="Withdraw" />
            <ActionPill label="Transactions" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <GlassAction func={redirectToAdd} icon='🎯' label="Add Exam" />
          <GlassAction func={redirectToQuestion} icon="❔" label="Add Question" />
          <GlassAction func={()=>{
            window.location.href=`${viewurl}/model-initiation`
          }} icon="📚" label="Published Exams" />
          <GlassAction func={()=>{
            window.location.href=`${viewurl}/model-initiation/draft`
          }} icon="📰" label="Draft Exams" />
          <GlassAction func={()=>{
             window.location.href=`${viewurl}/user/setting`
          }} icon="⚙️" label="Settings" />
        </div>

         {/* Stats */}
         <h2 className="uppercase">{myData?.countAllRecord[0]?._id} - record</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatGlow title="Total Exams" value={`${myData?.countAllRecord[0]?.count}`} />
          <StatGlow title="Total Attempts" value={myData?.countAllRecord[0]?.totalParticipantCount} />
          <StatGlow title="Completion Rate" value={finalPercentage + '%'} />
        </div>

        <div className="recent-activities mt-10">
          <h3 className="uppercase">Recent submission records</h3>
                        {
        recentActivities?.map((item,i)=>{
           return <div className="my-2 p-2 border bg-white rounded-md"  key={i}>
            {
              item.submittedAt&&  <p> {moment(item.submittedAt).format("DD/MM/YYYY (hh.mm a)")}</p>
            }
            <div className="flex justify-between"> 
            {item?.exameeName && <h3 className="w-2/12">Name : {item?.exameeName}</h3>} 
            {item?.obtainedMark && <h3 className="w-2/12">Score : {item?.obtainedMark}</h3>} 
            {item?.modelName && <h3 className="w-4/12">Model Name : {item?.modelName}</h3>} 
           </div>
           </div> 
        })
      }
        </div>
      </div>
    </div>
  );
}

/* ---------- UI Pieces ---------- */

function ActionPill({ label }) {
  return (
    <button className="glass px-5 py-2 rounded-full text-sm hover:scale-105 transition">
      {label}
    </button>
  );
}

function GlassAction({func, icon, label }) {
  return (
    <div onClick={func} className="glass rounded-2xl border bg-black/5 p-4 text-center hover:scale-105 transition cursor-pointer">
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

function StatGlow({ title, value }) {
  return (
    <div className="relative rounded-2xl p-6 bg-gradient-to-br from-black/10 to-black/5 backdrop-blur-xl border border-white/50">
      <p className="text-gray-400 text-xs uppercase">{title}</p>
      <h3 className="text-3xl font-bold mt-2">{value}</h3>
    </div>
  );
}
