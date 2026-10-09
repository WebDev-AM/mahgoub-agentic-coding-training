import HomeLanding from "../features/home/HomeLanding";
import HomeUnits from "../features/home/HomeUnits";
import DiscoverSection from "../features/home/DiscoverSection";
import ChooseUsSection from "../features/home/ChooseUsSection";
import FeaturesSection from "../features/home/FeaturesSection";

function Home() {
  return (
    <div className="flex flex-col">
      <HomeLanding />
      <div className="flex w-full flex-col bg-white">
        <HomeUnits />
        <DiscoverSection />
        <ChooseUsSection />
        <FeaturesSection />
      </div>
    </div>
  );
}

export default Home;
