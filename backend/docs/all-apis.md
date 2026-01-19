// DEV CHEATSHEET — BACKEND APIs
// Base URL (Render):
// https://tomorrow-main.onrender.com/api
//
// NOTE: This file is only for reference. Do NOT import it anywhere.

// ====================================================================
// 1) AUTH ROUTES
// ====================================================================

// Register a new user (client / sales / admin - depends on body & backend logic)
// Method: POST
// URL:
///api/auth/register

// Login (returns JWT + cookie if configured)
// Method: POST
// URL:
///api/auth/login

// Get current logged-in user (requires Authorization: Bearer <token>)
// Method: GET
// URL:
///api/auth/me

// (Optional, only if you added it)
// Logout / clear cookie
// Method: POST
// URL:
// /api/auth/logout

// ====================================================================
// 2) UPLOAD ROUTES
// ====================================================================

// Upload avatar (multipart/form-data: field "avatar")
// Method: POST
// URL:
///api/upload/avatar
//
// Public URL format after upload:
// https://tomorrow-main.onrender.com/uploads/avatars/<filename>

// ====================================================================
// 3) PROJECT ROUTES
// ====================================================================
//
// These read from the `projects` collection (Tomorrow 166, Commercial Tower, etc.)

// Get all projects (Tomorrow 166 + Tomorrow Commercial Tower, etc.)
// Method: GET
// URL:
///api/projects

// Get single project by slug
// Method: GET
// URLs:
///api/projects/tomorrow-166
///api/projects/tomorrow-commercial

// ====================================================================
// 4) UNIT INVENTORY ROUTES (collection: "units")
// ====================================================================
//
// All unit inventory endpoints use the SAME base route:
// /api/units
//
// Filters are sent as QUERY PARAMS:
// projectSlug => "tomorrow-166" | "tomorrow-commercial"
// status => e.g. "Available", "Sold", "Underwriting to NIP"
// type => e.g. "1-BR-A", "2-BR-B", "Retail", "Office"
// floor => "G", "1", "2", ...
// minPrice => number (AED)
// maxPrice => number (AED)
//
// PATTERN (very important):
// GET /api/units?projectSlug=<slug>&status=<Status>&type=<Type>&floor=<Floor>&minPrice=<min>&maxPrice=<max>
//
// You can omit any filter you don't need.

// --------------------------------------------------------------------
// 4.1) Basic lists by project
// --------------------------------------------------------------------

// All units for Tomorrow 166 (residential)
///api/units?projectSlug=tomorrow-166

// All units for Tomorrow Commercial Tower (offices + retail)
///api/units?projectSlug=tomorrow-commercial

// --------------------------------------------------------------------
// 4.2) Filter by availability (status)
// --------------------------------------------------------------------

// All AVAILABLE units in Tomorrow 166
///api/units?projectSlug=tomorrow-166&status=Available

// All SOLD units in Tomorrow 166
///api/units?projectSlug=tomorrow-166&status=Sold

// All AVAILABLE units in Tomorrow Commercial Tower
///api/units?projectSlug=tomorrow-commercial&status=Available

// All SOLD units in Tomorrow Commercial Tower
///api/units?projectSlug=tomorrow-commercial&status=Sold

// All units "Underwriting to NIP" in Tomorrow 166
///api/units?projectSlug=tomorrow-166&status=Underwriting%20to%20NIP

// All units "Underwriting to NIP" in Tomorrow Commercial Tower
///api/units?projectSlug=tomorrow-commercial&status=Underwriting%20to%20NIP

// --------------------------------------------------------------------
// 4.3) Filter by TYPE (layout / product type)
// --------------------------------------------------------------------

// All 1-BR-A units in Tomorrow 166
///api/units?projectSlug=tomorrow-166&type=1-BR-A

// All 2-BR-B units in Tomorrow 166
///api/units?projectSlug=tomorrow-166&type=2-BR-B

// All 3-BR-A units in Tomorrow 166
///api/units?projectSlug=tomorrow-166&type=3-BR-A

// All RETAIL units in Commercial Tower
///api/units?projectSlug=tomorrow-commercial&type=Retail

// All OFFICE units in Commercial Tower
///api/units?projectSlug=tomorrow-commercial&type=Office

// --------------------------------------------------------------------
// 4.4) Filter by FLOOR
// --------------------------------------------------------------------

// All Tomorrow 166 units on Ground floor (G)
///api/units?projectSlug=tomorrow-166&floor=G

// All Tomorrow 166 units on 1st floor
///api/units?projectSlug=tomorrow-166&floor=1

// All Tomorrow Commercial units on 7th floor
///api/units?projectSlug=tomorrow-commercial&floor=7

// --------------------------------------------------------------------
// 4.5) Filter by PRICE RANGE (slider)
// --------------------------------------------------------------------

// EXAMPLE: Tomorrow 166 units between 2M and 3M AED
///api/units?projectSlug=tomorrow-166&minPrice=2000000&maxPrice=3000000

// EXAMPLE: Commercial Tower units between 2.5M and 4M AED
///api/units?projectSlug=tomorrow-commercial&minPrice=2500000&maxPrice=4000000

// Only minimum (>= 3M)
///api/units?projectSlug=tomorrow-166&minPrice=3000000

// Only maximum (<= 2M)
///api/units?projectSlug=tomorrow-166&maxPrice=2000000

// --------------------------------------------------------------------
// 4.6) Combined filters (project + type + status + price)
// --------------------------------------------------------------------

// AVAILABLE 1-BR-A units in Tomorrow 166 between 2M and 3M AED
///api/units?projectSlug=tomorrow-166&type=1-BR-A&status=Available&minPrice=2000000&maxPrice=3000000

// AVAILABLE 2-BR-C units in Tomorrow 166 on floors 7–10 (frontend can loop floors)
///api/units?projectSlug=tomorrow-166&type=2-BR-C&status=Available&floor=7
///api/units?projectSlug=tomorrow-166&type=2-BR-C&status=Available&floor=8
///api/units?projectSlug=tomorrow-166&type=2-BR-C&status=Available&floor=9
///api/units?projectSlug=tomorrow-166&type=2-BR-C&status=Available&floor=10

// AVAILABLE OFFICE units in Commercial Tower under 2M AED
///api/units?projectSlug=tomorrow-commercial&type=Office&status=Available&maxPrice=2000000

// AVAILABLE RETAIL units in Commercial Tower above 5M AED
///api/units?projectSlug=tomorrow-commercial&type=Retail&status=Available&minPrice=5000000

// ====================================================================
// 5) QUICK SUMMARY (MOST USED ENDPOINTS)
// ====================================================================
//
// Projects:
// GET /api/projects
// GET /api/projects/tomorrow-166
// GET /api/projects/tomorrow-commercial
//
// Units (base):
// GET /api/units?projectSlug=tomorrow-166
// GET /api/units?projectSlug=tomorrow-commercial
//
// Units (availability shortcuts):
// GET /api/units?projectSlug=tomorrow-166&status=Available
// GET /api/units?projectSlug=tomorrow-commercial&status=Available
//
// Units (price slider example):
// GET /api/units?projectSlug=tomorrow-166&minPrice=2000000&maxPrice=3000000
//
// Auth (typical):
// POST /api/auth/register
// POST /api/auth/login
// GET /api/auth/me
//
// Uploads:
// POST /api/upload/avatar
// Public: https://tomorrow-main.onrender.com/uploads/avatars/<file>
