import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'

// 96px copies of src/assets/icons/eb_*.png, which are 1024x1024 and ~1.4 MB
// each — a full megabyte per page view for a 28px mark. Regenerate with the
// note in public/brand/README.md if the monogram changes.
const EB_DARK = '/brand/eb-dark-96.png'
const EB_LIGHT = '/brand/eb-light-96.png'

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
                src={isDark ? EB_LIGHT : EB_DARK}
                alt=""
                className="h-7 w-7 object-contain"
                width={96}
                height={96}
                loading="eager"
                decoding="async"
            />
        </Link>
    )
}
