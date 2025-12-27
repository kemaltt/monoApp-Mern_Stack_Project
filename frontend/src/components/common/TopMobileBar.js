import MobileTopBarIcons from "../../assets/images/MobileTopBarIcons.png";

const TopMobileBar = () => {
  const date = new Date();
  const time = date.toLocaleTimeString().slice(0, 5);

  return (
    <div className="flex justify-between items-baseline mx-5 pt-2 lg:mx-8 lg:pt-4">
      <p className="text-white text-[13px] lg:text-sm m-0">{time}</p>
      <div>
        <img src={MobileTopBarIcons} alt="mobile icons" className="lg:w-20" />
      </div>
    </div>
  );
};

export default TopMobileBar;
