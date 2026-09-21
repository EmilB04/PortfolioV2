import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
    FiShield, FiHeart, FiBriefcase, FiTool, FiMonitor,
    FiBookOpen, FiTrendingUp, FiShoppingBag, FiFlag, FiPackage,
} from 'react-icons/fi'
import type { IconType } from 'react-icons'
import IndexLayout from './_layout'
import SectionHeading from '../ui/SectionHeading'
import { INDEX_PATHS } from '../../routes/indexPaths'

type CourseCategory = {
    key:
        | 'compliance' | 'hr' | 'b2b' | 'services' | 'system'
        | 'program' | 'selfDev' | 'sales' | 'intro' | 'other'
    icon: IconType
    color: string
    courses: string[]
}

type Workplace = {
    key: string
    name: string
    accentColor: string
    categories: CourseCategory[]
}

const ELKJOP_CATEGORIES: CourseCategory[] = [
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

const WORKPLACES: Workplace[] = [
    {
        key: 'elkjop',
        name: 'Elkjøp',
        accentColor: '#E30613',
        categories: ELKJOP_CATEGORIES,
    },
]

export default function Certifications() {
    const { t } = useTranslation()
    const [activeKey, setActiveKey] = useState(WORKPLACES[0].key)

    const workplace = WORKPLACES.find((w) => w.key === activeKey)!
    const totalCourses = workplace.categories.reduce((sum, cat) => sum + cat.courses.length, 0)

    return (
        <IndexLayout id={INDEX_PATHS.CERTIFICATIONS}>
            <SectionHeading
                title={t('certifications.title')}
                lead={t('certifications.intro')}
                aside={
                    <div className="flex flex-col items-start gap-3 md:items-end">
                        <div
                            role="tablist"
                            aria-label={t('certifications.switcherLabel')}
                            className="flex flex-wrap gap-2 md:justify-end"
                        >
                            {WORKPLACES.map((w) => {
                                const count = w.categories.reduce((s, c) => s + c.courses.length, 0)
                                const isActive = w.key === activeKey
                                return (
                                    <button
                                        key={w.key}
                                        role="tab"
                                        aria-selected={isActive}
                                        onClick={() => setActiveKey(w.key)}
                                        className="pebble-sm flex items-center gap-2 border px-3.5 py-2 text-sm font-medium transition-colors duration-200"
                                        style={
                                            isActive
                                                ? {
                                                      borderColor: `color-mix(in srgb, ${w.accentColor} 55%, transparent)`,
                                                      background: `color-mix(in srgb, ${w.accentColor} 12%, var(--surface-card))`,
                                                      color: 'var(--text)',
                                                  }
                                                : {
                                                      borderColor: 'var(--border)',
                                                      background: 'transparent',
                                                      color: 'var(--text-subtle)',
                                                  }
                                        }
                                    >
                                        <span
                                            className="h-2 w-2 rounded-full"
                                            style={{ background: isActive ? w.accentColor : 'var(--border-strong)' }}
                                            aria-hidden="true"
                                        />
                                        {w.name}
                                        <span className="text-xs text-[var(--text-subtle)]">{count}</span>
                                    </button>
                                )
                            })}
                        </div>

                        <p className="text-sm text-[var(--text-subtle)]">
                            {t('certifications.totalLabel', { count: totalCourses })}
                        </p>
                    </div>
                }
            />

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeKey}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="pebble-set grid w-full grid-cols-1 items-start gap-5 md:grid-cols-3 min-[1280px]:grid-cols-4"
                >
                    {workplace.categories.map((cat) => (
                        <CategoryCard
                            key={cat.key}
                            category={cat}
                            label={t(`certifications.categories.${cat.key}`)}
                            courseWord={t('certifications.courseCount', { count: cat.courses.length })}
                        />
                    ))}
                </motion.div>
            </AnimatePresence>
        </IndexLayout>
    )
}

function CategoryCard({
    category,
    label,
    courseWord,
}: {
    category: CourseCategory
    label: string
    courseWord: string
}) {
    const Icon = category.icon

    return (
        <div className="card-organic flex flex-col p-5">
            <div className="mb-4 flex items-center gap-2.5">
                <div
                    className="pebble-sm flex h-9 w-9 flex-shrink-0 items-center justify-center"
                    style={{
                        background: `color-mix(in srgb, ${category.color} 15%, var(--surface-card))`,
                        boxShadow: `0 0 0 1px color-mix(in srgb, ${category.color} 26%, transparent)`,
                    }}
                >
                    <Icon size={16} style={{ color: category.color }} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold text-[var(--text)]">{label}</p>
                    <p className="text-xs text-[var(--text-subtle)]">{courseWord}</p>
                </div>
            </div>

            <ul className="flex flex-col gap-1.5">
                {category.courses.map((course) => (
                    <li
                        key={course}
                        className="prose-organic flex items-start gap-2 text-[13.5px] leading-snug text-[var(--text-muted)]"
                    >
                        <span
                            aria-hidden="true"
                            className="mt-[0.45rem] h-1 w-1 flex-shrink-0 rounded-full"
                            style={{ background: category.color }}
                        />
                        {course}
                    </li>
                ))}
            </ul>
        </div>
    )
}
