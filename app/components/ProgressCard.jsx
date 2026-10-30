import React, { useState } from "react";
import { useEffect } from "react";
import { myScore } from "../api/app";
import { useStore } from "../global/DataProvider";
import HorizontalCardScroll from "../user/components/HorizontalCardScroll";

const ProgressCard = () => {
  const { store,dispatch } = useStore();
  const [data, setData] = useState();
  useEffect(() => {
    const load = async () => {
      setData(await myScore(store.token,dispatch));
    };
    load();
  }, []);
  const result = data && data.reduce(
  (acc, item) => {
    acc.r += item.rightAns || 0;
    acc.w += item.wrongAns || 0;
    return acc;
  },
  { r: 0, w: 0 }
);

  return (
    <div className="bg-white p-2">
     <h2 className="text-center text-[12px] text-amber-500 my-2">এখন পর্যন্ত আপনি মোট {result?.r + result?.w} টি উত্তর দিয়েছেন। যেখানে সঠিক হয়েছে {result?.r} টি এবং ভুল হয়েছে {result?.w} টি</h2>
      <HorizontalCardScroll>
        <div className="flex gap-3 items-center">
          {data &&
            data.map((item, index) => {
              return (
                <div key={index}>
                  {item && (
                    <div className="min-w-max p-2 rounded-lg border">
                      <h2 className="font-semibold text-center text-amber-500">
                        📖{item?.sub}
                      </h2>
                      <div className="flex justify-between gap-5">
                        {item?.rightAns && (
                          <p className="text-green-500">
                            সঠিক উত্তর : {item?.rightAns}
                          </p>
                        )}
                        {item?.wrongAns && (
                          <p className="text-rose-500">
                            ভুল উত্তর : {item?.wrongAns}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </HorizontalCardScroll>
    </div>
  );
};

export default ProgressCard;
