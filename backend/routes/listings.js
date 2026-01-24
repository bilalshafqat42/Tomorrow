// backend/routes/listings.js
import { Router } from "express";
import { listListings, getListing } from "../controllers/listing.controller.js";

const router = Router();

// GET /api/listings
router.get("/", listListings);

// GET /api/listings/:idOrSlug
router.get("/:idOrSlug", getListing);

export default router;
