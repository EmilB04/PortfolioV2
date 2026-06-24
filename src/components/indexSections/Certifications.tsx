import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
    FiShield, FiHeart, FiBriefcase, FiTool, FiMonitor,
    FiBookOpen, FiTrendingUp, FiShoppingBag, FiFlag, FiPackage,
} from 'react-icons/fi'
import type { IconType } from 'react-icons'
import IndexLayout from './_layout'
import { INDEX_PATHS } from '../../routes/indexPaths'

type CourseCategory = {
    key:
        | 'compliance' | 'hr' | 'b2b' | 'services' | 'system'
        | 'program' | 'selfDev' | 'sales' | 'intro' | 'other'
    icon: IconType
    color: string
    courses: string[]
}

const CATEGORIES: CourseCategory[] = [
    {
        key: 'compliance',
        icon: FiShield,
        color: '#3B82F6',
        courses: [
            'Squaretrade – Selling Insurance',
            'Protecting Payment Terminals in Our Stores',
            'Låneformidlingsloven (NO)',
            'Finansiering – Elkjøp Handlekonto',
            'IT Security & Privacy',
            'Code of Conduct',
            'Tryg – Selling Insurance',
            'Finansiering – Santander Månedlig Betaling',
            'Ran- og sikkerhetskurs (Elkjøp)',
            'GDPR Explained',
            'GDPR Permission – Collection of Consent',
        ],
    },
    {
        key: 'hr',
        icon: FiHeart,
        color: '#EF4444',
        courses: ['HMS: Brannverninstruks'],
    },
    {
        key: 'b2b',
        icon: FiBriefcase,
        color: '#8B5CF6',
        courses: ['Digital Workplace', 'Meet the Business Customer', 'Kreditt', 'Faktura'],
    },
    {
        key: 'services',
        icon: FiTool,
        color: '#14B8A6',
        courses: [
            'Finansiering – Santander Selvbetjening',
            'Consumer Credit',
            'Subscribed Services & Recurring Payment',
            'Insurance',
            'AVS',
            'Freight',
            'Introduction',
        ],
    },
    {
        key: 'system',
        icon: FiMonitor,
        color: '#0EA5E9',
        courses: [
            'E-CS Score (NO)',
            'Blueberry – Sales Order Management',
            'Blueberry – Additional Sales Processes',
            'Blueberry – The Sales Flow',
            'Quinyx App',
            'People Portal – Employee Self Service',
        ],
    },
    {
        key: 'program',
        icon: FiBookOpen,
        color: '#F59E0B',
        courses: [
            'Communication Training',
            'Commercial Services',
            'Sales Basic',
            'Blueberry Sales Tool',
            'New Store Employees',
        ],
    },
    {
        key: 'selfDev',
        icon: FiTrendingUp,
        color: '#10B981',
        courses: ['Negotiation Technique', 'Body Language', 'Building Relations', 'Trusted Advisor'],
    },
    {
        key: 'sales',
        icon: FiShoppingBag,
        color: '#EC4899',
        courses: ['Basic Step 1', 'Basic Step 2', 'Basic Step 3', 'Basic Step 4', 'Basic Step 5'],
    },
    {
        key: 'intro',
        icon: FiFlag,
        color: '#F97316',
        courses: [
            'Prismatch',
            'Happy or Not',
            'Kundefordeler',
            'Health & Safety',
            'Kundeklubb',
            'Digital Platforms Information',
            'Sustainability',
            'Bonus Model',
            'Our Sales Model',
            'Our Stores',
            "We'll Find a Solution",
            'Matchmaker',
        ],
    },
    {
        key: 'other',
        icon: FiPackage,
        color: '#64748B',
        courses: [
            'Computing: Introducing Meta Quest 2',
            'CE: Apple AirPods (3rd gen)',
            'TELE: Apple AirTag',
            'GDPR i Praksis',
            'Kurs i Antihvitvask (AML)',
        ],
    },
]

const TOTAL_COURSES = CATEGORIES.reduce((sum, cat) => sum + cat.courses.length, 0)

const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
}

const cardVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.97 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.32, ease: 'easeOut' } },
}

export default function Certifications() {
    const { t } = useTranslation()

    return (
        <IndexLayout id={INDEX_PATHS.CERTIFICATIONS} className="flex-col">
            <header className="mb-12 w-full text-center">
                <h2 className="text-3xl font-semibold sm:text-4xl">{t('certifications.title')}</h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--text-muted)] sm:text-base">
                    {t('certifications.intro')}
                </p>
                <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-card)] px-4 py-1.5 text-xs font-semibold tracking-wide text-[var(--text-subtle)]">
                    <span className="font-bold text-[var(--accent)]">Elkjøp</span>
                    {t('certifications.totalLabel', { count: TOTAL_COURSES })}
                </p>
            </header>

            <motion.div
                className="grid w-full grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
            >
                {CATEGORIES.map((cat) => (
                    <CategoryCard key={cat.key} category={cat} label={t(`certifications.categories.${cat.key}`)} />
                ))}
            </motion.div>
        </IndexLayout>
    )
}

function CategoryCard({ category, label }: { category: CourseCategory; label: string }) {
    const Icon = category.icon

    return (
        <motion.div
            variants={cardVariants}
            className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface-card)] p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            style={{ boxShadow: `0 0 0 1px color-mix(in srgb, ${category.color} 14%, transparent)` }}
        >
            <div className="mb-3 flex items-center gap-2">
                <div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{
                        background: `color-mix(in srgb, ${category.color} 16%, var(--surface-card))`,
                        boxShadow: `0 0 0 1px color-mix(in srgb, ${category.color} 28%, transparent)`,
                    }}
                >
                    <Icon size={16} style={{ color: category.color }} />
                </div>
                <div className="min-w-0">
                    <p className="truncate text-xs font-bold uppercase tracking-[0.10em] text-[var(--text)]">{label}</p>
                    <p className="text-xs text-[var(--text-subtle)]">{category.courses.length} {category.courses.length === 1 ? 'course' : 'courses'}</p>
                </div>
            </div>

            <ul className="flex flex-col gap-1">
                {category.courses.map((course) => (
                    <li key={course} className="flex items-start gap-1.5 text-xs leading-snug text-[var(--text-muted)]">
                        <span
                            aria-hidden="true"
                            className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                            style={{ background: category.color }}
                        />
                        {course}
                    </li>
                ))}
            </ul>
        </motion.div>
    )
}
