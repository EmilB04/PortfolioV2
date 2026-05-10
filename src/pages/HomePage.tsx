
import Landing from '../components/indexSections/Landing'

export default function Home() {
    function handleScrollNextSection() {
        document.getElementById('next-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <main>
            <Landing onScrollNextSection={handleScrollNextSection} />

        </main>
    )
}
