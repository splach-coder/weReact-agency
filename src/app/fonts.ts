import localFont from 'next/font/local';
export const nohemi = localFont({
    src: [
        {
            path: '../../public/fonts/Nohemi-Regular-BF6438cc4d0e493.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../public/fonts/Nohemi-Medium-BF6438cc5883899.woff2',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../../public/fonts/Nohemi-Bold-BF6438cc587b5b5.woff2',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../../public/fonts/Nohemi-Black-BF6438cc58744d4.woff2',
            weight: '900',
            style: 'normal',
        },
    ],
    variable: '--font-nohemi',
    display: 'swap',
});
