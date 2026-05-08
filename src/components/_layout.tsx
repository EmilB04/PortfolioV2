import HeaderSection from './HeaderSection';
import FooterSection from './FooterSection';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <HeaderSection />
            {children}
            <FooterSection />
        </>
    );
}