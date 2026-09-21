import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'
import ebDark from '../../assets/icons/eb_black.png'
import ebLight from '../../assets/icons/eb_whte.png'

/**
 * The monogram anchors the left end of the header rail, opposite the
 * actions, so the row of islands has something to hang from.
 */
export default function BrandMark({ settled = false }: { settled?: boolean }) {
    const { t } = useTranslation()
    const { isDark } = useTheme()

    return (
        <Link
            to="/"
            aria-label={t('nav.home')}
            className={`nav-island inline-flex h-11 w-11 items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0.28,1)] hover:-translate-y-[1px] ${settled ? 'nav-island--settled' : ''}`}
        >
            <img
                src={isDark ? ebLight : ebDark}
                alt=""
                className="h-7 w-7 object-contain"
                loading="eager"
            />
        </Link>
    )
}
