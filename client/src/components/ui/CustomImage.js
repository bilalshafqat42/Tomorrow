"use client";
import React from "react";
import Image from "next/image";

const CustomImage = ({ src, alt, className }) => {
  return (
    <div
      className={`flex items-center justify-end w-full h-full mr-10 ${
        className || ""
      }`}
      style={{ minHeight: "100vh" }} // ensures vertical centering reference
    >
      <div
        className="relative overflow-hidden rounded-2xl shadow-md mr-10"
        style={{
          width: "80%",
          aspectRatio: "20/9", // updated ratio for a wider image
        }}
      >
        <Image
          src={src}
          alt={alt || "Project Image"}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
};

export default CustomImage;
