export const siteConfig = {
    name: 'WeReact agency',
    shortName: 'WeReact',
    description: 'WeReact agency is a Marrakech-based website designer building fast business websites, landing pages, SEO foundations, and custom web experiences for clients in Morocco and beyond.',
    url: "https://www.wereact.agency",
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    ogImage: '/og-image.jpg',
    twitterHandle: '@wereact',
    creator: 'WeReact agency',
    seo: {
        primaryKeyword: 'website design Marrakech',
        keywords: [
            'website design Marrakech',
            'web agency Marrakech',
            'website designer Morocco',
            'business website design Morocco',
            'tourism website design Morocco',
            'landing page design Morocco',
            'SEO website foundations Morocco',
            'multilingual website design Morocco',
            'website maintenance Morocco',
            'agence web marrakech',
            'création site web maroc'
        ],
        geoKeywords: [
            'Marrakech web design',
            'Marrakesh website designer',
            'Morocco web agency',
            'Casablanca website design',
            'Rabat web design',
            'Agadir tourism websites',
            'Moroccan business websites'
        ],
        audience: [
            'Moroccan local businesses',
            'tourism and hospitality brands',
            'tour operators',
            'riads and hotels',
            'service businesses',
            'founders and small teams'
        ],
        languages: ['English', 'French'],
    },
    campaign: {
        primaryConversion: 'qualified_project_inquiry',
        leadValue: 1,
        leadCurrency: 'MAD',
        conversionMethods: ['contact_form', 'whatsapp', 'email'],
    },
    business: {
        legalName: 'WeReact agency',
        category: 'Website designer',
        region: 'Marrakech-Safi',
        phoneDisplay: '+212 602-258009',
        phoneInternational: '+212 602-258009',
        phoneTel: '+212 602-258009',
        email: 'hello@wereact.agency',
        addressDisplay: 'Marrakech 40000',
        city: 'Marrakesh',
        postalCode: '40000',
        country: 'MA',
        latitude: 31.6336545,
        longitude: -8.008899,
        hoursDisplay: 'Open 24 hours',
        openingHours: 'Mo-Su 00:00-23:59',
        whatsapp: 'https://api.whatsapp.com/send/?phone=212602258009&text=Hello%20WeReact%20agency%2C%20I%20am%20interested%20in%20your%20web%20development%20services.%20I%20would%20like%20to%20discuss%20my%20project%20and%20get%20a%20quote.&type=phone_number&app_absent=0',
        facebook: 'https://www.facebook.com/share/14dgXYad7SB/',
        googleMapsUrl: 'https://www.google.com/maps/preview/place/WeReact+agency,+Marrakech+40000/@31.6336545,-8.008899,13z/data=!4m2!3m1!1s0xdafef169d102b53:0xc961feb47705924',
        areaServed: ['Marrakech', 'Marrakesh', 'Casablanca', 'Rabat', 'Agadir', 'Fes', 'Tangier', 'Morocco', 'International'],
        services: [
            'Website design',
            'Business websites',
            'Landing pages',
            'E-commerce websites',
            'SEO foundations',
            'Website maintenance',
            'Custom web development'
        ],
        sameAs: [
            'https://www.instagram.com/wereact.agency',
            'https://twitter.com/wereact',
            'https://www.facebook.com/share/14dgXYad7SB/'
        ],
    },
};

export type SiteConfig = typeof siteConfig;
