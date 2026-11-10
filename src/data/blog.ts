import type { ServiceLandingPage } from './services';
import type { AudienceLandingPage } from './audiences';

/** A question and its short, self-contained answer (rendered on the page and as FAQPage JSON-LD). */
export interface BlogFaq {
    question: string;
    answer: string;
}

export interface BlogPostLocaleCopy {
    title: string;
    /** Two or three sentences that answer the article's main question on their own. */
    summary?: string;
    faqs?: BlogFaq[];
    metaTitle?: string;
    excerpt: string;
    metaDescription?: string;
    content: string;
    date?: string;
    readTime?: string;
    category?: string;
    authorRole?: string;
}

export interface BlogPost {
    slug: string;
    title: string;
    /** Short <title> for search results. Falls back to the full title. */
    metaTitle?: string;
    excerpt: string;
    /** Two or three sentences that answer the article's main question on their own (shown first, quotable by search and AI answers). */
    summary?: string;
    faqs?: BlogFaq[];
    metaDescription?: string;
    date: string;
    publishedAt: string;
    modifiedAt: string;
    author: string;
    authorRole: string;
    relatedServiceSlug: ServiceLandingPage['slug'];
    relatedAudienceSlug: ServiceLandingPage['slug'] | AudienceLandingPage['slug'];
    category: string;
    categoryColor?: string;
    image: string;
    content: string;
    readTime: string;
    tags: string[];
    /** French copy. The English fields above are the default and the fallback. */
    fr?: BlogPostLocaleCopy;
}

/** Returns the post with its locale copy applied. English is the fallback when no variant exists. */
export function getLocalizedPost(post: BlogPost, locale: string): BlogPost {
    if (locale !== 'fr' || !post.fr) return post;

    return {
        ...post,
        title: post.fr.title,
        metaTitle: post.fr.metaTitle ?? post.metaTitle,
        excerpt: post.fr.excerpt,
        summary: post.fr.summary ?? post.summary,
        faqs: post.fr.faqs ?? post.faqs,
        metaDescription: post.fr.metaDescription ?? post.metaDescription,
        content: post.fr.content,
        date: post.fr.date ?? post.date,
        readTime: post.fr.readTime ?? post.readTime,
        category: post.fr.category ?? post.category,
        authorRole: post.fr.authorRole ?? post.authorRole,
    };
}

export const blogPosts: BlogPost[] = [
    {
        slug: "combien-coute-site-web-maroc",
        title: "How Much Does a Website Cost in Morocco in 2026?",
        metaTitle: "Website Cost in Morocco in 2026",
        excerpt: "Honest starting prices for a showcase site, an e-commerce store, and a custom quote for riad or hotel booking websites in Morocco, and what actually moves a quote up or down.",
        summary: "At WeReact, a showcase website in Morocco starts from 2,000 MAD and an e-commerce website from 3,500 MAD, front-end and back-end included. Direct-booking websites for riads and hotels are quoted on scope. The number of pages, the languages, booking features, SEO work and the content you provide are what move a quote up or down.",
        faqs: [
            { question: "How much does a showcase website cost in Morocco?", answer: "At WeReact, from 2,000 MAD, scaling with pages, languages and features. Among the 12 agencies ranking in Marrakech that publish a website price, the median was 3,045 MAD in November 2026 ([our study](/en/blog/etude-sites-agences-web-marrakech))." },
            { question: "How much does an e-commerce website cost in Morocco?", answer: "At WeReact, from 3,500 MAD with front-end and back-end included. The number of products, the languages and the payment method set the final quote ([e-commerce websites](/en/creation-site-e-commerce-maroc))." },
            { question: "How long does it take to build a website?", answer: "Plan for 2 to 3 days for a defined-scope showcase website. Booking and e-commerce projects get a scoped timeline with the quote." },
            { question: "What should a website quote include?", answer: "The number of pages, the languages, who writes the content and provides the photos, whether the SEO basics are included, and who owns the domain, hosting and code after delivery." },
        ],
        metaDescription: "How much does a website cost in Morocco in 2026? Honest agency pricing: showcase sites from 2,000 MAD, e-commerce from 3,500 MAD, and custom booking sites.",
        date: "July 14, 2026",
        publishedAt: "2026-07-14",
        modifiedAt: "2026-11-10",
        author: "WeReact Editorial Team",
        authorRole: "Web design and SEO studio",
        relatedServiceSlug: "web-design-marrakech",
        relatedAudienceSlug: "website-design-moroccan-businesses",
        category: "Pricing",
        categoryColor: "#588157",
        image: "/images/blog/agence-web-maroc.webp",
        readTime: "9 min read",
        tags: ["Morocco", "Website Cost", "Pricing", "Web Design"],
        content: `
            <p>Price is usually the first question a business owner asks about a new website, and the one most agencies in Morocco answer last. Quotes for what sounds like the same project can range from a few thousand dirhams to several months of salary, and without context those numbers are impossible to compare. This guide shares the starting prices we actually quote at WeReact, explains what moves a project up from there, and lists the questions worth asking before you accept any offer, including ours. In our <a href="/en/blog/etude-sites-agences-web-marrakech">study of 66 agency websites ranking in Marrakech</a>, only 21 published a price for their own services.</p>

            <h2>Why website prices vary so much</h2>
            <p>Two websites can look almost identical in a portfolio screenshot and still be completely different products. The visible design is only one layer. Underneath sit the decisions that change both the cost and the value of the project: whether the pages are structured so Google can understand your services, whether the site loads quickly on a mid-range phone with an average connection, whether the content is written around what your customers actually search for, and whether tracking is in place so you can see which pages generate calls and WhatsApp messages. A website built as a commercial tool takes more work than a website built as an online brochure, and the price follows the work.</p>

            <h2>Our starting prices in Morocco for 2026</h2><p>These are the same figures we publish on our <a href="/en/web-design-marrakech">web agency in Marrakech</a> page, where you can also request a scoped quote.</p>
            <p>Every project is quoted on its own scope, but publishing starting prices feels more honest than silence. This is the guidance we give businesses that contact us:</p>

            <h3>Showcase website (site vitrine): from 2,000 MAD</h3>
            <p>A focused website for a local business: home, services, about, and contact, built with the local SEO foundations that help you appear when someone searches for your service in your city. Pricing starts from 2,000 MAD for a compact site where you already have your text and photos ready, and it rises from there with more pages, a bilingual structure, custom sections, and content shaped around real search intent rather than filler text.</p>

            <h3>Direct booking website for a riad or hotel: custom quote based on scope</h3>
            <p>Hospitality websites carry more weight. They need room or suite pages, photo-led layouts, the practical details travelers check before committing, a multilingual structure, and a clear route to a direct booking or inquiry so the business depends a little less on commission platforms. Because scope varies so much here (number of rooms and languages, the booking flow you need, how much of the content has to be created from scratch), this type of project gets a custom quote based on scope rather than a fixed number. Our <a href="/en/hotel-website-design">hotel and riad website design</a> page shows what that build includes.</p>

            <h3>E-commerce website: from 3,500 MAD, front-end and back-end included</h3>
            <p>Selling online adds product pages, payment and delivery logic, legal pages, order management, and the product content that makes a visitor comfortable paying a business they have never met. Pricing starts from 3,500 MAD with the front-end and back-end included, then rises with the number of products, payment integrations, and delivery logic you need. E-commerce is where cutting corners costs the most: slow pages, unclear delivery information, and thin product descriptions all show up directly as abandoned carts. See our <a href="/en/creation-site-e-commerce-maroc">e-commerce websites in Morocco</a>.</p>

            <h3>Website redesign: it depends on what exists</h3>
            <p>A redesign can mean keeping your content and rebuilding the structure, or starting again from a cleaner base. A serious redesign quote begins with a look at your current site: what ranks, what loads slowly, which content deserves to stay, not with a flat number announced before anyone has opened your pages.</p>

            <h2>What pushes a quote up or down</h2>
            <p>Inside those starting prices, a handful of factors do most of the work:</p>
            <ul>
                <li><strong>Number of pages.</strong> Each real page (a service, a destination, a city) is content to write, structure, and maintain. More pages cost more and, done well, cover more of the searches that matter to you.</li>
                <li><strong>Languages.</strong> A single-language site is cheaper than a French and English one. Proper translation is content work, not a switch: every extra language multiplies the pages that have to read naturally.</li>
                <li><strong>Booking and forms.</strong> A contact form is simple. Availability requests, booking flows, and quote calculators take design, testing, and a connection to how you actually run your business day to day. For tour and activity operators, our <a href="/en/site-web-agence-de-voyage">websites for travel agencies and activities</a> page compares the booking options.</li>
                <li><strong>SEO foundations.</strong> Metadata, clean structure, schema markup, internal linking, and a sitemap are partly invisible, which is exactly why low-cost offers skip them, and why some of those sites never appear on Google at all. A <a href="/en/blog/fiche-google-business-maroc">Google Business Profile</a> set up at the same time is what gets you into the map results.</li>
                <li><strong>Photos and content.</strong> If you arrive with good photos and clear text, the budget goes down. If everything has to be created, the budget goes up, but so does the quality of what visitors see.</li>
            </ul>

            <h2>What a cheap website actually costs you later</h2>
            <p>A very cheap website is not automatically a bad deal, but the discount usually hides somewhere specific. There is no page structure Google can work with, so the site never appears for useful searches. It is slow on the phones your customers actually use. There is no tracking, so a year later nobody can say whether the site produced a single client. The text is generic template filler that could describe any business in any city. The site exists, but it produces nothing, and eventually you pay a second time to rebuild it properly. The cheapest website is rarely the least expensive one.</p>

            <blockquote>A website is never expensive or cheap in itself. It is expensive or cheap relative to the clients it brings you.</blockquote>

            <h2>Questions to ask any agency, including us</h2>
            <ul>
                <li>What exactly is included: how many pages, which languages, who writes the content, who provides the photos?</li>
                <li>Will the site be fast on mobile, and how will that be checked?</li>
                <li>Are the SEO basics (titles, metadata, structure, sitemap) part of the project or billed separately?</li>
                <li>Who owns the domain, the hosting, and the code once the project is delivered?</li>
                <li>What happens after launch: support, small changes, measurement?</li>
            </ul>
            <p>A serious agency should answer all of this in plain language before asking for a signature. If the answers stay vague, the quote is vague too, no matter how precise the number looks.</p>

            <h2>Get a real number for your project</h2>
            <p>These are starting points; your project deserves an exact figure. Tell us what your business does, what the website needs to achieve, and what material you already have. We will reply with a clear, itemized quote: free, without obligation, and readable by a human. You can <a href="/en/contact">request your free quote</a> through our contact page or start the conversation directly on WhatsApp; we answer within one business day.</p>
        `,
        fr: {
            title: "Combien coûte un site web au Maroc en 2026 ?",
            metaTitle: "Combien coûte un site web au Maroc ?",
            excerpt: "Prix de départ honnêtes pour un site vitrine, une boutique e-commerce, et un devis sur mesure pour un site de réservation riad ou hôtel au Maroc, et ce qui fait vraiment varier un devis.",
            summary: "Chez WeReact, un site vitrine au Maroc démarre à partir de 2 000 MAD et un site e-commerce à partir de 3 500 MAD, front et back inclus. Les sites de réservation directe pour riads et hôtels sont établis sur devis. Le nombre de pages, les langues, la réservation, le travail SEO et le contenu que vous fournissez font monter ou baisser un devis.",
            faqs: [
                { question: "Combien coûte un site vitrine au Maroc ?", answer: "Chez WeReact, à partir de 2 000 MAD, selon les pages, les langues et les fonctionnalités. Parmi les 12 agences classées à Marrakech qui affichent un prix de site, la médiane était de 3 045 MAD en novembre 2026 ([notre étude](/fr/blog/etude-sites-agences-web-marrakech))." },
                { question: "Combien coûte un site e-commerce au Maroc ?", answer: "Chez WeReact, à partir de 3 500 MAD, front et back inclus. Le nombre de produits, les langues et le mode de paiement fixent le devis final ([création de site e-commerce](/fr/creation-site-e-commerce-maroc))." },
                { question: "Combien de temps faut-il pour créer un site ?", answer: "Comptez 2 à 3 jours pour un site vitrine à périmètre défini. Les projets avec réservation ou e-commerce reçoivent un calendrier précis avec le devis." },
                { question: "Que doit contenir un devis de site web ?", answer: "Le nombre de pages, les langues, qui rédige les contenus et fournit les photos, si les bases SEO sont incluses, et qui possède le nom de domaine, l’hébergement et le code après la livraison." },
            ],
            metaDescription: "Combien coûte un site web au Maroc en 2026 ? Tarifs honnêtes : site vitrine à partir de 2 000 DH, e-commerce à partir de 3 500 DH, et devis sur mesure pour riads et hôtels.",
            date: "14 juillet 2026",
            readTime: "9 min de lecture",
            category: "Tarifs",
            authorRole: "Studio de création web et SEO",
            content: `
                <p>Le prix est presque toujours la première question qu'un chef d'entreprise pose au sujet d'un nouveau site web, et celle à laquelle la plupart des agences au Maroc répondent en dernier. Pour un projet qui semble identique, les devis peuvent aller de quelques milliers de dirhams à plusieurs mois de salaire, et sans contexte, ces chiffres sont impossibles à comparer. Dans ce guide, nous partageons les prix de départ que nous pratiquons réellement chez WeReact, nous expliquons ce qui fait monter un devis à partir de là, et nous listons les questions à poser avant d'accepter une offre, y compris la nôtre. Dans notre <a href="/fr/blog/etude-sites-agences-web-marrakech">étude de 66 sites d’agences classés à Marrakech</a>, seuls 21 affichaient un prix pour leurs propres services.</p>

                <h2>Pourquoi les prix varient autant</h2>
                <p>Deux sites web peuvent sembler presque identiques sur une capture d'écran de portfolio et rester des produits complètement différents. Le design visible n'est qu'une couche. En dessous se trouvent les décisions qui changent à la fois le coût et la valeur du projet : la structure des pages permet-elle à Google de comprendre vos services, le site se charge-t-il rapidement sur un téléphone de milieu de gamme avec une connexion moyenne, le contenu est-il rédigé autour de ce que vos clients recherchent vraiment, et le suivi statistique est-il en place pour savoir quelles pages génèrent des appels et des messages WhatsApp. Un site conçu comme un outil commercial demande plus de travail qu'une simple brochure en ligne, et le prix suit le travail.</p>

                <h2>Nos prix de départ au Maroc pour 2026</h2><p>Ce sont les mêmes tarifs que sur notre page <a href="/fr/web-design-marrakech">agence web à Marrakech</a>, où vous pouvez aussi demander un devis cadré.</p>
                <p>Chaque projet est chiffré selon son propre périmètre, mais publier des prix de départ nous semble plus honnête que le silence. Voici les repères que nous donnons aux entreprises qui nous contactent :</p>

                <h3>Site vitrine : à partir de 2 000 DH</h3>
                <p>Un site ciblé pour une entreprise locale : accueil, services, à propos et contact, construit avec les fondations SEO locales qui vous aident à apparaître quand quelqu'un recherche votre service dans votre ville. Le prix démarre à partir de 2 000 DH pour un site compact pour lequel vous disposez déjà des textes et des photos, et il augmente ensuite avec davantage de pages, une structure bilingue, des sections sur mesure et un contenu pensé autour de vraies intentions de recherche plutôt que du texte de remplissage.</p>

                <h3>Site de réservation directe pour riad ou hôtel : sur devis selon le périmètre</h3>
                <p>Les sites d'hôtellerie portent plus de responsabilités. Il leur faut des pages chambres ou suites, des mises en page portées par la photo, les informations pratiques que les voyageurs vérifient avant de s'engager, une structure multilingue et un chemin clair vers la réservation ou la demande directe, afin de dépendre un peu moins des plateformes à commission. Le périmètre variant beaucoup d'un projet à l'autre (nombre de chambres et de langues, parcours de réservation souhaité, part de contenu à créer de zéro), ce type de projet est établi sur devis selon le périmètre plutôt qu'avec un chiffre fixe. Notre page <a href="/fr/hotel-website-design">site web pour hôtel et riad</a> détaille ce que comprend ce type de projet.</p>

                <h3>Site e-commerce : à partir de 3 500 DH, front et back inclus</h3>
                <p>Vendre en ligne ajoute des fiches produits, la logique de paiement et de livraison, les pages légales, la gestion des commandes et le contenu produit qui met un visiteur en confiance pour payer une entreprise qu'il n'a jamais rencontrée. Le prix démarre à partir de 3 500 DH, front et back inclus, puis augmente avec le nombre de produits, les intégrations de paiement et la logique de livraison nécessaires. C'est en e-commerce que les économies de façade coûtent le plus cher : pages lentes, informations de livraison floues et descriptions maigres se traduisent directement en paniers abandonnés. Voir notre page <a href="/fr/creation-site-e-commerce-maroc">création de site e-commerce au Maroc</a>.</p>

                <h3>Refonte de site : selon l'existant</h3>
                <p>Une refonte peut consister à conserver vos contenus en reconstruisant la structure, ou à repartir d'une base plus saine. Un devis de refonte sérieux commence par un examen de votre site actuel : ce qui se positionne, ce qui se charge lentement, ce qui mérite d'être conservé, et non par un chiffre annoncé avant même d'avoir ouvert vos pages.</p>

                <h2>Ce qui fait monter ou baisser un devis</h2>
                <p>Au-delà de ces prix de départ, quelques facteurs font l'essentiel de la différence :</p>
                <ul>
                    <li><strong>Le nombre de pages.</strong> Chaque vraie page (un service, une destination, une ville) représente du contenu à rédiger, à structurer et à maintenir. Plus de pages coûte plus cher et, bien fait, couvre davantage de recherches qui comptent pour vous.</li>
                    <li><strong>Les langues.</strong> Un site dans une seule langue coûte moins cher qu'un site français-anglais. Une vraie traduction est un travail de contenu, pas un bouton : chaque langue supplémentaire multiplie les pages qui doivent se lire naturellement.</li>
                    <li><strong>Réservation et formulaires.</strong> Un formulaire de contact reste simple. Les demandes de disponibilité, les parcours de réservation et les calculateurs de devis demandent de la conception, des tests et une connexion avec votre organisation quotidienne. Pour les excursions et activités, notre page <a href="/fr/site-web-agence-de-voyage">site web pour agence de voyage</a> compare les options de réservation.</li>
                    <li><strong>Les fondations SEO.</strong> Métadonnées, structure propre, balisage schema, maillage interne et sitemap sont en partie invisibles, c'est précisément pour cela que les offres à bas prix les suppriment, et qu'une partie de ces sites n'apparaît jamais sur Google. Une <a href="/fr/blog/fiche-google-business-maroc">fiche Google Business</a> créée en même temps vous fait apparaître sur la carte.</li>
                    <li><strong>Photos et contenus.</strong> Si vous arrivez avec de bonnes photos et des textes clairs, le budget baisse. Si tout doit être créé, le budget monte, mais la qualité de ce que voient vos visiteurs monte aussi.</li>
                </ul>

                <h2>Ce qu'un site pas cher vous coûte réellement plus tard</h2>
                <p>Un site très bon marché n'est pas forcément une mauvaise affaire, mais la remise se cache généralement à un endroit précis. Aucune structure de pages exploitable par Google, donc le site n'apparaît jamais sur les recherches utiles. Une lenteur réelle sur les téléphones que vos clients utilisent vraiment. Aucun suivi statistique, si bien qu'un an plus tard, personne ne peut dire si le site a produit un seul client. Des textes génériques qui pourraient décrire n'importe quelle entreprise dans n'importe quelle ville. Le site existe, mais il ne produit rien, et vous finissez par payer une seconde fois pour le reconstruire correctement. Le site le moins cher est rarement le moins coûteux.</p>

                <blockquote>Un site web n'est jamais cher ou bon marché en soi. Il est cher ou bon marché par rapport aux clients qu'il vous apporte.</blockquote>

                <h2>Les questions à poser à toute agence, y compris à nous</h2>
                <ul>
                    <li>Qu'est-ce qui est précisément inclus : combien de pages, quelles langues, qui rédige les contenus, qui fournit les photos ?</li>
                    <li>Le site sera-t-il rapide sur mobile, et comment cela sera-t-il vérifié ?</li>
                    <li>Les bases SEO (titres, métadonnées, structure, sitemap) font-elles partie du projet ou sont-elles facturées à part ?</li>
                    <li>Qui est propriétaire du nom de domaine, de l'hébergement et du code une fois le projet livré ?</li>
                    <li>Que se passe-t-il après la mise en ligne : support, petites modifications, mesure des résultats ?</li>
                </ul>
                <p>Une agence sérieuse doit pouvoir répondre à tout cela en langage clair avant de demander une signature. Si les réponses restent vagues, le devis l'est aussi, quelle que soit la précision apparente du chiffre.</p>

                <h2>Obtenez un chiffre précis pour votre projet</h2>
                <p>Ces prix donnent un point de départ ; votre projet mérite un chiffre exact. Dites-nous ce que fait votre entreprise, ce que le site doit accomplir et les éléments dont vous disposez déjà. Nous vous répondrons avec un devis clair et détaillé : gratuit, sans engagement et lisible par un humain. Vous pouvez <a href="/fr/contact">demander votre devis gratuit</a> via notre page contact ou démarrer la conversation directement sur WhatsApp ; nous répondons sous un jour ouvré.</p>
            `
        }
    },
    {
        slug: "seo-strategies-for-agencies",
        title: "SEO in the Age of AI: How to Rank Your Agency in 2026",
        metaTitle: "SEO for Agencies in the AI Era (2026)",
        excerpt: "Moving beyond keywords: focusing on E-E-A-T and technical excellence to dominate search results.",
        metaDescription: "Learn how to rank your agency in 2026 by focusing on E-E-A-T and technical SEO in the age of generative AI and search optimization.",
        date: "June 14, 2026",
        publishedAt: "2026-06-14",
        modifiedAt: "2026-11-10",
        author: "WeReact Editorial Team",
        authorRole: "Web design and SEO studio",
        relatedServiceSlug: "seo-landing-pages",
        relatedAudienceSlug: "website-design-moroccan-businesses",
        category: "SEO",
        categoryColor: "#10B981", // Green like 'Art' in image
        image: "/images/blog/seo-2026-real.webp",
        readTime: "10 min read",
        tags: ["SEO", "Marketing", "AI"],
        content: `
            <p>Search Engine Optimization is evolving. With the rise of AI-powered search, the old playbook of keyword stuffing is long dead. Today, successful SEO is built on two pillars: technical excellence and authentic authority. If you would rather have it done for you, see our <a href="/en/agence-seo-marrakech">SEO agency in Marrakech</a>.</p>

            <h2>E-E-A-T: Experience, Expertise, Authoritativeness, and Trustworthiness</h2>
            <p>Google wants to show content from real humans with real experience. Case studies, deep-dive blog posts, and transparent team profiles are the best ways to build this trust with both users and algorithms. For a local business, the first proof is often a complete <a href="/en/blog/fiche-google-business-maroc">Google Business Profile</a> with real reviews.</p>

            <h2>Technical SEO Foundation</h2><p>For campaign traffic specifically, this is the groundwork behind our <a href="/en/seo-landing-pages">SEO-ready landing pages</a>.</p>
            <p>A fast, mobile-friendly website with a clean DOM structure is the entry ticket. Without a solid technical foundation, even the best content will struggle to rank. Ensure your site uses semantic HTML5 elements like <code>&lt;article&gt;</code>, <code>&lt;section&gt;</code>, and <code>&lt;aside&gt;</code> properly.</p>

            <p>Building a blog is the first step. Creating value-driven content consistently is the marathon that wins the SEO race.</p>
        `,
        fr: {
            title: "Le SEO à l'ère de l'IA : comment positionner votre agence en 2026",
            metaTitle: "SEO à l'ère de l'IA pour agences (2026)",
            excerpt: "Au-delà des mots-clés : miser sur l'E-E-A-T et l'excellence technique pour dominer les résultats de recherche.",
            metaDescription: "Découvrez comment positionner votre agence en 2026 en misant sur l'E-E-A-T et le SEO technique, à l'ère de l'IA générative et des nouveaux moteurs de recherche.",
            date: "14 juin 2026",
            readTime: "10 min de lecture",
            category: "Stratégie SEO",
            authorRole: "Studio de création web et SEO",
            content: `
                <p>Le référencement naturel évolue. Avec l'essor de la recherche assistée par l'IA, l'ancienne recette du bourrage de mots-clés est morte et enterrée. Aujourd'hui, un SEO efficace repose sur deux piliers : l'excellence technique et une autorité authentique. Si vous préférez qu’on s’en charge, voir notre <a href="/fr/agence-seo-marrakech">agence SEO à Marrakech</a>.</p>

                <h2>E-E-A-T : expérience, expertise, autorité et fiabilité</h2>
                <p>Google veut mettre en avant des contenus produits par de vraies personnes, avec une vraie expérience. Études de cas, articles de fond et profils d'équipe transparents restent les meilleurs moyens de bâtir cette confiance, auprès des utilisateurs comme des algorithmes. Pour une entreprise locale, la première preuve est souvent une <a href="/fr/blog/fiche-google-business-maroc">fiche Google Business</a> complète avec de vrais avis.</p>

                <h2>Des fondations techniques solides</h2><p>Pour le trafic de campagne, c'est le socle de nos <a href="/fr/seo-landing-pages">landing pages SEO</a>.</p>
                <p>Un site rapide, adapté au mobile et doté d'une structure DOM propre constitue le ticket d'entrée. Sans base technique solide, même le meilleur contenu peinera à se positionner. Veillez à utiliser correctement les balises HTML5 sémantiques comme <code>&lt;article&gt;</code>, <code>&lt;section&gt;</code> et <code>&lt;aside&gt;</code>.</p>

                <p>Créer un blog n'est que la première étape. Publier régulièrement du contenu utile, c'est le marathon qui fait gagner la course du SEO.</p>
            `
        }
    },
    {
        slug: "website-design-marrakech-business-guide",
        title: "Website Design in Marrakech: How Local Businesses Can Turn Search Traffic Into Clients",
        metaTitle: "Marrakech Web Design: Traffic Into Clients",
        excerpt: "A practical guide for Marrakech businesses that want a website built for local visibility, trust, speed, and real client inquiries.",
        summary: "A local business website in Marrakech should answer the searcher fast: what you do, where, for whom and how to reach you. It needs visible location signals, quick mobile pages and an obvious WhatsApp, call or quote button on every page.",
        faqs: [
            { question: "What should a Marrakech business website include?", answer: "A page per service, your city and service area, contact details and hours, real project examples, and a clear call, WhatsApp or quote button on every page." },
            { question: "How much does a business website cost in Marrakech?", answer: "At WeReact, a showcase website starts from 2,000 MAD. Our [pricing guide](/en/blog/combien-coute-site-web-maroc) explains what moves a quote." },
        ],
        metaDescription: "Website design guide for Marrakech businesses: SEO, mobile UX, trust signals, and conversion paths that turn Google traffic into client inquiries.",
        date: "June 16, 2026",
        publishedAt: "2026-06-16",
        modifiedAt: "2026-11-10",
        author: "WeReact Editorial Team",
        authorRole: "Web design and SEO studio",
        relatedServiceSlug: "web-design-marrakech",
        relatedAudienceSlug: "website-design-moroccan-businesses",
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
            <p>Google and customers both need location signals. Include your city, service areas, contact details, opening hours, local references, project examples, and real business information. These details help your website feel grounded in Marrakech rather than anonymous. Your <a href="/en/blog/fiche-google-business-maroc">Google Business Profile</a> carries the same signals on the map.</p>

            <h2>Speed and mobile UX shape the first impression</h2>
            <p>Many local visitors browse from mobile. If your site loads slowly, hides the contact button, or makes text hard to scan, the visitor leaves before the offer is understood. Fast pages, readable sections, clear tap targets, and compressed images are part of modern local SEO.</p>

            <h2>Conversion paths need to be obvious</h2>
            <p>A business website should guide the visitor toward a useful action: call, WhatsApp, email, quote request, booking, or consultation. Place these actions in the hero, service sections, project proof, and final CTA. Do not make people hunt for the next step.</p>

            <h2>Use content that proves expertise</h2>
            <p>Strong pages explain your process, services, common problems, and results. Blog posts can support this by answering questions your customers already ask. For Marrakech businesses, content around local visibility, service comparisons, and practical buying decisions can attract qualified traffic. Our guide to <a href="/en/blog/combien-coute-site-web-maroc">website prices in Morocco</a> is an example of answering the question customers ask first.</p>

            <blockquote>A local website becomes powerful when it combines clear design, real place signals, useful content, and a direct route to contact.</blockquote>

            <h2>What WeReact builds into a local business website</h2><p>You can see how this applies to a specific build on our <a href="/en/web-design-marrakech">website design in Marrakech</a> page, and for hotels or riads on <a href="/en/tourism-websites-morocco">tourism websites in Morocco</a>.</p>
            <p>At WeReact, we design business websites with structured sections, fast performance, responsive layouts, metadata, schema foundations, and clear WhatsApp or contact routes. The goal is simple: help visitors trust you faster and take action sooner.</p>
        `,
        fr: {
            title: "Création de site web à Marrakech : comment transformer le trafic Google en clients",
            metaTitle: "Site web Marrakech : du trafic aux clients",
            excerpt: "Un guide pratique pour les entreprises de Marrakech qui veulent un site pensé pour la visibilité locale, la confiance, la rapidité et de vraies demandes clients.",
            summary: "Le site d’une entreprise locale à Marrakech doit répondre vite à celui qui cherche : ce que vous faites, où, pour qui et comment vous joindre. Il lui faut des signaux de localisation visibles, des pages rapides sur mobile et un bouton WhatsApp, appel ou devis évident sur chaque page.",
            faqs: [
                { question: "Que doit contenir le site d’une entreprise à Marrakech ?", answer: "Une page par service, votre ville et votre zone d’intervention, vos coordonnées et horaires, de vrais exemples de projets, et un bouton appel, WhatsApp ou devis sur chaque page." },
                { question: "Combien coûte un site d’entreprise à Marrakech ?", answer: "Chez WeReact, un site vitrine démarre à partir de 2 000 MAD. Notre [guide des prix](/fr/blog/combien-coute-site-web-maroc) explique ce qui fait varier un devis." },
            ],
            metaDescription: "Création de site web à Marrakech : SEO, UX mobile, confiance et parcours de conversion pour transformer le trafic Google en demandes clients.",
            date: "16 juin 2026",
            readTime: "9 min de lecture",
            category: "SEO local",
            authorRole: "Studio de création web et SEO",
            content: `
                <p>Pour une entreprise locale à Marrakech, un site web doit faire plus que paraître professionnel. Il doit aider les visiteurs à comprendre ce que vous proposez, où vous intervenez, pourquoi ils peuvent vous faire confiance et comment vous contacter sans friction. Un bon site relie l'intention de recherche, la preuve locale, la rapidité et la conversion en un seul système clair.</p>

                <h2>Partez de l'intention de recherche du visiteur</h2>
                <p>Une personne qui cherche un service à Marrakech compare généralement plusieurs options en quelques minutes. Votre site doit proposer des pages qui répondent à des questions directes : ce que vous faites, pour qui, où vous intervenez, quelles preuves de sérieux vous pouvez montrer et quelle est la prochaine étape. Une page d'accueil générique suffit rarement.</p>

                <h2>Rendez la confiance locale visible</h2>
                <p>Google comme vos clients ont besoin de signaux de localisation. Indiquez votre ville, vos zones d'intervention, vos coordonnées, vos horaires, vos références locales, des exemples de projets et de vraies informations sur votre entreprise. Ces détails ancrent votre site à Marrakech au lieu de le laisser anonyme. Votre <a href="/fr/blog/fiche-google-business-maroc">fiche Google Business</a> porte les mêmes signaux sur la carte.</p>

                <h2>La rapidité et l'expérience mobile façonnent la première impression</h2>
                <p>Une grande partie des visiteurs locaux navigue sur mobile. Si votre site se charge lentement, cache le bouton de contact ou rend le texte difficile à parcourir, le visiteur part avant même d'avoir compris l'offre. Des pages rapides, des sections lisibles, des zones de clic évidentes et des images compressées font partie du SEO local moderne.</p>

                <h2>Les parcours de conversion doivent être évidents</h2>
                <p>Un site d'entreprise doit guider le visiteur vers une action utile : appel, WhatsApp, e-mail, demande de devis, réservation ou consultation. Placez ces actions dans le hero, les sections services, les preuves de projets et l'appel à l'action final. Ne forcez personne à chercher la prochaine étape.</p>

                <h2>Misez sur un contenu qui prouve votre expertise</h2>
                <p>Les pages solides expliquent votre méthode, vos services, les problèmes fréquents et vos résultats. Un blog peut renforcer cet ensemble en répondant aux questions que vos clients se posent déjà. Pour les entreprises de Marrakech, des contenus sur la visibilité locale, la comparaison de services et les décisions d'achat concrètes peuvent attirer un trafic qualifié. Notre guide des <a href="/fr/blog/combien-coute-site-web-maroc">prix d’un site web au Maroc</a> est un exemple de réponse à la question que les clients posent en premier.</p>

                <blockquote>Un site local devient puissant lorsqu'il combine un design clair, de vrais signaux de proximité, un contenu utile et un chemin direct vers le contact.</blockquote>

                <h2>Ce que WeReact intègre dans un site d'entreprise locale</h2><p>Vous pouvez voir comment cela s'applique sur notre page <a href="/fr/web-design-marrakech">création de site internet à Marrakech</a>, et pour les riads ou hôtels sur <a href="/fr/tourism-websites-morocco">sites web tourisme au Maroc</a>.</p>
                <p>Chez WeReact, nous concevons des sites d'entreprise avec des sections structurées, des performances rapides, des mises en page responsives, des métadonnées, des fondations schema et des accès clairs vers WhatsApp ou le contact. L'objectif est simple : aider vos visiteurs à vous faire confiance plus vite et à passer à l'action plus tôt.</p>
            `
        }
    },
    {
        slug: "tourism-hospitality-seo-morocco",
        title: "SEO for Tourism and Hospitality Websites in Morocco: A Practical Growth Guide",
        metaTitle: "Tourism & Hospitality SEO in Morocco",
        excerpt: "How hotels, tour operators, transport companies, and travel brands in Morocco can build websites that improve discovery and direct inquiries.",
        summary: "Tourism SEO in Morocco works when each activity, room or destination has its own page answering what travelers check before booking (duration, price, meeting point, what is included), loads fast on mobile, shows trust signals with their source, and puts WhatsApp next to the price. Your Google Business Profile has to match the website.",
        faqs: [
            { question: "How do tour operators in Morocco get found on Google?", answer: "With one page per activity and place, real photos, the practical details and a price or “from” price, plus a Google Business Profile consistent with the site." },
            { question: "Should a tour operator still use GetYourGuide or Viator?", answer: "Yes, for discovery. A direct website serves travelers who already know you, without the platform’s commission on that booking ([platform commissions compared](/en/blog/commission-getyourguide-viator-booking-maroc))." },
            { question: "Does mobile speed matter for tourism websites?", answer: "Yes. Many travelers browse from their phone while already in Morocco: compress images, avoid heavy scripts and keep enquiry forms short." },
        ],
        metaDescription: "SEO guide for tourism and hospitality websites in Morocco: destination pages, mobile speed, trust signals, and conversion UX that improve direct inquiries.",
        date: "June 16, 2026",
        publishedAt: "2026-06-16",
        modifiedAt: "2026-11-10",
        author: "WeReact Editorial Team",
        authorRole: "Web design and SEO studio",
        relatedServiceSlug: "tourism-websites-morocco",
        relatedAudienceSlug: "tourism-websites-morocco",
        category: "Tourism SEO",
        categoryColor: "#A3B18A",
        image: "/images/blog/morocco-tourism-seo-real.webp",
        readTime: "10 min read",
        tags: ["Morocco", "Tourism SEO", "Hospitality Websites", "Marrakech"],
        content: `
            <p>Tourism and hospitality websites in Morocco compete in a crowded search landscape. Travelers compare destinations, routes, hotels, tours, drivers, reviews, photos, and prices across many tabs. Your website has to be fast, clear, trustworthy, and organized around how people plan trips.</p>
            <p>This guide is written from the travel sites we have built and run ourselves in Morocco. If you would rather see the structure we build from, start with our <a href="/en/tourism-websites-morocco">tourism and hospitality websites in Morocco</a> page.</p>

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
            <p>Direct bookings and inquiries reduce dependence on third-party platforms. Place inquiry buttons near service descriptions, destination pages, photo sections, and pricing explanations. Make WhatsApp, email, phone, and forms easy to find without making the page feel aggressive. Our <a href="/en/blog/commission-getyourguide-viator-booking-maroc">comparison of platform commissions</a> shows what that dependence costs.</p>

            <h2>A checklist for tour and activity operators</h2>
            <p>Tours and activities are searched differently from hotels. People type the activity and the place together, then compare three or four operators on their phone. These are the pages and details that decide who gets the message. Our <a href="/en/site-web-agence-de-voyage">websites for travel agencies, tours and activities</a> are built around this list.</p>
            <ul>
                <li><strong>One page per activity and place.</strong> "Quad biking in the Palmeraie" and "Agafay desert dinner" are two searches, so they need two pages. A single "Our tours" page cannot rank for both.</li>
                <li><strong>The facts a traveler checks before paying.</strong> Duration, start time, meeting point or hotel pickup, group size, what is included, what to bring, minimum age, and what happens if the weather turns.</li>
                <li><strong>A price or a clear "from" price.</strong> A page with no price sends people back to the marketplace listing that has one.</li>
                <li><strong>Safety and credentials in plain sight.</strong> Licences, insurance, guide or pilot experience, equipment. For adventure activities this is the main objection, so answer it before the booking button.</li>
                <li><strong>WhatsApp first.</strong> Most enquiries in Morocco arrive there. Put the button beside the price and the itinerary, with a pre-filled message naming the activity.</li>
                <li><strong>Your own reviews, linked to their source.</strong> Quote real reviews and link to the Google or Tripadvisor profile they came from. Do not copy them without the link.</li>
                <li><strong>Seasonal pages published early.</strong> Travelers plan Easter, summer, and year-end trips weeks ahead. A page published the week before is too late to be found.</li>
                <li><strong>A Google Business Profile that matches the site.</strong> Same name, phone, and activity categories. For "near me" and map searches, the profile is what appears, not the website. Our <a href="/en/blog/fiche-google-business-maroc">Google Business Profile guide</a> walks through it.</li>
            </ul>

            <h2>What this looks like on sites we built</h2>
            <p>We describe what was built here, not traffic figures. Results depend on the market and on how long a site has been live, and we would rather show the structure than promise a number.</p>
            <h3>Flying Tandem: selling a high-adrenaline activity on trust</h3>
            <p>For <a href="/en/work/flying-tandem">Flying Tandem</a>, a paragliding operator near Marrakech, the hard part was not describing the flight. It was answering "is this safe?" before the visitor left. The site puts safety content and the flight details ahead of the booking enquiry, and keeps the path from experience page to enquiry short on mobile, because many visitors are already in Morocco when they search.</p>
            <h3>Kasbah Angour: letting people inspect the place</h3>
            <p>For <a href="/en/work/kasbah-angour">Kasbah Angour</a>, a hotel in the Atlas foothills, travelers want to inspect rooms, location, and surroundings before they write. The site is organized around that inspection: room discovery, the place itself, and contact routes that stay close to the content, so a direct enquiry is easier than returning to a booking platform.</p>
            <h3>Trust Drivers Tours and Morocco Atlas Guide: our own test sites</h3>
            <p><a href="/en/work/trust-drivers">Trust Drivers Tours</a> and <a href="/en/work/morocco-atlas-guide">Morocco Atlas Guide</a> are studio-owned projects. We use them to test structure on real search results: service panels per route, guide-style destination pages, and WhatsApp as the main conversion path. What works there goes into client sites.</p>

            <blockquote>Tourism SEO works best when destination knowledge, trust, speed, and conversion design all point in the same direction.</blockquote>

            <h2>How WeReact approaches travel websites</h2><p>Our <a href="/en/tourism-websites-morocco">tourism and hospitality websites in Morocco</a> page sets out the booking-journey structure we build from, and the <a href="/en/hotel-website-design">hotel and riad website design</a> page covers direct booking for accommodation.</p>
            <p>WeReact builds tourism and hospitality websites with fast mobile layouts, destination-led content structure, local SEO foundations, clear project visuals, and direct inquiry routes. The goal is to help travelers understand the offer quickly and contact the business with confidence.</p>
        `,
        fr: {
            title: "SEO pour les sites de tourisme et d'hôtellerie au Maroc : guide pratique de croissance",
            metaTitle: "SEO tourisme et hôtellerie au Maroc",
            excerpt: "Comment les hôtels, agences d'excursions, sociétés de transport et marques de voyage au Maroc peuvent construire des sites qui améliorent leur visibilité et leurs demandes directes.",
            summary: "Le SEO touristique au Maroc fonctionne quand chaque activité, chambre ou destination a sa propre page qui répond à ce que le voyageur vérifie avant de réserver (durée, prix, point de rendez-vous, ce qui est inclus), se charge vite sur mobile, montre des preuves sourcées et place WhatsApp à côté du prix. Votre fiche Google Business doit correspondre au site.",
            faqs: [
                { question: "Comment un prestataire d’excursions au Maroc est-il trouvé sur Google ?", answer: "Avec une page par activité et par lieu, de vraies photos, les informations pratiques et un prix ou un prix « à partir de », plus une fiche Google Business cohérente avec le site." },
                { question: "Faut-il garder GetYourGuide ou Viator ?", answer: "Oui, pour être découvert. Un site direct sert les voyageurs qui vous connaissent déjà, sans la commission de la plateforme sur cette réservation ([comparatif des commissions](/fr/blog/commission-getyourguide-viator-booking-maroc))." },
                { question: "La vitesse mobile compte-t-elle pour un site de tourisme ?", answer: "Oui. Beaucoup de voyageurs naviguent depuis leur téléphone alors qu’ils sont déjà au Maroc : compressez les images, évitez les scripts lourds et gardez les formulaires courts." },
            ],
            metaDescription: "SEO pour sites de tourisme et d'hôtellerie au Maroc : pages destinations, vitesse mobile, confiance et UX de conversion pour plus de demandes directes.",
            date: "16 juin 2026",
            readTime: "10 min de lecture",
            category: "SEO tourisme",
            authorRole: "Studio de création web et SEO",
            content: `
                <p>Au Maroc, les sites de tourisme et d'hôtellerie évoluent dans un paysage de recherche très concurrentiel. Les voyageurs comparent destinations, itinéraires, hôtels, excursions, chauffeurs, avis, photos et prix dans de nombreux onglets. Votre site doit être rapide, clair, digne de confiance et organisé selon la façon dont les gens préparent leur voyage.</p>
                <p>Ce guide s'appuie sur les sites de voyage que nous avons créés et que nous gérons nous-mêmes au Maroc. Pour voir directement la structure sur laquelle nous construisons, consultez notre page <a href="/fr/tourism-websites-morocco">sites web tourisme et hôtellerie au Maroc</a>.</p>

                <h2>Construisez vos pages autour des destinations et des services recherchés</h2>
                <p>Un hôtel près de Marrakech, une agence d'excursions dans l'Atlas et un service de chauffeur privé n'ont pas besoin de la même structure de pages. Créez des pages autour d'intentions de recherche réelles : transferts aéroport, excursions à la journée, circuits dans le désert, séjours en riad, itinéraires dans l'Atlas, voyages en famille ou transport privé au Maroc.</p>

                <h2>Utilisez les signaux géographiques avec naturel</h2>
                <p>La localisation compte dans la recherche touristique. Mentionnez les villes, les régions, les itinéraires, les points de repère, les lieux de rendez-vous et les zones desservies lorsque cela aide le voyageur à se décider. Google obtient ainsi un meilleur contexte, et vos visiteurs sentent que votre entreprise connaît vraiment la destination.</p>

                <h2>Montrez la confiance avant de demander la réservation</h2>
                <p>Les voyageurs ont besoin de preuves. Utilisez de vraies photos, des descriptions de services claires, des FAQ, vos conditions, des informations de sécurité, des témoignages, des moyens de contact et des coordonnées visibles. Pour l'hôtellerie, le détail des chambres et la clarté de l'emplacement comptent. Pour les sites d'excursions, la structure de l'itinéraire et ce qui est inclus font la différence.</p>

                <h2>La vitesse mobile est un enjeu commercial</h2>
                <p>Beaucoup de voyageurs naviguent depuis leur téléphone alors qu'ils se déplacent déjà au Maroc. Compressez les images, évitez les scripts lourds, rendez WhatsApp visible et gardez des formulaires de réservation ou de demande courts. Une expérience mobile rapide peut faire la différence entre une demande directe et un visiteur perdu.</p>

                <h2>Les données structurées aident les moteurs à comprendre l'offre</h2>
                <p>Utilisez des métadonnées propres, un sitemap à jour, un balisage LocalBusiness ou ProfessionalService, des informations de services et des contenus d'articles quand c'est pertinent. Le schema ne remplacera jamais un bon contenu, mais il aide les moteurs de recherche à interpréter plus clairement votre activité, votre localisation et vos services.</p>

                <h2>Concevez des parcours de conversion pour les demandes directes</h2>
                <p>Les réservations et demandes directes réduisent la dépendance aux plateformes tierces. Placez des boutons de demande près des descriptions de services, des pages destinations, des galeries photos et des explications de prix. Rendez WhatsApp, l'e-mail, le téléphone et les formulaires faciles à trouver, sans donner à la page un ton insistant. Notre <a href="/fr/blog/commission-getyourguide-viator-booking-maroc">comparatif des commissions des plateformes</a> montre ce que coûte cette dépendance.</p>

                <h2>La liste de contrôle pour les excursions et activités</h2>
                <p>On ne cherche pas une excursion comme on cherche un hôtel. Le voyageur tape l'activité et le lieu ensemble, puis compare trois ou quatre prestataires sur son téléphone. Voici les pages et les détails qui décident de qui reçoit le message. Nos <a href="/fr/site-web-agence-de-voyage">sites pour agences de voyage, excursions et activités</a> sont construits autour de cette liste.</p>
                <ul>
                    <li><strong>Une page par activité et par lieu.</strong> « Quad dans la Palmeraie » et « dîner dans le désert d'Agafay » sont deux recherches : il faut deux pages. Une seule page « Nos excursions » ne peut pas se positionner sur les deux.</li>
                    <li><strong>Les informations que le voyageur vérifie avant de payer.</strong> Durée, heure de départ, point de rendez-vous ou prise en charge à l'hôtel, taille du groupe, ce qui est inclus, ce qu'il faut apporter, âge minimum, et ce qui se passe si la météo change.</li>
                    <li><strong>Un prix, ou un prix « à partir de » clair.</strong> Une page sans prix renvoie le visiteur vers la fiche de la plateforme qui en affiche un.</li>
                    <li><strong>La sécurité et les agréments bien visibles.</strong> Licences, assurance, expérience des guides ou des pilotes, matériel. Pour les activités d'aventure, c'est la première objection : répondez-y avant le bouton de réservation.</li>
                    <li><strong>WhatsApp d'abord.</strong> Au Maroc, la plupart des demandes arrivent par là. Placez le bouton à côté du prix et de l'itinéraire, avec un message pré-rempli qui nomme l'activité.</li>
                    <li><strong>Vos propres avis, reliés à leur source.</strong> Citez de vrais avis et faites un lien vers la fiche Google ou Tripadvisor d'où ils viennent. Ne les copiez pas sans ce lien.</li>
                    <li><strong>Des pages saisonnières publiées tôt.</strong> Les voyageurs préparent Pâques, l'été et les fêtes de fin d'année plusieurs semaines à l'avance. Une page publiée la semaine précédente arrive trop tard.</li>
                    <li><strong>Une fiche Google Business cohérente avec le site.</strong> Même nom, même téléphone, mêmes catégories d'activité. Pour les recherches « près de moi » et sur la carte, c'est la fiche qui apparaît, pas le site. Notre <a href="/fr/blog/fiche-google-business-maroc">guide de la fiche Google Business</a> détaille la méthode.</li>
                </ul>

                <h2>Ce que cela donne sur des sites que nous avons créés</h2>
                <p>Nous décrivons ici ce qui a été construit, pas des chiffres de trafic. Les résultats dépendent du marché et de l'ancienneté du site, et nous préférons montrer la structure plutôt que promettre un chiffre.</p>
                <h3>Flying Tandem : vendre une activité à sensations grâce à la confiance</h3>
                <p>Pour <a href="/fr/work/flying-tandem">Flying Tandem</a>, un opérateur de parapente près de Marrakech, la difficulté n'était pas de décrire le vol. Il fallait répondre à la question « est-ce sûr ? » avant que le visiteur ne parte. Le site place le contenu sécurité et les détails du vol avant la demande de réservation, et garde un chemin court entre la page de l'expérience et la demande sur mobile, car beaucoup de visiteurs sont déjà au Maroc quand ils cherchent.</p>
                <h3>Kasbah Angour : laisser le voyageur inspecter le lieu</h3>
                <p>Pour <a href="/fr/work/kasbah-angour">Kasbah Angour</a>, un hôtel au pied de l'Atlas, les voyageurs veulent examiner les chambres, l'emplacement et les environs avant d'écrire. Le site est organisé autour de cette inspection : découverte des chambres, présentation du lieu, et moyens de contact proches du contenu, pour qu'une demande directe soit plus simple qu'un retour vers une plateforme de réservation.</p>
                <h3>Trust Drivers Tours et Morocco Atlas Guide : nos propres sites d'essai</h3>
                <p><a href="/fr/work/trust-drivers">Trust Drivers Tours</a> et <a href="/fr/work/morocco-atlas-guide">Morocco Atlas Guide</a> sont des projets du studio. Nous y testons nos structures sur de vrais résultats de recherche : panneaux de services par trajet, pages destinations au format guide, et WhatsApp comme principal chemin de conversion. Ce qui fonctionne là est repris sur les sites de nos clients.</p>

                <blockquote>Le SEO touristique fonctionne le mieux lorsque la connaissance de la destination, la confiance, la vitesse et le design de conversion vont dans la même direction.</blockquote>

                <h2>L'approche WeReact pour les sites de voyage</h2><p>Notre page <a href="/fr/tourism-websites-morocco">sites web tourisme et hôtellerie au Maroc</a> détaille la structure de parcours de réservation sur laquelle nous construisons, et la page <a href="/fr/hotel-website-design">site web pour hôtel et riad</a> couvre la réservation directe pour l'hébergement.</p>
                <p>WeReact conçoit des sites de tourisme et d'hôtellerie avec des mises en page mobiles rapides, une structure de contenu orientée destinations, des fondations SEO locales, des visuels de projets clairs et des accès directs à la demande. L'objectif : aider les voyageurs à comprendre l'offre rapidement et à contacter l'entreprise en toute confiance.</p>
            `
        }
    },
    {
        slug: "fiche-google-business-maroc",
        title: "Google Business Profile in Morocco: Create It, Optimise It, and Show Up on Google Maps",
        metaTitle: "Google Business Profile in Morocco: The Guide",
        excerpt: "How a Moroccan business gets into the map results: creating and verifying the profile, name and categories, photos, reviews without breaking Google’s rules, and the link to your website.",
        summary: "To appear on Google Maps in Morocco, claim and verify your Google Business Profile, use your real business name, choose the primary category that matches what you do, add real photos and correct hours, and ask every satisfied customer for a review with your review link. Google says local results are based mainly on relevance, distance and prominence, and it prohibits offering anything in exchange for reviews.",
        faqs: [
            { question: "Is a Google Business Profile free?", answer: "Yes. Creating and managing a Google Business Profile is free." },
            { question: "Can I add keywords to my business name?", answer: "No. Google’s guidelines ask for your real-world business name; adding keywords breaks them and can get the profile suspended." },
            { question: "Can I offer a discount in exchange for a Google review?", answer: "No. Google says offering incentives, like free or discounted goods or services, in exchange for reviews is strictly prohibited, and those reviews are removed." },
            { question: "Do I need to show a street address?", answer: "No, if you serve customers at their location: you can set a service area and hide the street address." },
        ],
        metaDescription: "Create, verify and optimise your Google Business Profile in Morocco to appear on Google Maps: name, categories, photos, honest reviews, and the mistakes that cost clients.",
        date: "November 10, 2026",
        publishedAt: "2026-11-10",
        modifiedAt: "2026-11-10",
        author: "WeReact Editorial Team",
        authorRole: "Web design and SEO studio",
        relatedServiceSlug: "agence-seo-marrakech",
        relatedAudienceSlug: "website-design-moroccan-businesses",
        category: "Local SEO",
        categoryColor: "#A3B18A",
        image: "/images/blog/fiche-google-business-maroc.webp",
        readTime: "8 min read",
        tags: ["Google Business Profile", "Local SEO", "Google Maps", "Morocco", "Marrakech"],
        content: `
            <p>When someone searches for a business with a city name or “near me”, Google often shows a map with three businesses before the regular results. On November 10, 2026 we checked three searches for our own trade in Marrakech (“agence web marrakech”, “création site web marrakech” and “agence seo marrakech”): all three showed that map block at the top. The businesses in it are there because of their Google Business Profile, not their website alone.</p>
            <p>This guide covers what Google itself says decides those results, then the steps that matter for a business in Morocco. If you would rather have it done for you, our <a href="/en/agence-seo-marrakech">SEO agency in Marrakech</a> sets up and optimises the profile alongside the website.</p>

            <h2>What Google says decides the map results</h2>
            <p>Google’s help centre is direct about it: local results are based mainly on relevance, distance and prominence (<a href="https://support.google.com/business/answer/7091?hl=en" rel="noopener" target="_blank">Google Business Profile Help</a>). Relevance is how well your profile matches the search, which is why complete and accurate information matters. Distance is how far you are from the person searching, which you cannot change. Prominence is how well known you are, and Google says reviews and ratings count towards it, along with what the rest of the web says about you, such as links to your business.</p>
            <p>So the work that pays off is what you control: complete information, the right categories, real reviews, and other sites that mention and link to you.</p>

            <h2>1. Create and verify the profile</h2>
            <p>Create the profile at business.google.com with the account you will keep, not a staff member’s personal address. Google then asks you to verify that you run the business, and Google decides which verification method it offers you, video being one of them (<a href="https://support.google.com/business/answer/7107242?hl=en" rel="noopener" target="_blank">how verification works</a>). An unverified profile can exist, but you cannot manage it properly.</p>
            <p>Before creating one, search Google Maps for your business: a profile may already exist, created by Google or by a customer. Claim it rather than creating a duplicate.</p>

            <h2>2. Name, address and phone: exactly as in real life</h2>
            <p>Google’s guidelines ask for your real-world business name, as it appears on your sign and documents (<a href="https://support.google.com/business/answer/3038177?hl=en" rel="noopener" target="_blank">guidelines for representing your business</a>). Adding keywords such as “best web agency Marrakech” to the name breaks those guidelines and can get the profile suspended.</p>
            <p>Use the same name, address and phone number everywhere: your website, Facebook, Instagram, directories. If you travel to your customers, like a driver or an activity operator who picks guests up at their riad, you can set a service area and hide the street address.</p>

            <h2>3. Categories: what you are, not what you want to rank for</h2>
            <p>The primary category has the strongest effect on which searches you appear for. Pick the one that describes your actual business, such as “Hotel” or “Travel agency”, then add a few secondary categories for real activities you also offer. Categories you do not deliver attract the wrong searches and the wrong calls.</p>

            <h2>4. Photos, hours and description</h2>
            <ul>
                <li><strong>Photos of the real place and the real activity.</strong> The entrance as people will see it when they arrive, the rooms or the team at work, the activity itself. Stock photos tell travelers nothing.</li>
                <li><strong>Correct opening hours,</strong> including holidays. A traveler who finds you closed will say so in a review.</li>
                <li><strong>A description written for the customer:</strong> what you offer, where, and for whom, in the language most of your customers use. No list of keywords.</li>
                <li><strong>A phone number that is answered,</strong> or a WhatsApp number if that is how you work.</li>
            </ul>

            <h2>5. Reviews: ask every customer, never pay for one</h2>
            <p>Reviews are part of prominence: Google says more reviews and positive ratings can help your local ranking. Google also sets one firm rule. “Offering incentives, like free or discounted goods or services, in exchange for customers to post reviews, change reviews, or remove negative reviews” is “strictly prohibited” (<a href="https://support.google.com/business/answer/3474122?hl=en" rel="noopener" target="_blank">tips for getting more reviews</a>). Those reviews are removed from Maps.</p>
            <p>What works is simple and allowed: ask every satisfied customer, with the review link or QR code from your profile, at the moment they are happiest, often right after the stay or the activity. Reply to every review, the bad ones included, calmly and with facts. Your replies are public and future customers read them.</p>

            <h2>6. Connect the profile to the right page of your website</h2>
            <p>The website button on your profile should lead to the page that matches what people searched for. For a riad, that is the page with the rooms and the direct booking path; for a tour operator, the page with the activities and prices. The details on that page, including name, address, phone and hours, must match the profile exactly.</p>
            <p>This is where the profile and the website work together. Our pages on <a href="/en/hotel-website-design">hotel and riad websites</a> and <a href="/en/site-web-agence-de-voyage">websites for travel agencies and activities</a> show how we build that destination page, and our <a href="/en/blog/tourism-hospitality-seo-morocco">tourism SEO guide</a> covers the rest of the search work.</p>

            <h2>Common mistakes we see</h2>
            <ul>
                <li>Keywords added to the business name.</li>
                <li>Two profiles for the same business, often an old one nobody manages.</li>
                <li>A phone number that rings out, or a WhatsApp that answers days later.</li>
                <li>Reviews left unanswered for months.</li>
                <li>A website link to the homepage of a site that does not mention the activity people searched for.</li>
                <li>Discounts or gifts offered in exchange for reviews.</li>
            </ul>

            <h2>The short checklist</h2>
            <ul>
                <li>Profile claimed and verified with an account you control.</li>
                <li>Real name, same address and phone everywhere.</li>
                <li>Primary category that matches what you actually do.</li>
                <li>Real photos, correct hours, a useful description.</li>
                <li>A review link sent to every happy customer, and a reply to every review.</li>
                <li>A website button that leads to the matching page.</li>
            </ul>
            <p>Want it done for you? We set up and optimise the profile as part of our <a href="/en/agence-seo-marrakech">local SEO work</a>, and every website we build starts with it. See our <a href="/en/blog/combien-coute-site-web-maroc">website prices in Morocco</a>.</p>
        `,
        fr: {
            title: "Fiche Google Business au Maroc : la créer, l'optimiser et apparaître sur Google Maps",
            metaTitle: "Fiche Google Business au Maroc : le guide",
            excerpt: "Comment une entreprise marocaine entre dans les résultats sur la carte : créer et valider la fiche, nom et catégories, photos, avis sans enfreindre les règles de Google, et le lien avec votre site.",
            summary: "Pour apparaître sur Google Maps au Maroc, revendiquez et validez votre fiche Google Business, utilisez le nom réel de votre établissement, choisissez la catégorie principale qui correspond à votre activité, ajoutez de vraies photos et des horaires exacts, et demandez un avis à chaque client satisfait avec votre lien d’avis. Google indique que les résultats locaux reposent principalement sur la pertinence, la distance et la popularité, et interdit toute contrepartie en échange d’un avis.",
            faqs: [
                { question: "La fiche Google Business est-elle gratuite ?", answer: "Oui. Créer et gérer une fiche Google Business est gratuit." },
                { question: "Puis-je ajouter des mots-clés au nom de mon établissement ?", answer: "Non. Les consignes de Google demandent le nom réel de l’établissement ; ajouter des mots-clés les enfreint et peut entraîner la suspension de la fiche." },
                { question: "Puis-je offrir une réduction en échange d’un avis Google ?", answer: "Non. Google qualifie de strictement interdit le fait de proposer des avantages, comme des produits ou services sans frais ou à prix réduit, en échange d’avis, et ces avis sont supprimés." },
                { question: "Dois-je afficher une adresse ?", answer: "Non, si vous vous déplacez chez vos clients : vous pouvez définir une zone desservie et masquer l’adresse." },
            ],
            metaDescription: "Créer, valider et optimiser votre fiche Google Business au Maroc pour apparaître sur Google Maps : nom, catégories, photos, avis honnêtes et les erreurs qui coûtent des clients.",
            date: "10 novembre 2026",
            readTime: "8 min de lecture",
            category: "SEO local",
            authorRole: "Studio de création web et SEO",
            content: `
                <p>Quand quelqu'un cherche une entreprise avec le nom d'une ville ou « près de moi », Google affiche souvent une carte avec trois établissements avant les résultats classiques. Le 10 novembre 2026, nous avons vérifié trois recherches sur notre propre métier à Marrakech (« agence web marrakech », « création site web marrakech » et « agence seo marrakech ») : les trois affichaient ce bloc de carte en haut de page. Les entreprises qui y figurent y sont grâce à leur fiche Google Business, pas seulement grâce à leur site.</p>
                <p>Ce guide reprend ce que Google dit lui-même de ces résultats, puis les étapes qui comptent pour une entreprise au Maroc. Si vous préférez qu'on s'en occupe, notre <a href="/fr/agence-seo-marrakech">agence SEO à Marrakech</a> crée et optimise la fiche en parallèle du site.</p>

                <h2>Ce que Google dit du classement sur la carte</h2>
                <p>L'aide de Google est claire : les résultats de recherche à proximité « sont principalement basés sur la pertinence, la distance et la popularité » (<a href="https://support.google.com/business/answer/7091?hl=fr" rel="noopener" target="_blank">Aide Fiche d'établissement Google</a>). La pertinence, c'est la correspondance entre votre fiche et la recherche : d'où l'importance d'informations complètes et exactes. La distance, c'est l'éloignement entre vous et la personne qui cherche : vous n'y pouvez rien. La popularité, c'est votre notoriété, et Google précise qu'elle s'appuie notamment sur le nombre de sites qui renvoient vers votre établissement et le nombre d'avis reçus.</p>
                <p>Le travail rentable porte donc sur ce que vous maîtrisez : des informations complètes, les bonnes catégories, de vrais avis, et d'autres sites qui parlent de vous et font un lien vers vous.</p>

                <h2>1. Créer et valider la fiche</h2>
                <p>Créez la fiche sur business.google.com avec le compte que vous garderez, pas l'adresse personnelle d'un employé. Google vous demande ensuite de prouver que vous gérez l'établissement et choisit la méthode de validation qu'il vous propose, la vidéo en faisant partie (<a href="https://support.google.com/business/answer/7107242?hl=fr" rel="noopener" target="_blank">comment fonctionne la validation</a>). Une fiche non validée peut exister, mais vous ne pouvez pas la gérer correctement.</p>
                <p>Avant de créer quoi que ce soit, cherchez votre entreprise sur Google Maps : une fiche existe peut-être déjà, créée par Google ou par un client. Revendiquez-la plutôt que d'en créer une deuxième.</p>

                <h2>2. Nom, adresse et téléphone : exactement comme dans la réalité</h2>
                <p>Les consignes de Google demandent le nom réel de votre établissement, tel qu'il figure sur votre enseigne et vos documents (<a href="https://support.google.com/business/answer/3038177?hl=fr" rel="noopener" target="_blank">consignes de représentation de votre établissement</a>). Ajouter des mots-clés comme « meilleure agence web Marrakech » au nom enfreint ces consignes et peut entraîner la suspension de la fiche.</p>
                <p>Utilisez le même nom, la même adresse et le même téléphone partout : site web, Facebook, Instagram, annuaires. Si vous vous déplacez chez vos clients, comme un chauffeur ou un prestataire d'activités qui prend les voyageurs à leur riad, vous pouvez définir une zone desservie et masquer l'adresse.</p>

                <h2>3. Les catégories : ce que vous êtes, pas ce sur quoi vous voulez apparaître</h2>
                <p>La catégorie principale a le plus d'effet sur les recherches où vous apparaissez. Choisissez celle qui décrit votre activité réelle, comme « Hôtel » ou « Agence de voyages », puis ajoutez quelques catégories secondaires pour les activités que vous proposez vraiment. Des catégories que vous n'assurez pas attirent les mauvaises recherches et les mauvais appels.</p>

                <h2>4. Photos, horaires et description</h2>
                <ul>
                    <li><strong>Des photos du vrai lieu et de la vraie activité.</strong> L'entrée telle qu'on la voit en arrivant, les chambres ou l'équipe au travail, l'activité elle-même. Une photo de banque d'images n'apprend rien au voyageur.</li>
                    <li><strong>Des horaires exacts,</strong> jours fériés compris. Un voyageur qui trouve porte close le dira dans un avis.</li>
                    <li><strong>Une description écrite pour le client :</strong> ce que vous proposez, où, et pour qui, dans la langue de la plupart de vos clients. Pas une liste de mots-clés.</li>
                    <li><strong>Un téléphone qui répond,</strong> ou un numéro WhatsApp si c'est ainsi que vous travaillez.</li>
                </ul>

                <h2>5. Les avis : demandez à chaque client, ne payez jamais</h2>
                <p>Les avis font partie de la popularité, et Google indique que plus vous obtenez d'avis et de notes positives, plus votre établissement grimpe dans le classement local. Google fixe aussi une règle ferme : proposer des avantages, « comme des produits ou services sans frais ou à prix réduit », en échange de la publication, de la modification ou de la suppression d'un avis est de l'engagement artificiel et « strictement interdit » (<a href="https://support.google.com/business/answer/3474122?hl=fr" rel="noopener" target="_blank">conseils pour obtenir plus d'avis</a>). Ces avis sont supprimés de Maps.</p>
                <p>Ce qui fonctionne est simple et autorisé : demandez à chaque client satisfait, avec le lien ou le QR code d'avis de votre fiche, au moment où il est le plus content, souvent juste après le séjour ou l'activité. Répondez à chaque avis, les mauvais compris, calmement et avec des faits. Vos réponses sont publiques et vos futurs clients les lisent.</p>

                <h2>6. Reliez la fiche à la bonne page de votre site</h2>
                <p>Le bouton « Site Web » de votre fiche doit mener à la page qui correspond à ce que les gens ont cherché. Pour un riad, c'est la page des chambres avec la réservation directe ; pour un prestataire d'excursions, la page des activités et des prix. Les informations de cette page, nom, adresse, téléphone et horaires compris, doivent être identiques à celles de la fiche.</p>
                <p>C'est là que la fiche et le site travaillent ensemble. Nos pages <a href="/fr/hotel-website-design">site web pour hôtel et riad</a> et <a href="/fr/site-web-agence-de-voyage">site web pour agence de voyage et activités</a> montrent comment nous construisons cette page d'arrivée, et notre <a href="/fr/blog/tourism-hospitality-seo-morocco">guide SEO tourisme</a> couvre le reste du travail de référencement.</p>

                <h2>Les erreurs que nous voyons souvent</h2>
                <ul>
                    <li>Des mots-clés ajoutés au nom de l'établissement.</li>
                    <li>Deux fiches pour la même entreprise, souvent une ancienne que plus personne ne gère.</li>
                    <li>Un téléphone qui sonne dans le vide, ou un WhatsApp qui répond des jours plus tard.</li>
                    <li>Des avis sans réponse pendant des mois.</li>
                    <li>Un lien vers l'accueil d'un site qui ne parle pas de l'activité recherchée.</li>
                    <li>Des réductions ou cadeaux offerts en échange d'avis.</li>
                </ul>

                <h2>La liste de contrôle</h2>
                <ul>
                    <li>Fiche revendiquée et validée avec un compte que vous contrôlez.</li>
                    <li>Nom réel, même adresse et même téléphone partout.</li>
                    <li>Catégorie principale qui correspond à ce que vous faites vraiment.</li>
                    <li>Vraies photos, horaires exacts, description utile.</li>
                    <li>Un lien d'avis envoyé à chaque client satisfait, et une réponse à chaque avis.</li>
                    <li>Un bouton « Site Web » qui mène à la page correspondante.</li>
                </ul>
                <p>Vous préférez qu'on s'en occupe ? Nous créons et optimisons la fiche dans le cadre de notre <a href="/fr/agence-seo-marrakech">accompagnement SEO local</a>, et chaque site que nous créons commence par là. Voir nos <a href="/fr/blog/combien-coute-site-web-maroc">prix de création de site web au Maroc</a>.</p>
            `
        }
    },
    {
        slug: "commission-getyourguide-viator-booking-maroc",
        title: "GetYourGuide, Viator, Booking.com and Airbnb Commissions: What Operators and Riads in Morocco Pay (2026)",
        metaTitle: "GetYourGuide, Viator and Booking Commissions in Morocco",
        excerpt: "We read each platform’s own supplier and host pages. Only Airbnb publishes its rates on a live page; GetYourGuide removed its 20–30%. What that means for a tour operator or a riad, with sources.",
        summary: "Only Airbnb publishes its rates on a live page: 15.5% for most hosts with its host-only fee, and typically 20% on experiences. GetYourGuide published 20–30% until 2025 and then removed the figure; Viator, Booking.com and Expedia publish no percentage, so your rate is the one in your contract. The Moroccan press reported 15–17% for classified hotels on Booking.com in 2023.",
        faqs: [
            { question: "What commission does GetYourGuide charge in Morocco?", answer: "GetYourGuide no longer publishes a figure: its supplier page says rates vary by country of operation and are shared after sign-up. Until 2025 the same page stated 20–30% depending on the country of the activity." },
            { question: "What commission does Viator charge?", answer: "Viator publishes no percentage. It charges a one-time US$29 listing fee per product and takes its commission only on completed bookings; its August 2026 supplier agreement also lets it set the retail price shown to travelers." },
            { question: "What commission does Booking.com take from hotels in Morocco?", answer: "Booking.com does not publish a rate: it depends on the country, the property type and the contract. In 2023 the Moroccan press reported 15–17% for classified hotels." },
            { question: "What does Airbnb charge hosts?", answer: "15.5% for most hosts with the host-only fee, which is mandatory for traditional hospitality listings such as hotels; 3% with the older split fee, plus 14.1–16.5% paid by the guest. Experiences typically pay 20%." },
        ],
        metaDescription: "GetYourGuide, Viator, Booking.com, Airbnb and Expedia commissions for tour operators and riads in Morocco in 2026, from the platforms’ own pages, with the direct-booking arithmetic.",
        date: "November 10, 2026",
        publishedAt: "2026-11-10",
        modifiedAt: "2026-11-10",
        author: "WeReact Editorial Team",
        authorRole: "Web design and SEO studio",
        relatedServiceSlug: "site-web-agence-de-voyage",
        relatedAudienceSlug: "tourism-websites-morocco",
        category: "Tourism",
        categoryColor: "#A3B18A",
        image: "/images/projects/flying-tandem.webp",
        readTime: "9 min read",
        tags: ["GetYourGuide", "Viator", "Booking.com", "Airbnb", "Commission", "Tour operators", "Riads", "Morocco"],
        content: `
            <p>Most tour operators, activity providers and riads in Morocco sell part of their capacity through platforms. The question we hear first is simple: how much do they take? On November 10, 2026 we read each platform’s own pages for suppliers and hosts. The short answer: <strong>only Airbnb publishes its rates on a live page.</strong> GetYourGuide published a range until 2025 and has since removed it. Viator, Booking.com and Expedia publish no percentage; you see your rate in your contract or during sign-up.</p>
            <p>Below is what each platform says, with the link, then what it means for your margins and when a <a href="/en/site-web-agence-de-voyage">direct-booking website for your activities</a> or <a href="/en/hotel-website-design">for your riad</a> starts to pay for itself.</p>

            <h2>What the platforms themselves say</h2>
            <table>
                <thead><tr><th>Platform</th><th>What it publishes</th><th>Source</th></tr></thead>
                <tbody>
                    <tr><td>GetYourGuide</td><td>No figure today: “Rates may vary depending on your country of operation”. Until 2025: 20–30% depending on the country of the activity.</td><td><a href="https://getyourguide.supply/" rel="noopener" target="_blank">live page</a>, <a href="https://web.archive.org/web/20250118094756/https://www.getyourguide.supply/join/how-much-does-getyourguide-charge" rel="noopener" target="_blank">January 2025 copy</a></td></tr>
                    <tr><td>Viator / Tripadvisor</td><td>No percentage. A one-time US$29 listing fee per product; commission only on completed bookings.</td><td><a href="https://web.archive.org/web/20260608142229/http://operatorresources.viator.com/" rel="noopener" target="_blank">Viator operator site, June 2026 copy</a></td></tr>
                    <tr><td>Booking.com</td><td>No percentage: it “depends on your country, property type and the accommodation agreement”.</td><td><a href="https://partner.booking.com/en-gb/help/payments-payouts-invoices/invoices/understanding-your-commission" rel="noopener" target="_blank">partner help centre</a></td></tr>
                    <tr><td>Airbnb (homes)</td><td>Host-only fee: 15.5% for most hosts. Split fee: 3% for the host plus 14.1–16.5% for the guest.</td><td><a href="https://www.airbnb.com/help/article/1857" rel="noopener" target="_blank">Airbnb service fees</a></td></tr>
                    <tr><td>Airbnb (experiences)</td><td>“Typically” 20%.</td><td><a href="https://www.airbnb.com/help/article/1857" rel="noopener" target="_blank">same page</a></td></tr>
                    <tr><td>Expedia</td><td>No percentage. An older official page only said “an industry standard commission”.</td><td><a href="https://web.archive.org/web/20240319180719/https://welcome.expediagroup.com/en/how-it-works" rel="noopener" target="_blank">March 2024 copy</a></td></tr>
                </tbody>
            </table>

            <h2>GetYourGuide: 20–30%, until the number disappeared</h2>
            <p>GetYourGuide’s supplier page now says: “Rates may vary depending on your country of operation — the exact amount will be shared after you sign up.” Listing an activity costs nothing; the commission applies only to successful bookings.</p>
            <p>The same page said something more precise in January 2025: “GetYourGuide applies a 20-30% commission fee to suppliers based on the country of activity. For example, if you set the price at €100 per ticket, your net earnings would be €80-70.” That figure is no longer on the live site. In mid-2025 the industry outlet <a href="https://arival.travel/article/getyourguide-commission-increasing-for-some-operators" rel="noopener" target="_blank">Arival</a> reported operators being moved from 20% to 30%, and quoted GetYourGuide describing it as a targeted adjustment affecting a small number of partners. Your own rate is the one in your account.</p>

            <h2>Viator: no percentage, and Viator sets the retail price</h2>
            <p>Viator, which also supplies Tripadvisor’s experiences, describes a pay-for-performance model: “You only pay when we bring you a completed booking”, plus a one-time listing fee of US$29 per product. It does not publish a commission percentage. Booking and channel-software vendors quote figures between 20% and 35%; those are their estimates, not Viator’s.</p>
            <p>The supplier agreement updated for August 2026 adds an important detail: Viator and its partners “have autonomy over the final Retail Price displayed to consumers”, while your payout stays “anchored to the Net Rate” you set. In practice, the price a traveler sees on Viator may differ from the price you would show on your own site.</p>

            <h2>Booking.com: the rate is in your contract</h2>
            <p>Booking.com’s partner help centre says the exact percentage “depends on your country, property type and the accommodation agreement you signed”, and that marketing programmes such as Preferred Partner or Visibility Booster can raise it. It gives no figure for Morocco. In 2023, during a dispute with the national hotel federation, the Moroccan press reported 15–17% for classified hotels, rising for more visibility (<a href="https://fr.hespress.com/326262-le-bras-de-fer-continue-entre-la-fnih-et-booking.html" rel="noopener" target="_blank">Hespress</a>). That is press reporting, not a Booking.com statement.</p>

            <h2>Airbnb: the only platform with published rates</h2>
            <p>Airbnb’s help page states its fees plainly. With the single, host-only fee, “most hosts pay 15.5%”, and the page says this structure is mandatory for most hosts, “including traditional hospitality listings (e.g., hotels, serviced apartments, etc.)” and hosts who use property-management software. With the older split fee, the host pays 3% and the guest 14.1% to 16.5%, but Airbnb says it is moving all home hosts to the single fee. For experiences, Airbnb “typically” charges 20%.</p>

            <h2>What it means for your margins</h2>
            <p>These are illustrations with the published or reported rates. Your real rate is the one in your contract.</p>
            <ul>
                <li><strong>An activity at 500 MAD per person</strong> sold at 20–30% leaves 100 to 150 MAD per booking with the platform. A <a href="/en/blog/combien-coute-site-web-maroc">showcase website from 2,000 MAD</a> costs the same as the commission on 14 to 20 of those bookings.</li>
                <li><strong>A riad night at 1,000 MAD</strong> on Airbnb’s 15.5% host-only fee leaves 155 MAD with the platform. 2,000 MAD is the fee on about 13 nights.</li>
            </ul>
            <p>A website does not replace what the platforms do best: bring travelers who have never heard of you. Its job is the travelers who already know you, such as repeat guests, recommendations, people who find your <a href="/en/blog/fiche-google-business-maroc">Google Business Profile</a> or your Instagram, and who would otherwise book you through a platform and pay its commission.</p>

            <h2>How to win back part of your bookings, within the rules</h2>
            <ul>
                <li><strong>Never move a platform booking off the platform.</strong> A traveler who booked on Airbnb or GetYourGuide belongs to that booking; asking them to pay you outside it breaks the platform’s terms. Direct bookings are for travelers who come to you first.</li>
                <li><strong>Check your contract before offering a lower price direct.</strong> Some agreements limit the prices you can show elsewhere.</li>
                <li><strong>Make the direct path obvious where people already find you:</strong> the website button on your Google profile, your Instagram bio, the card in your rooms or vehicles.</li>
                <li><strong>Put WhatsApp next to the price</strong> and answer fast. Most enquiries in Morocco arrive there.</li>
                <li><strong>Give each activity or room its own page</strong> with the details travelers check before paying. Our <a href="/en/blog/tourism-hospitality-seo-morocco">tourism SEO guide</a> has the checklist.</li>
            </ul>

            <h2>Method</h2>
            <p>Read on November 10, 2026. For each platform we looked for its own supplier or host pages first. When a live page gave no figure, we say so, and quote any earlier official version from the Internet Archive with its date. Viator’s operator site blocked automated reading, so we used archived copies from June and August 2026. Figures from the press or from software vendors are labelled as such. This article is about published rates; it is not legal or contractual advice.</p>
        `,
        fr: {
            title: "Commission GetYourGuide, Viator, Booking et Airbnb : ce que paient les prestataires et les riads au Maroc (2026)",
            metaTitle: "Commission GetYourGuide, Viator, Booking au Maroc",
            excerpt: "Nous avons lu les pages fournisseurs et hôtes de chaque plateforme. Seul Airbnb publie ses taux sur une page en ligne ; GetYourGuide a retiré ses 20 à 30 %. Ce que cela change pour un prestataire d'activités ou un riad, sources à l'appui.",
            summary: "Seul Airbnb publie ses taux sur une page en ligne : 15,5 % pour la plupart des hôtes avec les frais d’hôte uniques, et 20 % en général sur les expériences. GetYourGuide affichait 20 à 30 % jusqu’en 2025 puis a retiré le chiffre ; Viator, Booking.com et Expedia ne publient aucun pourcentage, votre taux est donc celui de votre contrat. La presse marocaine a rapporté 15 à 17 % pour les hôtels classés sur Booking.com en 2023.",
            faqs: [
                { question: "Quelle commission prend GetYourGuide au Maroc ?", answer: "GetYourGuide ne publie plus de chiffre : sa page fournisseurs indique que le taux varie selon le pays d’activité et qu’il est communiqué après l’inscription. Jusqu’en 2025, la même page indiquait 20 à 30 % selon le pays de l’activité." },
                { question: "Quelle commission prend Viator ?", answer: "Viator ne publie aucun pourcentage. Il facture 29 $ de frais d’inscription uniques par produit et ne prend sa commission que sur les réservations réalisées ; son contrat fournisseurs d’août 2026 lui permet aussi de fixer le prix affiché aux voyageurs." },
                { question: "Quelle commission Booking.com prend-il aux hôtels au Maroc ?", answer: "Booking.com ne publie pas de taux : il dépend du pays, du type d’établissement et du contrat. En 2023, la presse marocaine a rapporté 15 à 17 % pour les hôtels classés." },
                { question: "Combien Airbnb facture-t-il aux hôtes ?", answer: "15,5 % pour la plupart des hôtes avec les frais d’hôte uniques, obligatoires pour les établissements hôteliers traditionnels ; 3 % avec l’ancienne structure partagée, plus 14,1 à 16,5 % payés par le voyageur. Les expériences paient en général 20 %." },
            ],
            metaDescription: "Commissions GetYourGuide, Viator, Booking.com, Airbnb et Expedia pour les prestataires d'activités et les riads au Maroc en 2026, d'après les pages des plateformes, avec le calcul de la réservation directe.",
            date: "10 novembre 2026",
            readTime: "9 min de lecture",
            category: "Tourisme",
            authorRole: "Studio de création web et SEO",
            content: `
                <p>La plupart des prestataires d'excursions et d'activités et des riads au Maroc vendent une partie de leurs places via des plateformes. La première question qu'on nous pose est simple : combien prennent-elles ? Le 10 novembre 2026, nous avons lu les pages fournisseurs et hôtes de chaque plateforme. Réponse courte : <strong>seul Airbnb publie ses taux sur une page en ligne.</strong> GetYourGuide affichait une fourchette jusqu'en 2025 et l'a retirée. Viator, Booking.com et Expedia ne publient aucun pourcentage : vous le découvrez dans votre contrat ou à l'inscription.</p>
                <p>Voici ce que dit chaque plateforme, avec le lien, puis ce que cela représente pour vos marges et à partir de quand un <a href="/fr/site-web-agence-de-voyage">site de réservation directe pour vos activités</a> ou <a href="/fr/hotel-website-design">pour votre riad</a> se rembourse.</p>

                <h2>Ce que disent les plateformes elles-mêmes</h2>
                <table>
                    <thead><tr><th>Plateforme</th><th>Ce qu'elle publie</th><th>Source</th></tr></thead>
                    <tbody>
                        <tr><td>GetYourGuide</td><td>Aucun chiffre aujourd'hui : le taux « peut varier selon votre pays d'activité ». Jusqu'en 2025 : 20 à 30 % selon le pays de l'activité.</td><td><a href="https://getyourguide.supply/" rel="noopener" target="_blank">page actuelle</a>, <a href="https://web.archive.org/web/20250118094756/https://www.getyourguide.supply/join/how-much-does-getyourguide-charge" rel="noopener" target="_blank">copie de janvier 2025</a></td></tr>
                        <tr><td>Viator / Tripadvisor</td><td>Aucun pourcentage. Des frais d'inscription uniques de 29 $ par produit ; commission seulement sur les réservations réalisées.</td><td><a href="https://web.archive.org/web/20260608142229/http://operatorresources.viator.com/" rel="noopener" target="_blank">site opérateurs Viator, copie de juin 2026</a></td></tr>
                        <tr><td>Booking.com</td><td>Aucun pourcentage : il « dépend de votre pays, du type d'établissement et du contrat ».</td><td><a href="https://partner.booking.com/en-gb/help/payments-payouts-invoices/invoices/understanding-your-commission" rel="noopener" target="_blank">centre d'aide partenaires</a></td></tr>
                        <tr><td>Airbnb (logements)</td><td>Frais d'hôte uniques : 15,5 % pour la plupart des hôtes. Frais partagés : 3 % pour l'hôte et 14,1 à 16,5 % pour le voyageur.</td><td><a href="https://www.airbnb.com/help/article/1857" rel="noopener" target="_blank">frais de service Airbnb</a></td></tr>
                        <tr><td>Airbnb (expériences)</td><td>20 % « en général ».</td><td><a href="https://www.airbnb.com/help/article/1857" rel="noopener" target="_blank">même page</a></td></tr>
                        <tr><td>Expedia</td><td>Aucun pourcentage. Une ancienne page officielle parlait seulement d'une « commission standard du secteur ».</td><td><a href="https://web.archive.org/web/20240319180719/https://welcome.expediagroup.com/en/how-it-works" rel="noopener" target="_blank">copie de mars 2024</a></td></tr>
                    </tbody>
                </table>

                <h2>GetYourGuide : 20 à 30 %, jusqu'à ce que le chiffre disparaisse</h2>
                <p>La page fournisseurs de GetYourGuide indique aujourd'hui que le taux peut varier selon votre pays d'activité et que le montant exact est communiqué après l'inscription. Publier une activité est gratuit ; la commission ne s'applique qu'aux réservations réalisées.</p>
                <p>En janvier 2025, la même page était plus précise : « GetYourGuide applies a 20-30% commission fee to suppliers based on the country of activity », avec l'exemple d'un billet à 100 € qui rapporte 70 à 80 € au prestataire. Ce chiffre n'est plus sur le site. Mi-2025, le média spécialisé <a href="https://arival.travel/article/getyourguide-commission-increasing-for-some-operators" rel="noopener" target="_blank">Arival</a> a rapporté des passages de 20 % à 30 % pour certains opérateurs, GetYourGuide parlant d'un ajustement ciblé touchant un petit nombre de partenaires. Votre taux est celui de votre compte.</p>

                <h2>Viator : aucun pourcentage, et c'est Viator qui fixe le prix affiché</h2>
                <p>Viator, qui alimente aussi les expériences de Tripadvisor, décrit un modèle à la performance : vous ne payez que lorsqu'une réservation est réalisée, plus 29 $ de frais d'inscription uniques par produit. Aucun pourcentage n'est publié. Des éditeurs de logiciels de réservation avancent 20 à 35 % : ce sont leurs estimations, pas celles de Viator.</p>
                <p>Le contrat fournisseurs mis à jour pour août 2026 ajoute un point important : Viator et ses partenaires ont la main sur le prix final affiché aux voyageurs, tandis que votre paiement reste calé sur le prix net que vous fixez. Concrètement, le prix que voit un voyageur sur Viator peut différer de celui que vous afficheriez sur votre propre site.</p>

                <h2>Booking.com : le taux est dans votre contrat</h2>
                <p>Le centre d'aide partenaires de Booking.com indique que le pourcentage exact dépend du pays, du type d'établissement et du contrat signé, et que des programmes marketing comme Partenaire Préféré ou Visibility Booster peuvent l'augmenter. Aucun chiffre n'est donné pour le Maroc. En 2023, lors d'un conflit avec la fédération nationale de l'industrie hôtelière, la presse marocaine a rapporté 15 à 17 % pour les hôtels classés, davantage pour plus de visibilité (<a href="https://fr.hespress.com/326262-le-bras-de-fer-continue-entre-la-fnih-et-booking.html" rel="noopener" target="_blank">Hespress</a>). Il s'agit d'un chiffre de presse, pas d'une déclaration de Booking.com.</p>

                <h2>Airbnb : la seule plateforme qui publie ses taux</h2>
                <p>La page d'aide d'Airbnb détaille ses frais. Avec les frais d'hôte uniques, la plupart des hôtes paient 15,5 %, et Airbnb précise que cette structure est obligatoire pour la plupart des hôtes, notamment les établissements hôteliers traditionnels (hôtels, appartements avec services…) et les hôtes qui utilisent un logiciel de gestion. Avec l'ancienne structure partagée, l'hôte paie 3 % et le voyageur 14,1 à 16,5 %, mais Airbnb indique faire passer tous les hôtes de logements aux frais uniques. Pour les expériences, Airbnb prélève « en général » 20 %.</p>

                <h2>Ce que cela représente pour vos marges</h2>
                <p>Ce sont des illustrations avec les taux publiés ou rapportés. Votre taux réel est celui de votre contrat.</p>
                <ul>
                    <li><strong>Une activité à 500 MAD par personne</strong> vendue à 20–30 % laisse 100 à 150 MAD par réservation à la plateforme. Un <a href="/fr/blog/combien-coute-site-web-maroc">site vitrine à partir de 2 000 MAD</a> coûte autant que la commission de 14 à 20 de ces réservations.</li>
                    <li><strong>Une nuit en riad à 1 000 MAD</strong> avec les frais d'hôte uniques d'Airbnb à 15,5 % laisse 155 MAD à la plateforme. 2 000 MAD, ce sont les frais d'environ 13 nuits.</li>
                </ul>
                <p>Un site ne remplace pas ce que les plateformes font le mieux : amener des voyageurs qui ne vous connaissent pas encore. Son rôle, ce sont les voyageurs qui vous connaissent déjà, clients qui reviennent, recommandations, personnes qui trouvent votre <a href="/fr/blog/fiche-google-business-maroc">fiche Google Business</a> ou votre Instagram, et qui sinon réserveraient via une plateforme et paieraient sa commission.</p>

                <h2>Récupérer une partie de vos réservations, dans les règles</h2>
                <ul>
                    <li><strong>Ne déplacez jamais une réservation de plateforme en dehors de la plateforme.</strong> Un voyageur qui a réservé sur Airbnb ou GetYourGuide relève de cette réservation ; lui demander de vous payer à côté enfreint les conditions de la plateforme. La réservation directe concerne les voyageurs qui viennent d'abord à vous.</li>
                    <li><strong>Vérifiez votre contrat avant d'afficher un prix plus bas en direct.</strong> Certains contrats encadrent les prix que vous pouvez afficher ailleurs.</li>
                    <li><strong>Rendez le chemin direct évident là où l'on vous trouve déjà :</strong> le bouton « Site Web » de votre fiche Google, votre bio Instagram, la carte dans vos chambres ou vos véhicules.</li>
                    <li><strong>Placez WhatsApp à côté du prix</strong> et répondez vite. C'est par là qu'arrivent la plupart des demandes au Maroc.</li>
                    <li><strong>Donnez à chaque activité ou chambre sa propre page</strong> avec les informations que le voyageur vérifie avant de payer. Notre <a href="/fr/blog/tourism-hospitality-seo-morocco">guide SEO tourisme</a> donne la liste.</li>
                </ul>

                <h2>Méthode</h2>
                <p>Lecture le 10 novembre 2026. Pour chaque plateforme, nous avons d'abord cherché ses propres pages fournisseurs ou hôtes. Quand une page en ligne ne donne aucun chiffre, nous le disons, et citons la version officielle antérieure conservée par l'Internet Archive, avec sa date. Le site opérateurs de Viator bloquait la lecture automatisée : nous avons utilisé ses copies archivées de juin et août 2026. Les chiffres issus de la presse ou d'éditeurs de logiciels sont signalés comme tels. Cet article porte sur les taux publiés ; il ne remplace pas un conseil juridique ou contractuel.</p>
            `
        }
    },
    {
        slug: "etude-sites-agences-web-marrakech",
        title: "Web Agencies in Marrakech: What 66 Ranking Websites Show Buyers (2026 Study)",
        metaTitle: "Web Agencies in Marrakech: A Study of 66 Sites",
        excerpt: "We checked every agency and freelancer site in Google’s top 20 for three Marrakech searches. Two in three publish no price, few give a delivery time, and half of the reviews shown cannot be traced.",
        summary: "In November 2026 we checked the 66 agency and freelancer websites ranking in Google’s top 20 for three Marrakech searches. Only 21 published a price for their own services, 18 gave a delivery time with a number, and 17 of the 34 sites showing reviews linked to their source. 41 were in French only.",
        faqs: [
            { question: "How much does a web agency in Marrakech charge for a website?", answer: "Among the 12 agencies ranking in Marrakech that publish a “from” price for a website in dirhams, the median was 3,045 MAD, and ten of the twelve were between 900 and 4,000 MAD (November 2026)." },
            { question: "How do I choose a web agency in Marrakech?", answer: "Ask for a starting price and a delivery date in writing, reviews you can click through to their source, real projects you can open, the languages your customers need, and who will own the domain, hosting and code." },
            { question: "Do the best-ranked agencies publish their prices more often?", answer: "No. 11 of the 30 sites in the top five published their own price, against 10 of the 33 ranked sixth to twentieth." },
        ],
        metaDescription: "Study of 66 web agency and freelancer websites ranking on Google for Marrakech in November 2026: prices, delivery times, reviews, languages and WhatsApp, with the method.",
        date: "November 10, 2026",
        publishedAt: "2026-11-10",
        modifiedAt: "2026-11-10",
        author: "WeReact Editorial Team",
        authorRole: "Web design and SEO studio",
        relatedServiceSlug: "web-design-marrakech",
        relatedAudienceSlug: "website-design-moroccan-businesses",
        category: "Research",
        categoryColor: "#A3B18A",
        image: "/images/blog/design.webp",
        readTime: "7 min read",
        tags: ["Web agency Marrakech", "Study", "Website prices", "Morocco"],
        content: `
            <p>Choosing a web agency in Marrakech usually starts on Google, with a dozen tabs and the same questions each time: how much, how long, and can I trust them? We wanted to know how many agencies actually answer those questions on their own website.</p>
            <p>On November 10, 2026 we took every agency and freelancer website in Google’s top 20 results in Morocco, in French, for three searches: “agence web marrakech”, “création site web marrakech” and “agence seo marrakech”. That gave 67 sites, 66 of which we could analyse. We are a Marrakech agency ourselves, so we left our own site out and we name no one: the point is what a buyer sees, not who.</p>

            <h2>The numbers</h2>
            <table>
                <thead><tr><th>What we checked</th><th>Sites</th></tr></thead>
                <tbody>
                    <tr><td>Publish a price for their own services</td><td>21 of 66</td></tr>
                    <tr><td>Show no price at all</td><td>36 of 66</td></tr>
                    <tr><td>Give a delivery time with a number</td><td>18 of 66</td></tr>
                    <tr><td>Show testimonials or a rating</td><td>34 of 66</td></tr>
                    <tr><td>…of which link to where the reviews come from</td><td>17 of 34</td></tr>
                    <tr><td>Offer WhatsApp</td><td>46 of 66</td></tr>
                    <tr><td>Have an English version</td><td>23 of 66</td></tr>
                    <tr><td>Have an Arabic version</td><td>10 of 66</td></tr>
                    <tr><td>French only</td><td>41 of 66</td></tr>
                    <tr><td>Link to their Google Business listing</td><td>27 of 66</td></tr>
                    <tr><td>Show a portfolio or case studies</td><td>52 of 66</td></tr>
                </tbody>
            </table>

            <h2>Two agencies in three do not show a price</h2>
            <p>Only 21 of the 66 sites publish a price for their own services. Twelve give a “from” price for building a website in dirhams: the median is 3,045 MAD, and ten of the twelve sit between 900 and 4,000 MAD. Two premium agencies start at 35,000 MAD, which shows how wide the market is. Several of the lowest prices on the list are monthly SEO plans, not websites, so compare like with like.</p>
            <p>A price on the page does not tell you everything, but its absence means every comparison starts with a phone call. Our <a href="/en/blog/combien-coute-site-web-maroc">guide to website prices in Morocco</a> explains what moves a quote up or down.</p>

            <h2>Few say how long it takes</h2>
            <p>18 sites give a delivery time with a number, from seven days to five to eight weeks. Thirteen mention “délais” without a figure, and 33 say nothing about time at all. If your launch date matters, for a season or an opening, ask for it in writing before you sign.</p>

            <h2>Half of the reviews cannot be traced</h2>
            <p>34 sites show testimonials or a rating. Only 17 link to where those reviews come from, mostly Google, sometimes Trustpilot. Fourteen show reviews with no source at all, and three had placeholder or empty review blocks live on the page. A review you can click through to a Google profile carries more weight than a quote anyone can type. Google’s own rules on reviews are summarised in our <a href="/en/blog/fiche-google-business-maroc">Google Business Profile guide</a>.</p>

            <h2>Mostly French-only, in a tourist city</h2>
            <p>41 of the 66 sites are only in French. 23 have English, 10 have Arabic, and 8 have all three. For an agency that will build your site, its own languages are a fair hint at how it will treat yours, especially if your customers are travelers.</p>

            <h2>Ranking higher does not mean more transparent</h2>
            <p>Sites in the top five for any of the three searches publish their own price no more often than those ranked sixth to twentieth: 11 of 30 against 10 of 33. It is the same for WhatsApp, delivery times and linked reviews. Position on Google tells you who invested in visibility, not who answers your questions.</p>

            <h2>Two more things worth knowing</h2>
            <ul>
                <li><strong>Not every “Marrakech” page is in Marrakech.</strong> Of the 38 sites that declare an address in their page code, 18 give another city, such as Tangier, Agadir or Casablanca. That is not a problem in itself, as projects run remotely, but it is worth asking where the team works.</li>
                <li><strong>Some “top agencies in Marrakech” lists are written by agencies,</strong> and a few businesses run several of the ranking sites, which share the same phone number. Read rankings of agencies with that in mind.</li>
            </ul>

            <h2>A checklist for choosing an agency</h2>
            <ul>
                <li>A starting price in writing, and what it includes.</li>
                <li>A delivery date in writing.</li>
                <li>Reviews you can click through to their source.</li>
                <li>Examples of real projects, with links you can open.</li>
                <li>The languages your customers need, planned from the start.</li>
                <li>Who owns the domain, the hosting and the code at the end. Our pricing guide lists <a href="/en/blog/combien-coute-site-web-maroc">the questions to ask any agency</a>.</li>
            </ul>
            <p>That list applies to us as well. Our prices start from 2,000 MAD for a showcase website and from 3,500 MAD for e-commerce, with a delivery time on every quote: see <a href="/en/web-design-marrakech">our web agency page for Marrakech</a>.</p>

            <h2>Method</h2>
            <p>Searches: “agence web marrakech”, “création site web marrakech” and “agence seo marrakech”, Google Morocco in French on desktop, top 20 organic results plus the map pack, each read three times and merged, on November 10, 2026. We kept web agencies and freelancers and excluded directories, social networks, listing sites and our own site. For each site we read two pages, the page that ranked and the homepage, with one request each, following robots.txt, without running JavaScript. Prices, delivery times and reviews were checked by hand. Limits: content loaded only by JavaScript or shown inside images was not read; one site returned a server error and was not analysed; one measurement per site.</p>
        `,
        fr: {
            title: "Agences web à Marrakech : ce que montrent 66 sites classés sur Google (étude 2026)",
            metaTitle: "Agences web à Marrakech : étude de 66 sites",
            excerpt: "Nous avons examiné tous les sites d'agences et de freelances du top 20 Google pour trois recherches à Marrakech. Deux sur trois n'affichent aucun prix, peu donnent un délai, et la moitié des avis affichés sont invérifiables.",
            summary: "En novembre 2026, nous avons examiné les 66 sites d’agences et de freelances classés dans le top 20 Google pour trois recherches à Marrakech. Seuls 21 affichaient un prix pour leurs propres services, 18 donnaient un délai chiffré, et 17 des 34 sites qui montrent des avis renvoyaient vers leur source. 41 étaient uniquement en français.",
            faqs: [
                { question: "Combien coûte un site web chez une agence à Marrakech ?", answer: "Parmi les 12 agences classées à Marrakech qui affichent un prix « à partir de » pour un site en dirhams, la médiane était de 3 045 MAD, et dix sur douze se situaient entre 900 et 4 000 MAD (novembre 2026)." },
                { question: "Comment choisir une agence web à Marrakech ?", answer: "Demandez un prix de départ et une date de livraison par écrit, des avis sur lesquels on peut cliquer jusqu’à leur source, de vrais projets qu’on peut ouvrir, les langues dont vos clients ont besoin, et qui possédera le nom de domaine, l’hébergement et le code." },
                { question: "Les agences les mieux classées affichent-elles plus souvent leurs prix ?", answer: "Non. 11 des 30 sites du top 5 affichaient leur prix, contre 10 des 33 sites classés de 6 à 20." },
            ],
            metaDescription: "Étude de 66 sites d'agences web et de freelances classés sur Google pour Marrakech en novembre 2026 : prix, délais, avis, langues et WhatsApp, avec la méthode.",
            date: "10 novembre 2026",
            readTime: "7 min de lecture",
            category: "Étude",
            authorRole: "Studio de création web et SEO",
            content: `
                <p>Choisir une agence web à Marrakech commence en général sur Google, avec une dizaine d'onglets ouverts et les mêmes questions à chaque fois : combien, en combien de temps, et peut-on leur faire confiance ? Nous voulions savoir combien d'agences répondent vraiment à ces questions sur leur propre site.</p>
                <p>Le 10 novembre 2026, nous avons pris tous les sites d'agences et de freelances présents dans les 20 premiers résultats de Google au Maroc, en français, pour trois recherches : « agence web marrakech », « création site web marrakech » et « agence seo marrakech ». Cela donne 67 sites, dont 66 analysables. Nous sommes nous-mêmes une agence à Marrakech : nous avons donc exclu notre propre site et nous ne citons personne. Ce qui compte ici, c'est ce que voit un client, pas qui.</p>

                <h2>Les chiffres</h2>
                <table>
                    <thead><tr><th>Ce que nous avons vérifié</th><th>Sites</th></tr></thead>
                    <tbody>
                        <tr><td>Affichent un prix pour leurs propres services</td><td>21 sur 66</td></tr>
                        <tr><td>N'affichent aucun prix</td><td>36 sur 66</td></tr>
                        <tr><td>Donnent un délai de livraison chiffré</td><td>18 sur 66</td></tr>
                        <tr><td>Affichent des avis ou une note</td><td>34 sur 66</td></tr>
                        <tr><td>…dont avec un lien vers la source des avis</td><td>17 sur 34</td></tr>
                        <tr><td>Proposent WhatsApp</td><td>46 sur 66</td></tr>
                        <tr><td>Ont une version anglaise</td><td>23 sur 66</td></tr>
                        <tr><td>Ont une version arabe</td><td>10 sur 66</td></tr>
                        <tr><td>Uniquement en français</td><td>41 sur 66</td></tr>
                        <tr><td>Renvoient vers leur fiche Google Business</td><td>27 sur 66</td></tr>
                        <tr><td>Montrent un portfolio ou des études de cas</td><td>52 sur 66</td></tr>
                    </tbody>
                </table>

                <h2>Deux agences sur trois n'affichent pas de prix</h2>
                <p>Seuls 21 des 66 sites affichent un prix pour leurs propres services. Douze donnent un prix « à partir de » pour la création d'un site, en dirhams : la médiane est de 3 045 MAD, et dix sur douze se situent entre 900 et 4 000 MAD. Deux agences haut de gamme démarrent à 35 000 MAD, ce qui montre l'étendue du marché. Plusieurs des prix les plus bas de la liste sont des forfaits SEO mensuels, pas des sites : comparez ce qui est comparable.</p>
                <p>Un prix affiché ne dit pas tout, mais son absence oblige à commencer chaque comparaison par un appel. Notre <a href="/fr/blog/combien-coute-site-web-maroc">guide des prix d'un site web au Maroc</a> explique ce qui fait monter ou baisser un devis.</p>

                <h2>Peu disent combien de temps cela prend</h2>
                <p>18 sites donnent un délai chiffré, de sept jours à cinq à huit semaines. Treize parlent de « délais » sans chiffre, et 33 ne disent rien. Si votre date de lancement compte, pour une saison ou une ouverture, demandez-la par écrit avant de signer.</p>

                <h2>La moitié des avis sont invérifiables</h2>
                <p>34 sites affichent des avis ou une note. Seuls 17 renvoient vers leur source, le plus souvent Google, parfois Trustpilot. Quatorze affichent des avis sans aucune source, et trois avaient des blocs d'avis vides ou provisoires en ligne. Un avis sur lequel on peut cliquer pour arriver à une fiche Google pèse plus qu'une citation que n'importe qui peut taper. Les règles de Google sur les avis sont résumées dans notre <a href="/fr/blog/fiche-google-business-maroc">guide de la fiche Google Business</a>.</p>

                <h2>Surtout en français, dans une ville touristique</h2>
                <p>41 des 66 sites sont uniquement en français. 23 ont une version anglaise, 10 une version arabe, et 8 les trois. Pour une agence qui va créer votre site, ses propres langues disent quelque chose de la façon dont elle traitera les vôtres, surtout si vos clients sont des voyageurs.</p>

                <h2>Mieux classé ne veut pas dire plus transparent</h2>
                <p>Les sites du top 5 sur l'une des trois recherches n'affichent pas leur prix plus souvent que ceux classés de 6 à 20 : 11 sur 30 contre 10 sur 33. C'est la même chose pour WhatsApp, les délais et les avis sourcés. La position sur Google montre qui a investi dans sa visibilité, pas qui répond à vos questions.</p>

                <h2>Deux autres choses à savoir</h2>
                <ul>
                    <li><strong>Toutes les pages « Marrakech » ne sont pas à Marrakech.</strong> Sur les 38 sites qui déclarent une adresse dans le code de leurs pages, 18 indiquent une autre ville, comme Tanger, Agadir ou Casablanca. Ce n'est pas un problème en soi, les projets se mènent à distance, mais il vaut la peine de demander où travaille l'équipe.</li>
                    <li><strong>Certains classements des « meilleures agences à Marrakech » sont écrits par des agences,</strong> et quelques entreprises gèrent plusieurs des sites classés, qui partagent le même numéro de téléphone. Lisez ces classements en connaissance de cause.</li>
                </ul>

                <h2>La liste pour choisir une agence</h2>
                <ul>
                    <li>Un prix de départ écrit, et ce qu'il comprend.</li>
                    <li>Une date de livraison écrite.</li>
                    <li>Des avis sur lesquels on peut cliquer jusqu'à leur source.</li>
                    <li>Des exemples de vrais projets, avec des liens qu'on peut ouvrir.</li>
                    <li>Les langues dont vos clients ont besoin, prévues dès le départ.</li>
                    <li>Qui possède le nom de domaine, l'hébergement et le code à la fin. Notre guide des prix liste <a href="/fr/blog/combien-coute-site-web-maroc">les questions à poser à toute agence</a>.</li>
                </ul>
                <p>Cette liste s'applique à nous aussi. Nos prix démarrent à partir de 2 000 MAD pour un site vitrine et à partir de 3 500 MAD pour un site e-commerce, avec un délai sur chaque devis : voir notre page <a href="/fr/web-design-marrakech">agence web à Marrakech</a>.</p>

                <h2>Méthode</h2>
                <p>Recherches : « agence web marrakech », « création site web marrakech » et « agence seo marrakech », Google Maroc en français sur ordinateur, 20 premiers résultats naturels plus le bloc carte, chacune lue trois fois puis fusionnée, le 10 novembre 2026. Nous avons gardé les agences web et les freelances et exclu les annuaires, réseaux sociaux, sites d'annonces et notre propre site. Pour chaque site, nous avons lu deux pages, celle qui était classée et l'accueil, avec une requête chacune, en respectant le robots.txt, sans exécuter de JavaScript. Les prix, délais et avis ont été vérifiés à la main. Limites : les contenus chargés uniquement en JavaScript ou affichés dans des images n'ont pas été lus ; un site renvoyait une erreur serveur et n'a pas été analysé ; une seule mesure par site.</p>
            `
        }
    }
];
