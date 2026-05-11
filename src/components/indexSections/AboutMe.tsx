import { useTranslation } from 'react-i18next'
import IndexLayout from "./_layout";
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

export default function AboutMe() {
    const { t } = useTranslation()

    return (
        <IndexLayout id={INDEX_PATHS.ABOUT}>
            <div className="w-full space-y-6 ">
                <div className="space-y-3 text-center">
                    <h2 className="text-3xl font-semibold sm:text-4xl">{t('about.title')}</h2>
                    <p className="mx-auto max-w-2xl text-sm leading-6 text-[var(--text-muted)] sm:text-base">
                        {t('about.intro')}
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <article className="rounded-3xl border border-[var(--border)] bg-[var(--c-surface-card)] p-5 shadow-[var(--shadow)] backdrop-blur-sm sm:p-6">
                        <h3 className="mb-3 text-lg font-semibold">{t('about.studentTitle')}</h3>
                        <p className="text-sm leading-6 text-[var(--text-muted)]">
                            {t('about.student')}
                        </p>
                    </article>

                    <article className="rounded-3xl border border-[var(--border)] bg-[var(--c-surface-card)] p-5 shadow-[var(--shadow)] backdrop-blur-sm sm:p-6">
                        <h3 className="mb-3 text-lg font-semibold">{t('about.personTitle')}</h3>
                        <p className="text-sm leading-6 text-[var(--text-muted)]">
                            {t('about.person', { age: getAge() })}
                        </p>
                    </article>
                </div>

                <article className="rounded-3xl border border-[var(--border)] bg-[var(--c-surface-card)] p-5 text-sm leading-6 text-[var(--text-muted)] shadow-[var(--shadow)] backdrop-blur-sm sm:p-6">
                    <h3 className="mb-3 text-lg font-semibold">{t('about.leisureTitle')}</h3>
                    <p className="text-sm leading-6 text-[var(--text-muted)]">
                        {t('about.leisure')}
                    </p>
                </article>
            </div>
        </IndexLayout>
    );
}
