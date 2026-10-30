'use client';

import React, { useRef, useState, useEffect } from 'react';
import "@/app/user/components/cssfiles/scrolling_bar.css";
import { LiaAngleLeftSolid, LiaAngleRightSolid } from 'react-icons/lia';

const HorizontalCardScroll = ({ children, callBack = null }) => {
  const scrollRef = useRef(null);

  // Prevent multiple API calls
  const loadingRef = useRef(false);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = async () => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;

    // Update arrow buttons
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);

    // Already loading
    if (loadingRef.current) return;

    // No horizontal scroll yet
    if (scrollWidth <= clientWidth) return;

    const threshold = 100;

    const isNearEnd =
      scrollLeft + clientWidth >= scrollWidth - threshold;

    if (!isNearEnd) return;

    loadingRef.current = true;

    try {
      callBack()
      // ===============================
      // CALL YOUR PAGINATION API HERE
      //
      // Example:
      // await fetchNextStories();
      //
      // ===============================

    } catch (err) {
      console.error(err);
    } finally {
      loadingRef.current = false;
    }
  };

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollAmount = 300;

    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });

    // Update buttons after smooth scroll
    setTimeout(checkScroll, 350);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Initial check
    requestAnimationFrame(checkScroll);

    el.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [children]);

  return (
    <div className="relative md:w-full w-[100vw]">

      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute -translate-x-[50%] hidden md:block top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
        >
          <LiaAngleLeftSolid />
        </button>
      )}

      <div
        ref={scrollRef}
        className="overflow-x-auto gap-2 scroll-smooth hidden_scroll w-full"
      >
        {children}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute hidden md:block translate-x-[50%] right-1 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
        >
          <LiaAngleRightSolid />
        </button>
      )}

    </div>
  );
};

export default HorizontalCardScroll;