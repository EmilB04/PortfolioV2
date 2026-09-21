import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useTranslation } from 'react-i18next'

export default function ToTopButton() {
    const { t } = useTranslation()
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > window.innerHeight * 5.5);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label={t('toTop.aria')}
            title={t('toTop.title')}
            className={`
        pebble-sm fixed bottom-4 right-4 z-40 md:bottom-6 md:right-6
        inline-flex items-center gap-3 border px-3 py-3 md:px-4
        transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0.28,1)]
        hover:-translate-y-0.5
        ${visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
            style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--text)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow: "var(--shadow-lifted)",
            }}
        >
            <span
                className="pebble-sm inline-flex h-10 w-10 items-center justify-center"
                style={{ background: "var(--accent)", color: "var(--on-accent)" }}
            >
                <ArrowUp size={18} aria-hidden="true" />
            </span>

            <span className="hidden flex-col md:flex">
                <span
                    className="text-xs"
                    style={{ color: "var(--text-subtle)" }}
                >
                    {t('toTop.prefix')}
                </span>
                <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--text)" }}
                >
                    {t('toTop.label')}
                </span>
            </span>
        </button>
    );
}