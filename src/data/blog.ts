export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    metaDescription?: string;
    date: string;
    author: string;
    category: string;
    categoryColor?: string;
    image: string;
    content: string;
    readTime: string;
    tags: string[];
}

export const blogPosts: BlogPost[] = [
    {
        slug: "optimizing-nextjs-performance-2025",
        title: "The Ultimate Guide to Next.js Performance in 2025",
        excerpt: "Learn how to achieve perfect Core Web Vitals with advanced loading strategies, art direction, and dynamic imports.",
        metaDescription: "Master Next.js performance in 2025. Deep dive into LCP optimization, art direction, and reducing TBT for perfect Core Web Vitals.",
        date: "December 27, 2024",
        author: "WeReact Team",
        category: "Development",
        categoryColor: "#EF4444", // Red like 'Economy' in image
        image: "/images/blog/performance.png",
        readTime: "8 min read",
        tags: ["Next.js", "Performance", "Web Vitals"],
        content: `
            <p>Performance isn't just a metric; it's a feature. In 2025, user expectations are higher than ever, and search engines like Google continue to prioritize speed through Core Web Vitals. For any digital agency or business, a slow website is a lost opportunity.</p>
            
            <h2>Why LCP Matters Most</h2>
            <p>Largest Contentful Paint (LCP) is often the hardest metric to get right. It represents the time it takes for the largest visual element on the screen to become visible. On most landing pages, this is the hero image. Using art direction with the <code>&lt;picture&gt;</code> element and Next.js's <code>getImageProps</code> API can significantly reduce LCP by ensuring the browser preloads only the device-appropriate image source.</p>

            <h2>Dynamic Importing for TBT</h2>
            <p>Total Blocking Time (TBT) measures the total amount of time a page is blocked from responding to user input. By using <code>next/dynamic</code> to defer non-critical components (like footers, complex animations, or below-the-fold sections), we can drastically reduce the initial JavaScript execution time.</p>

            <blockquote>"Speed is the bridge between a visitor and a customer."</blockquote>

            <h2>Accessibility and SEO</h2>
            <p>Don't forget that speed alone won't rank you. Semantic HTML, proper ARIA labels, and high-contrast text are essential for accessibility and search engine crawlability. At WeReact, we integrate these practices into every line of code we write.</p>
        `
    },
    {
        slug: "minimalist-design-trends",
        title: "Premium Minimalism: Less is More in High-End Web Design",
        excerpt: "Discover how we use white space, variable typography, and subtle micro-animations to create high-conversion digital experiences.",
        metaDescription: "Explore how premium minimalism, variable typography (like Nohemi), and white space transform modern high-end web design.",
        date: "December 20, 2024",
        author: "Creative Director",
        category: "Design",
        categoryColor: "#3B82F6", // Blue like 'Style' in image
        image: "/images/blog/design.png",
        readTime: "6 min read",
        tags: ["Design", "UX", "Minimalism"],
        content: `
            <p>Minimalism is the intentional use of space, typography, and color to focus attention on the most important elements. In the luxury digital space, high-end design is defined by what you leave out as much as what you put in.</p>

            <h2>The Power of White Space</h2>
            <p>White space, or negative space, acts as a visual lung for your content. It allows your brand's message to breathe and reduces cognitive load on the user, leading to better focus and higher engagement.</p>

            <h2>Variable Typography</h2>
            <p>With fonts like Nohemi, we can use variable axes (width, weight) to create dynamic, responsive typography that evolves based on user interaction. This interactive layer adds a "premium" feel that static designs simply can't match.</p>

            <h2>Subtle Micro-animations</h2>
            <p>Animations should never be a distraction. Instead, they should guide the user's eye and provide feedback. Smooth parallax effects and subtle hover states create a "living" interface that feels responsive and alive.</p>
        `
    },
    {
        slug: "seo-strategies-for-agencies",
        title: "SEO in the Age of AI: How to Rank Your Agency in 2025",
        excerpt: "Moving beyond keywords: focusing on E-E-A-T and technical excellence to dominate search results.",
        metaDescription: "Learn how to rank your agency in 2025 by focusing on E-E-A-T and technical SEO in the age of generative AI and search optimization.",
        date: "December 15, 2024",
        author: "SEO Specialist",
        category: "SEO",
        categoryColor: "#10B981", // Green like 'Art' in image
        image: "/images/blog/seo.png",
        readTime: "10 min read",
        tags: ["SEO", "Marketing", "AI"],
        content: `
            <p>Search Engine Optimization is evolving. With the rise of AI-powered search, the old playbook of keyword stuffing is long dead. Today, successful SEO is built on two pillars: technical excellence and authentic authority.</p>

            <h2>E-E-A-T: Experience, Expertise, Authoritativeness, and Trustworthiness</h2>
            <p>Google wants to show content from real humans with real experience. Case studies, deep-dive blog posts, and transparent team profiles are the best ways to build this trust with both users and algorithms.</p>

            <h2>Technical SEO Foundation</h2>
            <p>A fast, mobile-friendly website with a clean DOM structure is the entry ticket. Without a solid technical foundation, even the best content will struggle to rank. Ensure your site uses semantic HTML5 elements like <code>&lt;article&gt;</code>, <code>&lt;section&gt;</code>, and <code>&lt;aside&gt;</code> properly.</p>

            <p>Building a blog is the first step. Creating value-driven content consistently is the marathon that wins the SEO race.</p>
        `
    }
];

