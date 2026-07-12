export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    metaDescription?: string;
    date: string;
    publishedAt: string;
    modifiedAt: string;
    author: string;
    authorRole: string;
    relatedServiceSlug: 'web-design-marrakech' | 'tourism-websites-morocco' | 'seo-landing-pages';
    category: string;
    categoryColor?: string;
    image: string;
    content: string;
    readTime: string;
    tags: string[];
}

export const blogPosts: BlogPost[] = [
    {
        slug: "seo-strategies-for-agencies",
        title: "SEO in the Age of AI: How to Rank Your Agency in 2026",
        excerpt: "Moving beyond keywords: focusing on E-E-A-T and technical excellence to dominate search results.",
        metaDescription: "Learn how to rank your agency in 2026 by focusing on E-E-A-T and technical SEO in the age of generative AI and search optimization.",
        date: "June 14, 2026",
        publishedAt: "2026-06-14",
        modifiedAt: "2026-07-12",
        author: "WeReact Editorial Team",
        authorRole: "Web design and SEO studio",
        relatedServiceSlug: "seo-landing-pages",
        category: "SEO",
        categoryColor: "#10B981", // Green like 'Art' in image
        image: "/images/blog/seo-2026-real.webp",
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
    },
    {
        slug: "website-design-marrakech-business-guide",
        title: "Website Design in Marrakech: How Local Businesses Can Turn Search Traffic Into Clients",
        excerpt: "A practical guide for Marrakech businesses that want a website built for local visibility, trust, speed, and real client inquiries.",
        metaDescription: "Website design in Marrakech guide for local businesses. Learn how SEO, mobile UX, trust signals, speed, and conversion paths turn Google traffic into client inquiries.",
        date: "June 16, 2026",
        publishedAt: "2026-06-16",
        modifiedAt: "2026-07-12",
        author: "WeReact Editorial Team",
        authorRole: "Web design and SEO studio",
        relatedServiceSlug: "web-design-marrakech",
        category: "Local SEO",
        categoryColor: "#3A5A40",
        image: "/images/blog/marrakech-web-design-real.webp",
        readTime: "9 min read",
        tags: ["Marrakech", "Website Design", "Local SEO", "Business Websites"],
        content: `
            <p>For a local business in Marrakech, a website should do more than look professional. It should help people understand what you offer, where you operate, why they can trust you, and how to contact you without friction. Good website design connects search intent, local proof, speed, and conversion into one clear system.</p>

            <h2>Start with the search intent behind the visitor</h2>
            <p>Someone searching for a service in Marrakech is usually comparing options quickly. Your website needs pages that answer direct questions: what you do, who you serve, where you work, how much confidence you can show, and what the next step is. A generic homepage is rarely enough.</p>

            <h2>Make local trust visible</h2>
            <p>Google and customers both need location signals. Include your city, service areas, contact details, opening hours, local references, project examples, and real business information. These details help your website feel grounded in Marrakech rather than anonymous.</p>

            <h2>Speed and mobile UX shape the first impression</h2>
            <p>Many local visitors browse from mobile. If your site loads slowly, hides the contact button, or makes text hard to scan, the visitor leaves before the offer is understood. Fast pages, readable sections, clear tap targets, and compressed images are part of modern local SEO.</p>

            <h2>Conversion paths need to be obvious</h2>
            <p>A business website should guide the visitor toward a useful action: call, WhatsApp, email, quote request, booking, or consultation. Place these actions in the hero, service sections, project proof, and final CTA. Do not make people hunt for the next step.</p>

            <h2>Use content that proves expertise</h2>
            <p>Strong pages explain your process, services, common problems, and results. Blog posts can support this by answering questions your customers already ask. For Marrakech businesses, content around local visibility, service comparisons, and practical buying decisions can attract qualified traffic.</p>

            <blockquote>A local website becomes powerful when it combines clear design, real place signals, useful content, and a direct route to contact.</blockquote>

            <h2>What WeReact builds into a local business website</h2>
            <p>At WeReact, we design business websites with structured sections, fast performance, responsive layouts, metadata, schema foundations, and clear WhatsApp or contact routes. The goal is simple: help visitors trust you faster and take action sooner.</p>
        `
    },
    {
        slug: "tourism-hospitality-seo-morocco",
        title: "SEO for Tourism and Hospitality Websites in Morocco: A Practical Growth Guide",
        excerpt: "How hotels, tour operators, transport companies, and travel brands in Morocco can build websites that improve discovery and direct inquiries.",
        metaDescription: "SEO guide for tourism and hospitality websites in Morocco. Learn how destination pages, mobile speed, trust signals, schema, and conversion UX improve direct inquiries.",
        date: "June 16, 2026",
        publishedAt: "2026-06-16",
        modifiedAt: "2026-07-12",
        author: "WeReact Editorial Team",
        authorRole: "Web design and SEO studio",
        relatedServiceSlug: "tourism-websites-morocco",
        category: "Tourism SEO",
        categoryColor: "#A3B18A",
        image: "/images/blog/morocco-tourism-seo-real.webp",
        readTime: "10 min read",
        tags: ["Morocco", "Tourism SEO", "Hospitality Websites", "Marrakech"],
        content: `
            <p>Tourism and hospitality websites in Morocco compete in a crowded search landscape. Travelers compare destinations, routes, hotels, tours, drivers, reviews, photos, and prices across many tabs. Your website has to be fast, clear, trustworthy, and organized around how people plan trips.</p>

            <h2>Build pages around destination and service intent</h2>
            <p>A hotel near Marrakech, a tour company in the Atlas Mountains, and a private driver service do not need the same page structure. Create pages around real search intent: airport transfers, day trips, desert tours, riad stays, Atlas itineraries, family travel, or private transport in Morocco.</p>

            <h2>Use GEO signals naturally</h2>
            <p>Location matters in tourism search. Mention cities, regions, routes, landmarks, meeting points, and service areas where they help the traveler make a decision. This gives Google better context and gives visitors confidence that your business understands the destination.</p>

            <h2>Show trust before asking for the booking</h2>
            <p>Travelers need proof. Use real photos, clear service details, FAQs, policies, safety information, testimonials, contact options, and visible business details. For hospitality websites, room details and location clarity matter. For tour websites, itinerary structure and what is included matter.</p>

            <h2>Mobile speed is commercial</h2>
            <p>Many travelers browse from phones while already moving through Morocco. Compress images, avoid heavy scripts, make WhatsApp visible, and keep booking or inquiry forms short. A fast mobile experience can be the difference between a direct inquiry and a lost visitor.</p>

            <h2>Structured data helps search engines understand the offer</h2>
            <p>Use clean metadata, sitemap entries, LocalBusiness or ProfessionalService schema, service information, and article content where useful. Schema will not replace good content, but it helps search engines interpret your business, location, and services more clearly.</p>

            <h2>Design conversion paths for direct inquiries</h2>
            <p>Direct bookings and inquiries reduce dependence on third-party platforms. Place inquiry buttons near service descriptions, destination pages, photo sections, and pricing explanations. Make WhatsApp, email, phone, and forms easy to find without making the page feel aggressive.</p>

            <blockquote>Tourism SEO works best when destination knowledge, trust, speed, and conversion design all point in the same direction.</blockquote>

            <h2>How WeReact approaches travel websites</h2>
            <p>WeReact builds tourism and hospitality websites with fast mobile layouts, destination-led content structure, local SEO foundations, clear project visuals, and direct inquiry routes. The goal is to help travelers understand the offer quickly and contact the business with confidence.</p>
        `
    }
];
