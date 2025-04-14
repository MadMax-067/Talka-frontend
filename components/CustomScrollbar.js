"use client";
import React, { useEffect, useRef } from 'react';
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';

const CustomScrollbar = ({ children }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const ps = new PerfectScrollbar(scrollRef.current, {
      suppressScrollX: true,
      wheelPropagation: false,
    });

    return () => {
      ps.destroy();
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-hidden relative"
    >
      {children}
    </div>
  );
};

export default CustomScrollbar;
