// Use Motion for animations
import ThemeSwitcher from '../header/ThemeSwitcher';

export default function HeaderSection() {

    return (
        <header
            className="border-b sticky top-0 z-50 backdrop-blur-sm"
            style={{
                backgroundColor: 'var(--c-nav-bg)',
                borderColor: 'var(--c-border)',
                color: 'var(--c-text)',
            }}
        >
            <section>
                {/* If NOT indexpage show back button */}
            </section>

            <section>
                {/* Section links here */}
            </section>

            <section>
                {/* Theme Switcher */}
                <ThemeSwitcher />
            </section>

            <section>
                {/* Language Switcher */}
            </section>

            <section>
                {/* Contact me button*/}
            </section>
        </header>
    )
}