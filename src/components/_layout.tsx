import HeaderSection from './ui/HeaderSection';
import FooterSection from './ui/FooterSection';
import AIStarterWidget from './ui/AIStarterWidget';
import ShootingStars from '../styles/ShootingStars';
import ToTopButton from './ui/ToTopButton';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen overflow-x-hidden">
            <ShootingStars />

            <div className="relative z-10 flex min-h-screen flex-col">
                <HeaderSection />

                <main className="mx-auto flex w-full flex-1 flex-col">
                    {children}
                </main>

                <FooterSection />
            </div>

            <AIStarterWidget />
            <ToTopButton />
        </div>
    );
}