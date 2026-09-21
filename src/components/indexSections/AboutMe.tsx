import { useTranslation } from 'react-i18next'
import { GraduationCap, UserRound, Gamepad2, type LucideIcon } from 'lucide-react'
import IndexLayout from "./_layout";
import SectionHeading from '../ui/SectionHeading'
import { INDEX_PATHS } from '../../routes/indexPaths'

function getAge() {
    const today = new Date();
    const birthDate = new Date(2004, 3, 11);
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const hasHadBirthdayThisYear =
        monthDifference > 0 ||
        (monthDifference === 0 && today.getDate() >= birthDate.getDate());

    return (
        today.getFullYear() -
        birthDate.getFullYear() -
        (hasHadBirthdayThisYear ? 0 : 1)
    );
}

type ArticleProps = {
    icon: LucideIcon
    kicker: string
    title: string
    body: string
}

/**
 * Each card is a page torn from a notebook: the first letter of the text
 * carries the weight, the label sits quietly beside its mark, and the stone
 * shape differs from its neighbours.
 */
function Article({ icon: Icon, kicker, title, body }: ArticleProps) {
    const dropCap = body.slice(0, 1)
    const rest = body.slice(1)

    return (
        <article className="card-organic flex h-full flex-col p-7 md:p-8">
            <div className="mb-4 flex items-center gap-2.5 text-[var(--text-subtle)]">
                <Icon size={16} className="text-[var(--accent-text)]" aria-hidden="true" />
                <span className="text-sm">{kicker}</span>
            </div>

            <h3 className="mb-5">{title}</h3>

            <p className="prose-organic flex-1 text-[15.5px] leading-[1.75] text-[var(--text-muted)]">
                <span
                    className="float-left mr-2.5 mt-1.5 font-sans text-[3.4rem] font-semibold leading-[0.72] text-[var(--accent-text)]"
                    aria-hidden="true"
                >
                    {dropCap}
                </span>
                {rest}
            </p>
        </article>
    )
}

export default function AboutMe() {
    const { t } = useTranslation()

    const student = t('about.student')
    const person = t('about.person', { age: getAge() })
    const leisure = t('about.leisure')

    return (
        <IndexLayout id={INDEX_PATHS.ABOUT}>
            <div className="w-full">
                <SectionHeading title={t('about.title')} lead={t('about.intro')} />

                <div className="pebble-set grid gap-6 md:grid-cols-3">
                    <Article
                        icon={GraduationCap}
                        kicker={t('about.kicker.student')}
                        title={t('about.studentTitle')}
                        body={student}
                    />
                    <Article
                        icon={UserRound}
                        kicker={t('about.kicker.person')}
                        title={t('about.personTitle')}
                        body={person}
                    />
                    <Article
                        icon={Gamepad2}
                        kicker={t('about.kicker.leisure')}
                        title={t('about.leisureTitle')}
                        body={leisure}
                    />
                </div>
            </div>
        </IndexLayout>
    );
}
