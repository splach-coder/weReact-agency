import { useTranslations } from 'next-intl';

export default function NotFound() {
    const t = useTranslations('HomePage'); // fallback to generic or create NotFound namespace

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
            <p>Could not find requested resource</p>
        </div>
    );
}
