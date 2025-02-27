import React, { useEffect, useState } from "react";

const WelcomeMessage = () => {
  const [visible, setVisible] = useState(false);
  const messages = [
    "Your safety is our priority",
    "Report issues in real-time",
    "We're here to help 24/7",
    "Stay connected, stay safe"
  ];
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    setVisible(true);
    
    const messageInterval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % messages.length);
        setVisible(true);
      }, 500);
    }, 3000);
    
    return () => clearInterval(messageInterval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-purple-800 to-purple-900 p-6 rounded-lg shadow-lg mb-6">
      <h1 className="text-3xl font-bold text-white mb-2">
        Welcome to  Slum Connect
      </h1>
      <p className={`text-lg text-purple-200 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        {messages[currentMessage]}
      </p>
    </div>
  );
};

export default WelcomeMessage;