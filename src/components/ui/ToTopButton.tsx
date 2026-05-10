import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ToTopButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 300);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Tilbake til toppen"
            title="Tilbake til toppen"
            className={`
        fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40
                inline-flex items-center gap-3 rounded-full border px-3 py-3 sm:px-4
        shadow-2xl transition-all duration-200
        hover:-translate-y-0.5
        ${visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
            style={{
                background: "var(--c-surface)",
                borderColor: "var(--c-border)",
                color: "var(--c-text)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow: "0 18px 50px rgba(0, 0, 0, 0.18)",
            }}
        >
            <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: "var(--c-accent)", color: "#fff" }}
            >
                <ArrowUp size={18} />
            </span>

            <span className="hidden flex-col sm:flex">
                <span
                    className="text-xs font-semibold uppercase tracking-[0.14em]"
                    style={{ color: "var(--c-text-muted)" }}
                >
                    Tilbake til
                </span>
                <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--c-text)" }}
                >
                    Toppen
                </span>
            </span>
        </button>
    );
}