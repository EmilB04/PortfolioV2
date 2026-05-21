
import Landing from '../components/indexSections/Landing'
import AboutMe from '../components/indexSections/AboutMe';
import LiveDomainShowcase from '../components/indexSections/LiveDomainShowcase';
import ProjectsSection from '../components/indexSections/ProjectsSection';
import Knowledge from '../components/indexSections/Knowledge';
import GitHub from '../components/indexSections/GitHub';
import Timeline from '../components/indexSections/Timeline';
import { INDEX_PATHS } from '../routes/indexPaths'

export default function Home() {
    function handleScrollNextSection() {
        document.getElementById(INDEX_PATHS.ABOUT)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
