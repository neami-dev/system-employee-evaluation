"use client"
import React, { useState, useEffect } from 'react';

const CurrentTime = ({ initialTime }) => {
  const [currentTime, setCurrentTime] = useState(initialTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return   currentTime;
     
  
};

CurrentTime.getInitialProps = async () => {
  return { initialTime: new Date().toLocaleTimeString() };
};

export default CurrentTime;