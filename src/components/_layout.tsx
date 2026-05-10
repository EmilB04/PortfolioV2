import HeaderSection from './ui/HeaderSection';
import FooterSection from './ui/FooterSection';
import AIStarterWidget from './ui/AIStarterWidget';
import ShootingStars from '../styles/ShootingStars';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen overflow-x-hidden">
            <ShootingStars />

            <div className="relative z-10 flex min-h-screen flex-col">
                <HeaderSection />

                <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pt-16 sm:px-6 sm:pt-18 lg:px-8">
                    {children}
                </main>

                <FooterSection />
            </div>

            <AIStarterWidget />
        </div>
    );
}