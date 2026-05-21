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

type Skill = { name: string; color: string } & ({ icon: IconType; abbr?: never } | { abbr: string; icon?: never })

const CATEGORIES: { key: 'frontend' | 'backend' | 'tools'; skills: Skill[] }[] = [
    {
        key: 'frontend',
        skills: [
            { name: 'Vue', icon: SiVuedotjs, color: '#4FC08D' },
            { name: 'React', icon: SiReact, color: '#61DAFB' },
            { name: 'React Native', icon: SiReact, color: '#7EB8CF' },
            { name: 'Quasar', icon: SiQuasar, color: '#1976D2' },
            { name: 'HTML', icon: SiHtml5, color: '#E34F26' },
            { name: 'CSS', icon: SiCss, color: '#1572B6' },
            { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
            { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
            { name: 'SASS', icon: SiSass, color: '#CC6699' },
        ],
    },
    {
        key: 'backend',
        skills: [
            { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
            { name: '.NET', icon: SiDotnet, color: '#512BD4' },
            { name: 'Python', icon: SiPython, color: '#3776AB' },
            { name: 'Java', icon: BiLogoJava, color: '#5382A1' },
            { name: 'C#', abbr: 'C#', color: '#68217A' },
            { name: 'MySQL', icon: SiMysql, color: '#4479A1' },
            { name: 'C/Shell', icon: SiGnubash, color: '#A8B9CC' },
        ],
    },
    {
        key: 'tools',
        skills: [
            { name: 'Expo', icon: SiExpo, color: '#8B8B8B' },
            { name: 'Git', icon: SiGit, color: '#F05032' },
            { name: 'GitHub', icon: SiGithub, color: '#6E5494' },
            { name: 'Azure', icon: VscAzure, color: '#0078D4' },
            { name: 'Figma', icon: SiFigma, color: '#F24E1E' },
            { name: 'Trello', icon: SiTrello, color: '#0052CC' },
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
                        <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--text-subtle)]">
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
            <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{
                    background: `color-mix(in srgb, ${skill.color} 16%, var(--surface-card))`,
                    boxShadow: `0 0 0 1px color-mix(in srgb, ${skill.color} 28%, transparent)`,
                }}
            >
                {skill.icon
                    ? <skill.icon size={26} style={{ color: skill.color }} />
                    : <span className="text-sm font-bold tracking-tight" style={{ color: skill.color }}>{skill.abbr}</span>
                }
            </div>
            <span className="w-full text-center text-[11px] font-medium leading-tight text-[var(--text-muted)]">
                {skill.name}
            </span>
        </motion.div>
    )
}
