import ContactButton from '../header/ContactButton'
import LanguageSwitcher from '../header/LanguageSwitcher'
import { ThemeSwitcher } from '../header/ThemeSwitcher'
import NavSection from './NavSection.tsx'

export default function HeaderSection() {
    return (
        <header
            className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl bg-[var(--nav-bg-transparent)]"
            style={{
                borderColor: 'var(--border)',
                color: 'var(--text)',
            }}
        >
            <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between gap-3 px-4 sm:h-18 sm:px-6 lg:px-8">
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