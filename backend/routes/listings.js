import express from "express";
import { listListings, getListing } from "../controllers/listing.controller.js";

const router = express.Router();

// GET /api/listings
router.get("/", listListings);

// GET /api/listings/:idOrSlug
router.get("/:idOrSlug", getListing);

export default router;
