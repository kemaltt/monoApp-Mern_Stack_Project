import { Link, useNavigate } from "react-router-dom";
import Guy from "../assets/images/Guy.png";
import Coin from "../assets/images/Coin.png";
import Donut from "../assets/images/Donut.png";

const Onboarding = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-cover bg-no-repeat bg-[position:0_-30vh] px-[8%] flex flex-col justify-between lg:flex-row lg:items-center lg:justify-center lg:px-16 lg:gap-16" 
         style={{ backgroundImage: "url('../assets/images/lightBlueBackground.png')" }}>
      <div className="relative mt-16 lg:mt-0 lg:flex-1 lg:max-w-xl">
        <img src={Coin} alt="coin" className="absolute w-16 top-0 left-0 animate-[spin_3s_linear_infinite] lg:w-24" />
        <img src={Donut} alt="donut" className="absolute w-16 top-0 right-0 animate-[spin_4s_linear_infinite_reverse] lg:w-24" />
        <img src={Guy} alt="the määän" className="w-full max-w-[300px] mx-auto relative z-10 animate-[guy_3s_infinite_ease-in-out] lg:max-w-[400px]" />
      </div>
      <div className="pb-16 lg:pb-0 lg:flex-1 lg:max-w-xl lg:text-left">
        <h1 className="text-4xl lg:text-6xl font-bold mb-2">Spend Smarter</h1>
        <h1 className="text-4xl lg:text-6xl font-bold mb-8">Save More</h1>
        <button 
          onClick={() => navigate("/login")}
          className="bg-gradient-blue border-none py-4 rounded-[50px] text-white text-lg font-semibold w-full lg:w-auto lg:px-16 lg:text-xl hover:bg-gradient-blue-reverse transition-all duration-300 mb-4"
        >
          Get Started
        </button>
        <p className="text-sm lg:text-base">
          Have No Account?{" "}
          <Link to="/signup" className="no-underline text-darkBlue hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </div>

      <style jsx>{`
        @keyframes guy {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
