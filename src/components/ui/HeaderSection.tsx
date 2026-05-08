// Use Motion for animations
import { MoonStar, SunMedium } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

export default function HeaderSection() {
    const { isDark, toggleTheme } = useTheme()

    return (
        <header className="bg-white border-b sticky top-0 z-50">
            <section>
                {/* If NOT indexpage show back button */}
            </section>

            <section>
                {/* Section links here */}
            </section>

            <section>
                {/* Theme Switcher */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                    {isDark ? <SunMedium /> : <MoonStar />}
                </button>
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