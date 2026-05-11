import IndexLayout from "./_layout";
import { INDEX_PATHS } from '../../routes/indexPaths'


export default function ProjectsSection() {
    return (
        <IndexLayout
            id={INDEX_PATHS.PROJECTS}
        >
            <section className="text-center">
                <h2>Projects</h2>
                <p>Coming soon...</p>
            </section>
        </IndexLayout>
    )
}