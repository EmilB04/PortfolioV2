import IndexLayout from "./_layout";
import { INDEX_PATHS } from '../../routes/indexPaths'

export default function Knowledge() {
    return (
        <IndexLayout id={INDEX_PATHS.KNOWLEDGE}>
            <section className="text-center">
                <h2>Knowledge</h2>
                <p>Coming soon...</p>
            </section>
        </IndexLayout>
    )
}