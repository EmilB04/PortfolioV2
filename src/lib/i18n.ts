import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const SUPPORTED_LANGUAGES = [
    { code: 'no', label: 'Norsk' },
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
] as const

// ─── Norwegian ────────────────────────────────────────────
const no: typeof en = {
    nav: {
        projects: "Prosjekter",
        about: "Om meg",
        contact: "Kontakt",
    },
    home: {
        title: "Hei — jeg er Emil",
        subtitle:
            "Jeg bygger webapper med React, TypeScript og Supabase.",
    },
    projects: {
        title: "Prosjekter",
        loading: "Laster…",
    },
    about: {
        title: "Om meg",
    },
    contact: {
        title: "Kontakt",
        name: "Navn",
        email: "E-post",
        message: "Melding",
        send: "Send",
        sending: "Sender…",
        sent: "Sendt — takk!",
        error: "Feil ved sending av melding.",
    },
};


// ─── English ──────────────────────────────────────────────
const en = {
    nav: {
        projects: "Projects",
        about: "About",
        contact: "Contact",
    },
    home: {
        title: "Hi — I'm Emil",
        subtitle: "I build web apps with React, TypeScript and Supabase.",
    },
    projects: {
        title: "Projects",
        loading: "Loading…",
    },
    about: {
        title: "About",
    },
    contact: {
        title: "Contact",
        name: "Name",
        email: "Email",
        message: "Message",
        send: "Send",
        sending: "Sending…",
        sent: "Sent — thanks!",
        error: "Error sending message.",
    },
};

// ─── Spanish ──────────────────────────────────────────────
const es: typeof en = {
    nav: {
        projects: "Proyectos",
        about: "Acerca de",
        contact: "Contacto",
    },
    home: {
        title: "Hola — Soy Emil",
        subtitle:
            "Construyo aplicaciones web con React, TypeScript y Supabase.",
    },
    projects: {
        title: "Proyectos",
        loading: "Cargando…",
    },
    about: {
        title: "Acerca de",
    },
    contact: {
        title: "Contacto",
        name: "Nombre",
        email: "Correo",
        message: "Mensaje",
        send: "Enviar",
        sending: "Enviando…",
        sent: "¡Enviado — gracias!",
        error: "Error al enviar el mensaje.",
    },
};

// ─── Init ─────────────────────────────────────────────────
i18n.use(initReactI18next).init({
    resources: {
        no: { translation: no },
        en: { translation: en },
        es: { translation: es },
    },
    supportedLngs: SUPPORTED_LANGUAGES.map((language) => language.code),
    load: 'languageOnly',
    lng: "no",
    fallbackLng: "no",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;