import IndexLayout from "./_layout";

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
    return (
        <IndexLayout id="about">
            <div className="w-full space-y-6 ">
                <div className="space-y-3 text-center">
                    <h2 className="text-3xl font-semibold sm:text-4xl">Hvem er jeg?</h2>
                    <p className="mx-auto max-w-2xl text-sm leading-6 text-[var(--text-muted)] sm:text-base">
                        En kort versjon av hvem jeg er, hva jeg studerer og hva jeg liker å
                        bruke tiden min på.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <article className="rounded-3xl border border-[var(--border)] bg-[var(--c-surface-card)] p-5 shadow-[var(--shadow)] backdrop-blur-sm sm:p-6">
                        <h3 className="mb-3 text-lg font-semibold">Som student</h3>
                        <p className="text-sm leading-6 text-[var(--text-muted)]">
                            Jeg studerer informatikk med fordypning i design og utvikling av IT-systemer ved Høgskolen i Østfold i Halden.
                            Studiet startet høsten 2023, og jeg fullfører våren 2026. Jeg liker å fordype meg i programmering og bruker
                            fritiden på å utforske Vue, Quasar og andre teknologier.
                        </p>
                    </article>

                    <article className="rounded-3xl border border-[var(--border)] bg-[var(--c-surface-card)] p-5 shadow-[var(--shadow)] backdrop-blur-sm sm:p-6">
                        <h3 className="mb-3 text-lg font-semibold">Som person</h3>
                        <p className="text-sm leading-6 text-[var(--text-muted)]">
                            Jeg er {getAge()} år gammel og bor i Halden. Teknologi har alltid fascinert meg, og jeg liker prosessen med
                            å lære, forbedre meg og finne løsninger som fungerer i praksis. Jeg trives best når jeg kan kombinere
                            kreativitet med struktur.
                        </p>
                    </article>
                </div>

                <article className="rounded-3xl border border-[var(--border)] bg-[var(--c-surface-card)] p-5 text-sm leading-6 text-[var(--text-muted)] shadow-[var(--shadow)] backdrop-blur-sm sm:p-6">
                    <h3 className="mb-3 text-lg font-semibold">På fritiden</h3>
                    <p className="text-sm leading-6 text-[var(--text-muted)]">
                        Ved siden av studiene jobber jeg ofte på Elkjøp som selger. Der får jeg brukt interessen min for teknologi
                        og elektronikk, samtidig som jeg holder meg oppdatert på nye produkter og trender. På fritiden spiller jeg,
                        ser på filmer og serier, er sosial og tar gjerne med dronen eller kameraet mitt ut for å fange motiver i
                        lokalområdet.
                    </p>
                </article>
            </div>
        </IndexLayout>
    );
}
