import IndexLayout from "./_layout";
import { INDEX_PATHS } from '../../routes/indexPaths'


export default function GitHub() {
    return (
        <IndexLayout id={INDEX_PATHS.GITHUB}>
            <section className="text-center">
                <h2>GitHub</h2>
                <p>Coming soon...</p>
            </section>
        </IndexLayout>
    )
}