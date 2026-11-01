# Project 3999 - Platform Status & Documentation

**Repository:** [https://github.com/doraswamyraju/project_3999](https://github.com/doraswamyraju/project_3999)  
**Branch:** `main`  
**Last Updated:** November 1, 2026

---

## 1. Overview & Objective
Project 3999 is a modular Website Builder engine designed to:
1. Provide an intuitive, block-based website creation studio for business owners.
2. Provide an administration console to manage, code, preview, and publish website component blocks.
3. Serve as an embeddable micro-frontend module inside host applications (specifically **ManaCity.in**), automatically hydrating blocks with business profile details and products/services catalog data.

---

## 2. Infrastructure & Local Setup
- **Backend**: Apache & MySQL via XAMPP (`C:\xampp\htdocs\project_3999`)
  - Base API URL: `http://localhost/project_3999/api/`
  - Database: `project_3999` (MySQL port 3306)
- **Frontend**: React 19 + Tailwind CSS + Lucide Icons
  - Local URL: `http://localhost:3000`
  - Reverse Proxy: Configured in `package.json` pointing to Apache PHP API.

---

## 3. Key Issues Resolved

### A. Missing Registry Blocks (`masterRegistry` Error)
- **Problem**: Header, Hero, and About Us blocks failed to register, triggering `Component for block name ... not found in masterRegistry`.
- **Root Cause**: Database returned categories in lowercase (`headers`, `hero`, `about-us-short`), but registry loaders checked strict capitalized strings (`'Header'`, `'Hero'`).
- **Fix**: Updated `heroRegistry.jsx`, `headerRegistry.jsx`, and `aboutUsRegistry.jsx` with case-insensitive and variant category matching.

### B. Header Blocks Not Appearing in Builder (`visibleBlocks = 0`)
- **Problem**: UI showed *"No Blocks Available for the header section"* despite 10 headers existing in MySQL.
- **Root Cause**: `currentSection` was `'header'` while the database category was `'headers'`.
- **Fix**: Added category normalization and aliasing in `BlockSelector.jsx` (e.g. `'header'` maps to `['header', 'headers']`, `'aboutUs'` to `['aboutus', 'about-us', 'about-us-short']`).

### C. Persistent Full-Screen "VR LOADING" Screen
- **Problem**: A full-screen dark overlay with a bouncing "VR" box and "LOADING..." blocked the screen on load.
- **Root Cause**: `header4.jsx` and `header5.jsx` had a hardcoded `useState(true)` initial loading screen with full-screen `fixed inset-0 z-[100]`.
- **Fix**: Changed initial state to `useState(false)` in both header components.

### D. Navigation Crash (`setCurrentPage is not a function`)
- **Problem**: Clicking a page in the sidebar crashed React with `Uncaught TypeError: setCurrentPage is not a function`.
- **Fix**: Updated `Sidebar.jsx` to consume `handleSetCurrentPage(page)` from `EditorContext.jsx`.

### E. Alert Crash (`showAlert is not a function`)
- **Problem**: Selecting a block card threw `TypeError: showAlert is not a function`.
- **Fix**: Injected a safe default fallback in `EditorContext.jsx` when `showAlert` is not explicitly provided as a prop.

### F. Mobile Preview in Final Modal
- **Problem**: Desktop preview worked in the final summary modal, but mobile view was non-responsive.
- **Fix**: Rewrote `FinalWebsiteModal.jsx` with a dedicated smartphone frame (`w-[375px] h-[720px]`, camera notch, home indicator, and inner scrollable viewport) plus dual `b.name` / `b.id` block resolution.

---

## 4. Features Implemented

### 1. Authentication & Role-Based Routing
- **Live Database Users**:
  - **Admin**: `admin@3999.com` / `admin123` (Role: `admin`)
  - **User**: `user@3999.com` / `user123` (Role: `user`)
- **API**: `api/login.php` validates credentials and returns user role.
- **Frontend**:
  - `Login.jsx`: Branded login card with 1-click demo buttons for Admin and User.
  - `AuthContext.jsx`: Manages login/logout and stores user state in `localStorage`.
  - `App.js`: Role router directing users to `AdminDashboard` or the `WebsiteBuilder`.

### 2. Admin Console (`AdminDashboard.jsx`)
- **Block Catalog**: Real-time view of all blocks in MySQL.
- **Visibility Toggle**: Instant Live/Hidden switch synced with `set_block_visibility.php`.
- **Block Creator**: Form to submit block name, section category, preview image path, and HTML/JSX code with a live preview toggle before publishing.

### 3. User Website Builder (`EditorLayout.jsx`)
- **Sidebar**: Switch between pages (Home, About Us, Services, Contact, Blog) with logout button at the bottom.
- **Block Selector**: Section tabs (Header, Hero, About Us, Services, Body, Testimonials, Footer) with block preview cards.
- **Actions per Block**:
  - **Select**: Shows immediate preview in the mobile frame on the right.
  - **Add to Cart / Page**: Saves the block into the current page structure and automatically advances to the next section.
  - **Customize**: Opens the interactive Focus Customizer split view.
  - **Skip Section**: Skips sections that do not have blocks yet.

### 4. Interactive Focus Customizer (`FocusCustomizer.jsx`)
- **Live Isolated Preview**: Split-screen top viewport showing the block responding to edits in real time.
- **Headings & Copy**: Edit titles, subheadings, vision/story statements, and CTA buttons.
- **Media Uploader**: Upload custom images converted to base64 preview data on the fly.
- **Numerical Counters**: Customize metrics (e.g. Clients: `5,000+`, Rating: `98%`).
- **Cards & Items**: Reorder and customize service cards.
- **Finalize & Proceed**: Applies customized changes and moves to the next page section.

### 5. Final Assembled Website Modal (`FinalWebsiteModal.jsx`)
- Triggered by clicking the green **"Finalize"** button in the Section Navbar.
- Renders all chosen blocks together in sequential order.
- Features a **Desktop / Mobile Device Switcher** and a **Publish Website** action button.

### 6. ManaCity Integration Architecture (`WebsiteBuilder.jsx` & `TenantContext.jsx`)
- **Modular Component**: Exported as `import { WebsiteBuilder } from 'project_3999';` in `src/index.js`.
- **Database Schema**: Added `user_products` and `user_services` tables, plus `tagline`, `whatsapp`, `address`, and `owner_photo` to the `users` table.
- **API**: `api/get_tenant_profile.php` returns business profile + catalog.
- **Auto-Hydration**: Blocks automatically inherit customer company name, logo, WhatsApp CTA, and actual services catalog with zero manual configuration.

---

## 5. File Structure Summary

```
project_3999/
├── .gitignore
├── status.md                                  # Platform documentation
├── api/
│   ├── config/db.php                          # PDO MySQL connection
│   ├── get_blocks.php                         # Returns block catalog
│   ├── get_pages.php                          # Returns available pages
│   ├── get_tenant_profile.php                 # Customer profile & catalog
│   ├── get_user_data.php                      # User branding details
│   ├── login.php                              # Authentication endpoint
│   ├── save_block.php                         # Admin block creation
│   └── set_block_visibility.php               # Live/Hidden block toggle
└── frontend/
    └── src/
        ├── App.js                             # Authentication & role router
        ├── index.js                           # App mount + module export
        ├── components/
        │   ├── BlockRenderer.jsx              # Dynamic registry component renderer
        │   ├── FinalWebsiteModal.jsx          # Final assembled website modal
        │   └── shared/Sidebar.jsx             # Left page navigation & sign out
        ├── contexts/
        │   ├── AuthContext.jsx                # User session & credentials
        │   ├── EditorContext.jsx              # Builder state & auto-hydration
        │   └── TenantContext.jsx              # ManaCity profile & catalog provider
        ├── module/
        │   └── WebsiteBuilder.jsx             # Embeddable component for ManaCity
        ├── pages/
        │   ├── admin/AdminDashboard.jsx       # Admin block manager & code editor
        │   ├── auth/Login.jsx                 # Login screen with 1-click demo logins
        │   └── editor/
        │       ├── BlockSelector.jsx          # Block card catalog & category filter
        │       ├── EditorLayout.jsx           # 3-column builder workspace
        │       ├── FocusCustomizer.jsx        # Live block customization editor
        │       ├── LivePreviewPane.jsx        # Sticky right mobile preview
        │       └── SectionNavbar.jsx          # Section progress tabs & Finalize
        └── registries/                        # Lazy-loaded block index registries
```

---

## 6. Git History & Branches
All changes are tracked, committed, and synchronized with:
- **Remote**: `origin/main` (`https://github.com/doraswamyraju/project_3999.git`)
- **Status**: Clean working tree.
