// import React from "react";
// import { MoveLeft } from "lucide-react";
// import Link from "next/link";

// const Footer = () => {
//   // 1. Dynamic Year Calculation
//   const currentYear = new Date().getFullYear();

//   return (
//     <div className="flex justify-between items-center py-4 px-6 bg-[rgba(255,255,255,0.3)] backdrop-blur-[10px] shadow-md fixed bottom-0 left-0 right-0 z-30 ">
//       {/* Back to Projects Link Section */}
//       <div className="back-to-projects">
//         {/* NOTE: If this component is used across the entire application,
//           you might want a more generic "Back" or "Home" link.
//         */}
//         <Link
//           href="/"
//           // The ml-10 class might push the entire footer off-center/unbalanced.
//           // Consider moving this padding to the main <div> if you want spacing,
//           // or adjusting the layout if you want elements fixed at the edges.
//           className="text-[#004068] hover:text-[#EAC4A1] transition-colors duration-200 ml-10"
//         >
//           <MoveLeft className="text-lg" />
//         </Link>
//       </div>

//       {/* Copyright Section with Dynamic Year */}
//       <div className="copyright-section text-lg md:text-base text-[#004068] mr-10">
//         &copy; {currentYear} - TOMORROW WORLD GROUP
//       </div>
//     </div>
//   );
// };

// export default Footer;
