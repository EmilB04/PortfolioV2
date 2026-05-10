import ContactButton from '../header/ContactButton'
import LanguageSwitcher from '../header/LanguageSwitcher'
import ThemeSwitcher from '../header/ThemeSwitcher'
import NavSection from './NavSection'

export default function HeaderSection() {
    return (
        <header
            className="border-b backdrop-blur-sm"
            style={{
                backgroundColor: 'var(--c-nav-bg)',
                borderColor: 'var(--c-border)',
                color: 'var(--c-text)',
            }}
        >
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
                <NavSection />

                <div className="flex items-center gap-2 sm:gap-3">
                    <LanguageSwitcher />
                    <ThemeSwitcher />
                    <ContactButton />
                </div>
            </div>
        </header>
    )
}