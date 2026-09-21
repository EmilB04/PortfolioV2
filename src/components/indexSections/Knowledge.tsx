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
            { name: 'Supabase', icon: SiSupabase, color: '#3FCF8E', tooltip: 'Postgres backend with auth, storage and edge functions' },
            { name: 'Auth0', icon: SiAuth0, color: '#EB5424', tooltip: 'Managed authentication and authorization platform' },
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
            { name: 'Cloudflare', icon: SiCloudflare, color: '#F38020', tooltip: 'CDN, DNS and edge compute platform' },
            { name: 'Render', icon: SiRender, color: '#46E3B7', tooltip: 'Cloud hosting for web services and databases' },
            { name: 'Cloudinary', icon: SiCloudinary, color: '#3448C5', tooltip: 'Media storage with on-the-fly image optimization' },
            { name: 'Figma', icon: SiFigma, color: '#F24E1E', tooltip: 'Collaborative UI/UX design tool' },
            { name: 'Trello', icon: SiTrello, color: '#0052CC', tooltip: 'Visual project management with boards' },
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
    return (
        <div className="flex w-[4.9rem] cursor-default flex-col items-center gap-2.5">
            {/* group scoped to icon only — tooltip won't fire on label hover */}
            <div className="group relative">
                <div
                    className="pebble-sm pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 w-48 -translate-x-1/2 border border-[var(--border)] px-3.5 py-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    style={{ background: 'var(--surface-raised)', boxShadow: 'var(--shadow-lifted)' }}
                >
                    <p className="mb-1 text-sm font-semibold text-[var(--text)]">{skill.name}</p>
                    <p className="text-[13px] leading-relaxed text-[var(--text-muted)]">{skill.tooltip}</p>
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
