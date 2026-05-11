
import Landing from '../components/indexSections/Landing'
import AboutMe from '../components/indexSections/AboutMe';
import LiveDomainShowcase from '../components/indexSections/LiveDomainShowcase';
import Timeline from '../components/indexSections/Timeline';
import ProjectsSection from '../components/indexSections/ProjectsSection';
import Knowledge from '../components/indexSections/Knowledge';
import GitHub from '../components/indexSections/GitHub';

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
            <ProjectsSection />
            <Knowledge />
            <GitHub />
        </main>
    )
}
