// backend/scripts/seedProjects.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Project from "../models/Project.js";

dotenv.config(); // makes sure MONGO_URI is loaded

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    const projects = [
      {
        title: "Tomorrow 166",
        slug: "tomorrow-166",
        projectType: "Residential",
        locationText: "Dubai Islands – Island A",
        address: "Dubai Islands, Dubai, UAE",
        coordinates: { lat: 25.286, lng: 55.307 }, // optional, rough
        tagline: "Low-rise beachfront residences with oversized balconies.",
        description:
          "Tomorrow 166 introduces a new residential lifestyle to Dubai Islands, combining modern architecture with comfortable interiors and integrated community amenities.",
        typology: "1–3 BR Apartments",
        height: "G+P+7 Low-rise",
        status: "under_construction",
        heroImageUrl: "https://your-cdn.com/projects/tomorrow-166/hero.jpg", // change later

        amenities: [
          "Swimming pool",
          "Kids pool",
          "Sunbed terrace",
          "Multi-functional lounge",
          "Indoor kids’ zone",
          "Park-view gym",
          "Changing rooms",
          "Outdoor seating",
        ],

        distances: [
          { label: "Gold Souk", time: "4 min" },
          { label: "Waterfront Market", time: "4 min" },
          { label: "DXB Airport", time: "12 min" },
          { label: "Burj Khalifa", time: "15 min" },
          { label: "Dubai Creek Harbour", time: "16 min" },
          { label: "Burj Al Arab", time: "25 min" },
        ],

        isFeatured: true,
      },

      {
        title: "Tomorrow Commercial Tower",
        slug: "tomorrow-commercial",
        projectType: "Commercial",
        locationText: "International City, Dubai",
        address: "International City, Dubai, UAE",
        tagline: "Grade A commercial tower with offices and retail spaces.",
        description:
          "Tomorrow Commercial Tower is a modern commercial development offering flexible office floors and retail experiences in a strategic location.",
        typology: "Offices + Retail",
        height: "High-rise",
        status: "upcoming",
        heroImageUrl:
          "https://your-cdn.com/projects/tomorrow-commercial/hero.jpg",

        amenities: [
          "Premium office lobby",
          "High-speed lifts",
          "Retail & F&B podium",
          "Visitor parking",
          "24/7 security",
          "Easy highway access",
        ],

        distances: [
          { label: "Dubai Mall", time: "15 min" },
          { label: "DXB Airport", time: "20 min" },
          { label: "Dubai International Academic City", time: "10 min" },
        ],

        isFeatured: true,
      },
    ];

    for (const p of projects) {
      const updated = await Project.findOneAndUpdate({ slug: p.slug }, p, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      });
      console.log(`Upserted project: ${updated.title}`);
    }

    console.log("Seed done.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
