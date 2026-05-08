import HeaderSection from './ui/HeaderSection';
import FooterSection from './ui/FooterSection';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <HeaderSection />
            {children}
            <FooterSection />
        </>
    );
}