import { useTranslation } from 'react-i18next'
import {
    SiVuedotjs, SiReact, SiExpo, SiQuasar, SiHtml5, SiCss,
    SiJavascript, SiTypescript, SiSass, SiNodedotjs, SiDotnet,
    SiPython, SiMysql, SiGit, SiGithub, SiFigma, SiTrello, SiGnubash,
    SiSupabase, SiAuth0, SiCloudflare, SiRender, SiCloudinary,
} from 'react-icons/si'
import { BiLogoJava } from 'react-icons/bi'
import { VscAzure } from 'react-icons/vsc'
import type { IconType } from 'react-icons'
import IndexLayout from './_layout'
import SectionHeading from '../ui/SectionHeading'
import { INDEX_PATHS } from '../../routes/indexPaths'

type Skill = { name: string; key: string; color: string } & ({ icon: IconType; abbr?: never } | { abbr: string; icon?: never })

const CATEGORIES: { key: 'frontend' | 'backend' | 'tools'; skills: Skill[] }[] = [
    {
        key: 'frontend',
        skills: [
            { name: 'Vue', key: 'vue', icon: SiVuedotjs, color: '#4FC08D' },
            { name: 'React', key: 'react', icon: SiReact, color: '#61DAFB' },
            { name: 'React Native', key: 'reactNative', icon: SiReact, color: '#7EB8CF' },
            { name: 'Quasar', key: 'quasar', icon: SiQuasar, color: '#1976D2' },
            { name: 'HTML', key: 'html', icon: SiHtml5, color: '#E34F26' },
            { name: 'CSS', key: 'css', icon: SiCss, color: '#1572B6' },
            { name: 'JavaScript', key: 'javascript', icon: SiJavascript, color: '#F7DF1E' },
            { name: 'TypeScript', key: 'typescript', icon: SiTypescript, color: '#3178C6' },
            { name: 'SASS', key: 'sass', icon: SiSass, color: '#CC6699' },
        ],
    },
    {
        key: 'backend',
        skills: [
            { name: 'Node.js', key: 'nodejs', icon: SiNodedotjs, color: '#339933' },
            { name: '.NET', key: 'dotnet', icon: SiDotnet, color: '#512BD4' },
            { name: 'Python', key: 'python', icon: SiPython, color: '#3776AB' },
            { name: 'Java', key: 'java', icon: BiLogoJava, color: '#5382A1' },
            { name: 'C#', key: 'csharp', abbr: 'C#', color: '#68217A' },
            { name: 'MySQL', key: 'mysql', icon: SiMysql, color: '#4479A1' },
            { name: 'Supabase', key: 'supabase', icon: SiSupabase, color: '#3FCF8E' },
            { name: 'Auth0', key: 'auth0', icon: SiAuth0, color: '#EB5424' },
            { name: 'C/Shell', key: 'cShell', icon: SiGnubash, color: '#A8B9CC' },
        ],
    },
    {
        key: 'tools',
        skills: [
            { name: 'Expo', key: 'expo', icon: SiExpo, color: '#8B8B8B' },
            { name: 'Git', key: 'git', icon: SiGit, color: '#F05032' },
            { name: 'GitHub', key: 'github', icon: SiGithub, color: '#6E5494' },
            { name: 'Azure', key: 'azure', icon: VscAzure, color: '#0078D4' },
            { name: 'Cloudflare', key: 'cloudflare', icon: SiCloudflare, color: '#F38020' },
            { name: 'Render', key: 'render', icon: SiRender, color: '#46E3B7' },
            { name: 'Cloudinary', key: 'cloudinary', icon: SiCloudinary, color: '#3448C5' },
            { name: 'Figma', key: 'figma', icon: SiFigma, color: '#F24E1E' },
            { name: 'Trello', key: 'trello', icon: SiTrello, color: '#0052CC' },
        ],
    },
]

export default function Knowledge() {
    const { t } = useTranslation()

    return (
        <IndexLayout id={INDEX_PATHS.KNOWLEDGE} band>
            <SectionHeading title={t('knowledge.title')} lead={t('knowledge.intro')} />

            <div className="w-full space-y-12">
                {CATEGORIES.map((cat) => (
                    <div key={cat.key}>
                        {/* The rule carries the grouping, so the label itself can stay
                            quiet and sentence-cased. */}
                        <div className="mb-6 flex items-center gap-4">
                            <p className="shrink-0 text-base font-medium text-[var(--text)]">
                                {t(`knowledge.categories.${cat.key}`)}
                            </p>
                            <span className="h-px flex-1" style={{ background: 'var(--border)' }} aria-hidden="true" />
                        </div>

                        <div className="flex flex-wrap gap-x-5 gap-y-7">
                            {cat.skills.map((skill) => (
                                <SkillTile key={skill.name} skill={skill} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </IndexLayout>
    )
}

function SkillTile({ skill }: { skill: Skill }) {
    const { t } = useTranslation()

    return (
        <div className="flex w-[4.9rem] cursor-default flex-col items-center gap-2.5">
            {/* group scoped to icon only — tooltip won't fire on label hover */}
            <div className="group relative">
                <div
                    className="pebble-sm pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 w-48 -translate-x-1/2 border border-[var(--border)] px-3.5 py-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    style={{ background: 'var(--surface-raised)', boxShadow: 'var(--shadow-lifted)' }}
                >
                    <p className="mb-1 text-sm font-semibold text-[var(--text)]">{skill.name}</p>
                    <p className="text-[13px] leading-relaxed text-[var(--text-muted)]">{t(`knowledge.skills.${skill.key}`)}</p>
                </div>

                <button
                    type="button"
                    aria-label={skill.name}
                    className="pebble-sm flex h-14 w-14 items-center justify-center p-0 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0.28,1)] group-hover:-translate-y-1"
                    style={{
                        background: `color-mix(in srgb, ${skill.color} 14%, var(--surface-card))`,
                        boxShadow: `0 0 0 1px color-mix(in srgb, ${skill.color} 26%, transparent)`,
                    }}
                >
                    {skill.icon
                        ? <skill.icon size={26} style={{ color: skill.color }} aria-hidden="true" />
                        : <span aria-hidden="true" className="text-sm font-bold tracking-tight text-[var(--text)]">{skill.abbr}</span>
                    }
                </button>
            </div>

            <span className="w-full text-center text-[13px] leading-tight text-[var(--text-muted)]">
                {skill.name}
            </span>
        </div>
    )
}
