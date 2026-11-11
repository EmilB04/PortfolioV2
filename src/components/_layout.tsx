import { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import HeaderSection from './ui/HeaderSection';
import FooterSection from './ui/FooterSection';
import TerrainBackdrop from '../styles/TerrainBackdrop';
import ToTopButton from './ui/ToTopButton';

// The assistant is a corner button until someone opens it, but it carries the
// chat panel, its markdown handling and its actions. Loading it after the page
// keeps that weight out of the first parse, which is what a phone feels.
const AIStarterWidget = lazy(() => import('./ui/AIStarterWidget'));

export default function Layout({ children }: { children: React.ReactNode }) {
    const { t } = useTranslation();

    return (
        <div className="relative min-h-screen overflow-x-hidden">
            <TerrainBackdrop />

            <a
                href="#main-content"
                className="fixed left-4 top-4 z-[500] -translate-y-[200%] rounded-full bg-[var(--bg)] px-4 py-3 text-sm font-semibold text-[var(--text)] shadow-[var(--shadow)] ring-1 ring-[var(--border-control)] focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] motion-reduce:transition-none"
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

            <Suspense fallback={null}>
                <AIStarterWidget />
            </Suspense>
            <ToTopButton />
        </div>
    );
}