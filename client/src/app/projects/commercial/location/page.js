import React from "react";
import TopBar from "@/components/layout/TopBar";
import CustomImage from "@/components/ui/CustomImage";
import ProjectNavigation from "@/components/navigation/ProjectNavigation";
import LeftNavigation from "@/components/navigation/LeftNavigation";

import { commercialNavLinks } from "@/data/commercial/commercialNavLinks";

const Location = () => {
  const sidebarLinks = commercialNavLinks.left;
  const bottomLinks = commercialNavLinks.bottom;

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar title={"Location"} />
      <LeftNavigation links={sidebarLinks} />
      <CustomImage src="/assets/images/commercial/map/commercial-map.jpg" />
      <ProjectNavigation links={bottomLinks} />
    </div>
  );
};

export default Location;
