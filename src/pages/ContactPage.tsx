import { useTranslation } from 'react-i18next'
import IndexLayout from '../components/indexSections/_layout'
import ContactCard from '../components/ContactCard'
import { Linkedin, Github, Mail } from '../lib/icons'

export default function Contact() {
    const { t } = useTranslation()

    return (
        <IndexLayout id="contact">
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <h1
                        className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-[var(--text)]"
                        style={{
                            background: 'var(--accent)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >{t('contactPage.title')}</h1>
                    <p className="text-center text-[var(--text-subtle)] mb-12">{t('contactPage.subtitle')}</p>

                    <div className="flex flex-row flex-wrap gap-8 justify-center">
                        <ContactCard
                            title={t('contactPage.cards.linkedin.title')}
                            description={t('contactPage.cards.linkedin.description')}
                            buttonLabel={t('contactPage.cards.linkedin.button')}
                            href="https://www.linkedin.com/in/emilber/"
                            external
                            icon={<Linkedin size={36} />}
                        />

                        <ContactCard
                            title={t('contactPage.cards.github.title')}
                            description={t('contactPage.cards.github.description')}
                            buttonLabel={t('contactPage.cards.github.button')}
                            href="https://github.com/emilb04"
                            external
                            icon={<Github size={36} />}
                        />
                        <ContactCard
                            title={t('contactPage.cards.email.title')}
                            description={t('contactPage.cards.email.description')}
                            buttonLabel={t('contactPage.cards.email.button')}
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
