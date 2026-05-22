import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
    SiVuedotjs, SiReact, SiExpo, SiQuasar, SiHtml5, SiCss,
    SiJavascript, SiTypescript, SiSass, SiNodedotjs, SiDotnet,
    SiPython, SiMysql, SiGit, SiGithub, SiFigma, SiTrello, SiGnubash,
} from 'react-icons/si'
import { BiLogoJava } from 'react-icons/bi'
import { VscAzure } from 'react-icons/vsc'
import type { IconType } from 'react-icons'
import IndexLayout from './_layout'
import { INDEX_PATHS } from '../../routes/indexPaths'

type Skill = { name: string; color: string; tooltip: string } & ({ icon: IconType; abbr?: never } | { abbr: string; icon?: never })

const CATEGORIES: { key: 'frontend' | 'backend' | 'tools'; skills: Skill[] }[] = [
    {
        key: 'frontend',
        skills: [
            { name: 'Vue', icon: SiVuedotjs, color: '#4FC08D', tooltip: 'Progressive JS framework for building UIs' },
            { name: 'React', icon: SiReact, color: '#61DAFB', tooltip: 'Component-based UI library by Meta' },
            { name: 'React Native', icon: SiReact, color: '#7EB8CF', tooltip: 'Build native mobile apps using React' },
            { name: 'Quasar', icon: SiQuasar, color: '#1976D2', tooltip: 'Full-stack Vue framework with rich component library' },
            { name: 'HTML', icon: SiHtml5, color: '#E34F26', tooltip: 'Standard markup language for web pages' },
            { name: 'CSS', icon: SiCss, color: '#1572B6', tooltip: 'Stylesheet language for visual presentation' },
            { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E', tooltip: 'Dynamic scripting language of the web' },
            { name: 'TypeScript', icon: SiTypescript, color: '#3178C6', tooltip: 'JavaScript with static type safety' },
            { name: 'SASS', icon: SiSass, color: '#CC6699', tooltip: 'CSS preprocessor with variables and nesting' },
        ],
    },
    {
        key: 'backend',
        skills: [
            { name: 'Node.js', icon: SiNodedotjs, color: '#339933', tooltip: 'JavaScript runtime for server-side development' },
            { name: '.NET', icon: SiDotnet, color: '#512BD4', tooltip: 'Microsoft cross-platform application framework' },
            { name: 'Python', icon: SiPython, color: '#3776AB', tooltip: 'Versatile language for scripting and backends' },
            { name: 'Java', icon: BiLogoJava, color: '#5382A1', tooltip: 'Object-oriented language for enterprise applications' },
            { name: 'C#', abbr: 'C#', color: '#68217A', tooltip: 'Microsoft language for .NET applications' },
            { name: 'MySQL', icon: SiMysql, color: '#4479A1', tooltip: 'Open-source relational database system' },
            { name: 'C/Shell', icon: SiGnubash, color: '#A8B9CC', tooltip: 'Systems programming and Unix shell scripting' },
        ],
    },
    {
        key: 'tools',
        skills: [
            { name: 'Expo', icon: SiExpo, color: '#8B8B8B', tooltip: 'Toolchain for building React Native apps' },
            { name: 'Git', icon: SiGit, color: '#F05032', tooltip: 'Distributed version control system' },
            { name: 'GitHub', icon: SiGithub, color: '#6E5494', tooltip: 'Code hosting and collaboration platform' },
            { name: 'Azure', icon: VscAzure, color: '#0078D4', tooltip: 'Microsoft cloud computing platform' },
            { name: 'Figma', icon: SiFigma, color: '#F24E1E', tooltip: 'Collaborative UI/UX design tool' },
            { name: 'Trello', icon: SiTrello, color: '#0052CC', tooltip: 'Visual project management with boards' },
        ],
    },
]

const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.055 } },
}

const tileVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.92 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.32, ease: 'easeOut' } },
}

export default function Knowledge() {
    const { t } = useTranslation()

    return (
        <IndexLayout id={INDEX_PATHS.KNOWLEDGE} className="flex-col">
            <header className="mb-12 w-full text-center">
                <h2 className="text-3xl font-semibold sm:text-4xl">{t('knowledge.title')}</h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--text-muted)] sm:text-base">
                    {t('knowledge.intro')}
                </p>
            </header>

            <div className="w-full max-w-4xl space-y-10">
                {CATEGORIES.map((cat) => (
                    <div key={cat.key}>
                        <p className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-[var(--text-subtle)]">
                            {t(`knowledge.categories.${cat.key}`)}
                        </p>
                        <motion.div
                            className="flex flex-wrap gap-4"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: '-60px' }}
                        >
                            {cat.skills.map((skill) => (
                                <SkillTile key={skill.name} skill={skill} />
                            ))}
                        </motion.div>
                    </div>
                ))}
            </div>
        </IndexLayout>
    )
}

function SkillTile({ skill }: { skill: Skill }) {
    return (
        <motion.div
            variants={tileVariants}
            className="flex w-[4.75rem] cursor-default flex-col items-center gap-2"
        >
            {/* group scoped to icon only — tooltip won't fire on label hover */}
            <div className="group relative">
                <div
                    className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 w-44 -translate-x-1/2 scale-95 rounded-xl border border-[var(--border)] bg-[var(--surface-card)] px-3 py-2.5 opacity-0 shadow-lg transition-all duration-150 group-hover:scale-100 group-hover:opacity-100"
                    style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.18), 0 0 0 1px var(--border)' }}
                >
                    <p className="mb-1 text-sm font-semibold text-[var(--text)]">{skill.name}</p>
                    <p className="text-sm leading-relaxed text-[var(--text-muted)]">{skill.tooltip}</p>
                    <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-[var(--border)] bg-[var(--surface-card)]" />
                </div>

                <button
                    className="flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg"
                    style={{
                        background: `color-mix(in srgb, ${skill.color} 16%, var(--surface-card))`,
                        boxShadow: `0 0 0 1px color-mix(in srgb, ${skill.color} 28%, transparent)`,
                    }}
                >
                    {skill.icon
                        ? <skill.icon size={26} style={{ color: skill.color }} />
                        : <span className="text-sm font-bold tracking-tight" style={{ color: skill.color }}>{skill.abbr}</span>
                    }
                </button>
            </div>

            <span className="w-full text-center text-sm font-medium leading-tight text-[var(--text-muted)]">
                {skill.name}
            </span>
        </motion.div>
    )
}
