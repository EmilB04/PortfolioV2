
import Landing from '../components/indexSections/Landing'
import AboutMe from '../components/indexSections/AboutMe';
import LiveDomainShowcase from '../components/indexSections/LiveDomainShowcase';
import Timeline from '../components/indexSections/Timeline';

export default function Home() {
    function handleScrollNextSection() {
        document.getElementById('next-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <main>
            <Landing onScrollNextSection={handleScrollNextSection} />
            <AboutMe />
            <LiveDomainShowcase />
            <Timeline />
        </main>
    )
}
