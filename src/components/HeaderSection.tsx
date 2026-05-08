import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Code, Menu, MoonStar, SunMedium, X } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export default function HeaderSection() {
    const { t, i18n } = useTranslation()
    const { isDark, toggleTheme } = useTheme()
    const [menuOpen, setMenuOpen] = useState(false)

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en')
    }

    return (
        <header className="bg-white border-b sticky top-0 z-50">
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-xl font-semibold">
                    <Code size={24} />
                    EmilB04
                </Link>

                {/* Desktop nav */}
                <nav className="hidden sm:flex space-x-4 items-center text-sm">
                    <Link to="/projects" className="text-gray-600 hover:text-gray-900">{t('nav.projects')}</Link>
                    <Link to="/about" className="text-gray-600 hover:text-gray-900">{t('nav.about')}</Link>
                    <Link to="/contact" className="text-gray-600 hover:text-gray-900">{t('nav.contact')}</Link>
                    <button
                        onClick={toggleLanguage}
                        className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
                    >
                        {i18n.language === 'en' ? 'ES' : 'EN'}
                    </button>
                    <button
                        onClick={toggleTheme}
                        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        className="inline-flex items-center justify-center rounded border px-2 py-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    >
                        {isDark ? <SunMedium size={16} /> : <MoonStar size={16} />}
                    </button>
                </nav>

                {/* Mobile menu button */}
                <div className="sm:hidden flex items-center gap-2">
                    <button
                        onClick={toggleLanguage}
                        className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
                    >
                        {i18n.language === 'en' ? 'ES' : 'EN'}
                    </button>
                    <button
                        onClick={toggleTheme}
                        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        className="inline-flex items-center justify-center rounded border px-2 py-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    >
                        {isDark ? <SunMedium size={16} /> : <MoonStar size={16} />}
                    </button>
                    <button onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="sm:hidden border-t bg-white"
                >
                    <nav className="flex flex-col space-y-2 px-4 py-3 text-sm">
                        <Link to="/projects" className="text-gray-600 hover:text-gray-900" onClick={() => setMenuOpen(false)}>
                            {t('nav.projects')}
                        </Link>
                        <Link to="/about" className="text-gray-600 hover:text-gray-900" onClick={() => setMenuOpen(false)}>
                            {t('nav.about')}
                        </Link>
                        <Link to="/contact" className="text-gray-600 hover:text-gray-900" onClick={() => setMenuOpen(false)}>
                            {t('nav.contact')}
                        </Link>
                    </nav>
                </motion.div>
            )}
        </header>
    )
}