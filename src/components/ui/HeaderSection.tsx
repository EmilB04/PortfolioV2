import { useEffect, useState } from 'react'
import BrandMark from '../header/BrandMark'
import ContactButton from '../header/ContactButton'
import SettingsMenu from '../header/SettingsMenu'
import NavSection from './NavSection.tsx'

/**
 * The header is a transparent rail. Everything visible in it is a separate
 * island — links, settings, contact — so the page shows through between them.
 * Once content scrolls underneath, the islands settle: the rail tightens and
 * each island takes on a solid backing and a shadow.
 */
export default function HeaderSection() {
    const [settled, setSettled] = useState(false)

    useEffect(() => {
        function onScroll() {
            setSettled(window.scrollY > 24)
        }

        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0.28,1)] motion-reduce:transition-none ${settled ? 'py-2.5' : 'py-5'}`}
            style={{ color: 'var(--text)' }}
        >
            <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between gap-3 px-4 md:px-6">
                <BrandMark settled={settled} />

                <div className="flex min-w-0 items-center gap-2.5">
                    <NavSection settled={settled} />

                    <div className="hidden items-center gap-2.5 md:flex">
                        <SettingsMenu settled={settled} />
                        <ContactButton />
                    </div>
                </div>
            </div>
        </header>
    )
}
