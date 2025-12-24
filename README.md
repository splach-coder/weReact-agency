# Tourism Website Boilerplate

A modern, high-performance, client-side tourism website boilerplates built with **Next.js**, **React**, **TailwindCSS**, and **TypeScript**.

## 📂 Folder Philosophy

This project is structured for clarity and ease of duplication.

### 1. `src/data` (The Single Source of Truth)
- **`siteData.ts`**: All dynamic content resides here. To create a new website for a different client:
  - Update `company` details (Name, contact, social).
  - Populate `tours`, `excursions`, `activities`, and `services`.
  - The rest of the site will automatically update to reflect these changes.

### 2. `src/app/[locale]` (Routes & Pages)
- **`page.tsx`**: The Homepage. Fetches data from `siteData` and displays featured items.
- **`tours/`**:
  - `page.tsx`: Listing page for tours.
  - `[id]/page.tsx`: Dynamic detail page for a single tour.
- **`excursions/` & `activities/`**: Follow the same pattern as `tours/`.
- **`layout.tsx`**: Global layout (Header, Footer, Fonts).

### 3. `src/components` (Reusable UI)
- **`common`**: Shared components like `Header`, `Footer`, `Hero`.
- **`ui`**: Small atomic components (Buttons, Inputs).
- **Page-Specific Components**: Components used only on specific pages (e.g., `TourCard`, `GallerySlider`).

### 4. `messages/` (Internationalization)
- `en.json`: English translations.
- `fr.json`: French translations.
- Add more locales by adding a file and updating `next.config.ts`.

---

## 🚀 How to Start a New Project

1. **Clone & Install**:
   ```bash
   git clone <repo-url> new-project
   cd new-project
   npm install
   ```

2. **Update Data**:
   - Open `src/data/siteData.ts`.
   - Clear the sample data.
   - Add your client's real data (Tours, Images, Descriptions).

3. **Update Images**:
   - Place generic images in `public/images`.
   - Update references in `siteData.ts`.

4. **Customize Colors**:
   - Open `src/app/globals.css` (or `tailwind.config.ts`) to change primary colors (e.g., `--color-primary`).

5. **Run Locally**:
   ```bash
   npm run dev
   ```

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Carousel**: Swiper.js
- **Icons**: Lucide React
- **i18n**: next-intl

## 📝 Key Features

- **Fully Client-Side**: No database required. Fast and cheap to host (Vercel/Netlify).
- **SEO Optimized**: Metadata is dynamically generated from `siteData`.
- **Responsive**: Mobile-first design.
- **Multi-language Support**: Built-in generic structure for multilingual content.

---
*Created for efficient tourism website development.*
