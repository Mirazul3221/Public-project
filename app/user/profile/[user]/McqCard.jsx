import { baseurl } from "@/app/config";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import QuestionCard from "../../timeline/components/QuestionCard";

const McqCard = ({ id }) => {
  const [allQuestions, setAllQuestions] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [hasMore, setHasMore] = useState(true);

  const fetchMyData = useCallback(async () => {
    if (isLoading || !hasMore) return; // Avoid duplicate requests
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${baseurl}/userquestions/myquestions-public?skip=${page * 10}&&id=${id}`,
      );

      if (data.length === 0) {
        setHasMore(false); // No more comments to fetch
      } else {
        setAllQuestions((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1); // Increment page
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore]);

  useEffect(() => {
    fetchMyData();
  }, []);

  // Infinite Scroll Event Listener//
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 500 &&
        !isLoading
      ) {
        fetchMyData();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup
  }, [fetchMyData, isLoading]);

  const questionsAfterDelete = (question) => {
    const filteredQuestions = allQuestions?.filter(
      (q) => q._id !== question._id,
    );
    setAllQuestions(filteredQuestions);
  };
  return (
    <div>
      {allQuestions?.map((question, i) => {
        return (
          <div key={i}>
            <QuestionCard
              questionsAfterDelete={questionsAfterDelete}
              myQuestion={question}
            />
          </div>
        );
      })}

      {
        allQuestions.length < 1 && <div className="text-center mt-5">Data Not Found!</div>
      }
    </div>
  );
};

export default McqCard;
