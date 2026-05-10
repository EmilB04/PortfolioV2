// React import not required with new JSX transform
import IndexLayout from '../components/indexSections/_layout'
import ContactCard from '../components/ContactCard'
import { Linkedin, Github, Mail } from '../lib/icons'

export default function Contact() {
    return (
        <IndexLayout id="contact">
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <h1
                        className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-[var(--c-text)]"
                        style={{
                            background: 'var(--c-accent)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >La oss komme i kontakt</h1>
                    <p className="text-center text-[var(--c-text-subtle)] mb-12">Har du spørsmål eller vil du samarbeide? Ta gjerne kontakt!</p>

                    <div className="flex flex-row flex-wrap gap-8 justify-center">
                        <ContactCard
                            title="LinkedIn"
                            description="Koble deg til mitt nettverk"
                            buttonLabel="KONTAKT"
                            href="https://www.linkedin.com/in/emilber/"
                            external
                            icon={<Linkedin size={36} />}
                        />

                        <ContactCard
                            title="GitHub"
                            description="Se mine prosjekter og bidrag"
                            buttonLabel="SE PROFIL"
                            href="https://github.com/emilb04"
                            external
                            icon={<Github size={36} />}
                        />
                        <ContactCard
                            title="E-post"
                            description="Send meg en melding direkte"
                            buttonLabel="SEND E-POST"
                            href="mailto:emil.berglund+portfolio@live.no"
                            external
                            icon={<Mail size={36} />}
                        />
                    </div>
                </div>
            </section>
        </IndexLayout>
    )
}
