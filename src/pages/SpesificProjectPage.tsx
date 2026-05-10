
export default function SpesificProjectPage() {
    return (
        <main className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Project Title</h1>
            <p className="mb-4">This is a detailed description of the project. It includes the technologies used, the challenges faced, and the outcomes achieved.</p>
            <h2 className="text-2xl font-semibold mb-2">Technologies Used</h2>
            <ul className="list-disc list-inside mb-4">
                <li>React</li>
                <li>TypeScript</li>
                <li>Supabase</li>
            </ul>
            <h2 className="text-2xl font-semibold mb-2">Project Highlights</h2>
            <p>This project was particularly challenging due to [specific challenge], but it was rewarding to see it come together successfully.</p>
            <a href="/projects" className="inline-block mt-4 text-blue-600 hover:underline">Back to Projects</a>
        </main>
    )
}