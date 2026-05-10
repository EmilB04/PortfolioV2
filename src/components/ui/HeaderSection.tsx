import ContactButton from '../header/ContactButton'
import LanguageSwitcher from '../header/LanguageSwitcher'
import ThemeSwitcher from '../header/ThemeSwitcher'
import NavSection from './NavSection'

export default function HeaderSection() {
    return (
        <header
            className="fixed inset-x-0 top-0 z-50 border-b bg-transparent backdrop-blur-xl"
            style={{
                borderColor: 'var(--c-border)',
                color: 'var(--c-text)',
            }}
        >
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-18 sm:px-6 lg:px-8">
                <NavSection />

                <div className="hidden items-center gap-2 sm:gap-3 md:flex">
                    <LanguageSwitcher />
                    <ThemeSwitcher />
                    <ContactButton />
                </div>
            </div>
        </header>
    )
}