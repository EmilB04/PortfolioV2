import { useTranslation } from 'react-i18next';
import HeaderSection from './ui/HeaderSection';
import FooterSection from './ui/FooterSection';
import AIStarterWidget from './ui/AIStarterWidget';
import ShootingStars from '../styles/ShootingStars';
import ToTopButton from './ui/ToTopButton';

export default function Layout({ children }: { children: React.ReactNode }) {
    const { t } = useTranslation();

    return (
        <div className="relative min-h-screen overflow-x-hidden">
            <ShootingStars />

            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[500] focus:rounded-full focus:bg-[var(--surface-card)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--text)] focus:shadow-[var(--shadow)]"
            >
                {t('header.skipToContent')}
            </a>

            <div className="relative z-10 flex min-h-screen flex-col">
                <HeaderSection />

                <main id="main-content" tabIndex={-1} className="mx-auto flex w-full flex-1 flex-col">
                    {children}
                </main>

                <FooterSection />
            </div>

            <AIStarterWidget />
            <ToTopButton />
        </div>
    );
}