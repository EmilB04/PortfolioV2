
import Landing from '../components/indexSections/Landing'
import AboutMe from '../components/indexSections/AboutMe';

export default function Home() {
    function handleScrollNextSection() {
        document.getElementById('next-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <main>
            <Landing onScrollNextSection={handleScrollNextSection} />
            <AboutMe />

        </main>
    )
}
