import React from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-blue flex items-center justify-center cursor-pointer" 
         onClick={() => navigate("/onboarding")}>
      <h1 className="text-white text-7xl lg:text-9xl font-bold animate-pulse">mono</h1>
    </div>
  );
};

export default SplashScreen;
