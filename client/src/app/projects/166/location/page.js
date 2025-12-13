import React from "react";
import TopBar from "@/components/layout/TopBar";
import ProjectNavigation from "@/components/navigation/ProjectNavigation";
import LeftNavigation from "@/components/navigation/LeftNavigation";
import CustomImage from "@/components/ui/CustomImage";

import { project166NavLinks } from "@/data/166/project166NavLinks";

const Location = () => {
  const sidebarLinks = project166NavLinks.left;
  const bottomLinks = project166NavLinks.bottom;
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar title={"Tomorrow 166 Location"} />
      <LeftNavigation links={sidebarLinks} />
      <CustomImage src="/assets/images/166/map/166-map.jpg" />
      <ProjectNavigation links={bottomLinks} />
    </div>
  );
};

export default Location;
