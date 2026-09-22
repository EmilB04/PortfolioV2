import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { readPreference } from './cookieConsent'

export const SUPPORTED_LANGUAGES = [
    { code: 'no', label: 'Norsk' },
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
] as const

/** The language the prerendered HTML is baked in. */
export const PRERENDER_LANGUAGE = 'no'

/** For visitors whose browser asks for no language the site supports. */
export const FALLBACK_LANGUAGE = 'en'

/** First of the browser's preferred languages the site supports, else English.
 *  Norwegian arrives as `nb` (Bokmål) or `nn` (Nynorsk) as often as `no`.
 *  The prerender has no browser to ask, so it stays on PRERENDER_LANGUAGE. */
function detectBrowserLanguage(): string {
    if (typeof window === 'undefined') return PRERENDER_LANGUAGE

    const supported = new Set<string>(SUPPORTED_LANGUAGES.map((language) => language.code))
    const preferred = navigator.languages?.length ? navigator.languages : [navigator.language]

    for (const tag of preferred) {
        const base = tag?.toLowerCase().split('-')[0]
        const code = base === 'nb' || base === 'nn' ? 'no' : base
        if (code && supported.has(code)) return code
    }
    return FALLBACK_LANGUAGE
}

const en = {
    nav: {
        home: 'Home',
        about: 'About me',
        domains: 'Domains',
        timeline: 'Timeline',
        contact: 'Contact',
        projects: 'Projects',
        knowledge: 'Knowledge',
        certifications: 'Courses',
        gitHub: 'GitHub',
    },
    header: {
        navigation: 'Navigation',
        settings: 'Settings',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
        skipToContent: 'Skip to content',
    },
    languageSwitcher: {
        section: 'Language',
        choose: 'Choose language',
    },
    themeSwitcher: {
        light: 'Light',
        dark: 'Dark',
        system: 'System',
    },
    settingsMenu: {
        appearance: 'Appearance',
        accentColor: 'Accent color',
        chooseAccent: 'Choose accent color',
    },
    cookieConsent: {
        section: 'Privacy',
        message: 'This site uses cookies to remember your theme, accent color and language. Nothing is shared with third parties.',
        accept: 'Accept',
        decline: 'Decline',
        manage: 'Change cookie preferences',
        statusAccepted: 'Preferences are being saved on this device.',
        statusDeclined: 'Preferences are not saved. Your choices only apply to this session.',
        statusUndecided: "You haven't made a choice yet.",
    },
    contactButton: {
        label: 'Contact me',
    },
    backButton: {
        aria: 'Back to home',
        label: 'Back',
    },
    footer: {
        tagline: 'Available for collaboration and new projects',
        github: 'See source code on GitHub',
        madeBy: 'Made with ❤️ by',
    },
    aiWidget: {
        assistant: 'AI assistant',
        title: 'Ask me anything',
        description: 'Ask me about Emil, his projects, skills, or anything else!',
        close: 'Close',
        open: 'Open AI assistant',
        closed: 'Close AI assistant',
        teaser: 'Ask me anything',
        placeholder: 'Ask me something…',
        inputLabel: 'Message input',
        send: 'Send',
        welcome: 'Hi! I\'m Emil\'s AI assistant. Ask me about his projects, skills, or background — or anything else!',
        thinking: 'Thinking…',
        error: 'Something went wrong. Try again.',
        newChat: 'New chat',
        disclaimer: 'Responses may contain errors or hallucinations.',
        suggestionsTitle: 'Try asking',
        suggestions: {
            s1: 'Who is Emil?',
            s2: 'What projects has he built?',
            s3: 'Which technologies does he work with?',
            s4: 'How can I get in touch?',
        },
        stop: 'Stop',
        retry: 'Retry',
        copy: 'Copy message',
        copied: 'Copied',
        scrollToBottom: 'Jump to latest',
        expand: 'Expand panel',
        collapse: 'Shrink panel',
        you: 'You',
    },
    toTop: {
        aria: 'Back to top',
        title: 'Back to top',
        prefix: 'Back to',
        label: 'Top',
    },
    home: {
        title: 'Hi! I am Emil Berglund',
        roles: [
            'Master student in AI',
            'Computer science student',
            'Full-stack developer',
            'Frontend developer',
            'Backend developer',
            'AI interested',
        ],
        intro:
            'I am a person with an interest in technology and a goal of learning and developing myself. I believe there are multiple ways to reach a goal or find a solution. ',
        githubAria: 'GitHub profile',
        linkedinAria: 'LinkedIn profile',
        cta: 'Take a look',
        location: 'Halden, Norway',
    },
    about: {
        title: 'Who am I?',
        intro: 'A short version of who I am, what I study, and what I like to spend my time on.',
        studentTitle: 'As a student',
        student:
            'I completed a bachelor in informatics — design and development of IT systems, with a specialization in programming — at Østfold University of Applied Sciences in Halden (2023–2026). From autumn 2026 I am taking a master in applied computer science at the same place, specializing in artificial intelligence.',
        personTitle: 'As a person',
        person:
            'I am {{age}} years old and live in Halden. Technology has always fascinated me, and I enjoy the process of learning, improving, and finding solutions that work in practice.',
        leisureTitle: 'In my free time',
        leisure:
            'Besides my studies, I work at Elkjøp as a service advisor. There I get to use my interest in technology and electronics while staying up to date with new products and trends. In my free time I like to play games, watch films and series, or bring my drone or camera out to capture scenes in the local area.',
        kicker: {
            student: 'Education',
            person: 'Personal',
            leisure: 'Off The Clock',
        },
    },
    showcase: {
        title: 'Live domains',
        intro: 'Sites I have built and keep online.',
        goToSlide: 'Go to slide {{number}}',
        status: 'Live',
        visit: 'Visit site',
        browserLabel: 'Browser preview',
        prev: 'Previous',
        next: 'Next',
        items: [
            {
                title: 'SpillArena',
                description: 'The arena where your games come together. A collection of online games you can play directly in the browser — no download required.',
                tags: ['Web games', 'Bot opponent', 'Norwegian / English'],
                url: 'spillarena.no',
                logoAlt: 'SpillArena logo',
                previewAlt: 'SpillArena website preview',
            },
            {
                title: "Emil's Tools",
                description: 'A handy collection of personal and developer utilities, all in one place.',
                tags: ['Utilities', 'Developer tools'],
                url: 'tools.emilb.no',
                logoAlt: 'Tools logo',
                previewAlt: 'Tools website preview',
            },
        ],
    },
    timeline: {
        title: 'Timeline',
        intro: 'An overview of the courses I have completed during my studies at HiØ.',
        loading: 'Loading timeline…',
        error: 'Could not load timeline: {{error}}',
        semesterLabel: 'Semester {{number}}',
        semesterLabelMaster: 'Semester {{number}} (master)',
        stats: {
            years: 'Years of IT education',
            courses: 'Courses completed',
            institution: 'Østfold University of Applied Sciences',
        },
        seasons: {
            spring: 'Spring',
            autumn: 'Autumn',
        },
        degrees: {
            bachelor: {
                kicker: 'Start of studies',
                title: 'Bachelor in informatics',
                description:
                    'Design and development of IT systems, specializing in programming. Østfold University of Applied Sciences, 2023-2026.',
            },
            master: {
                kicker: 'New chapter',
                title: 'Master in applied computer science',
                description:
                    'Specializing in artificial intelligence. Østfold University of Applied Sciences, 2026-2028.',
            },
        },
        items: [
            {
                time: '2023',
                title: 'Started studying',
                description: 'Began my computer science degree in Halden.',
            },
            {
                time: '2024',
                title: 'Built portfolio features',
                description: 'Shipped new sections, routing and motion across the site.',
            },
            {
                time: '2025',
                title: 'Kept learning',
                description: 'Explored TypeScript, React and practical product work.',
            },
            {
                time: '2026',
                title: 'Bachelor done, master next',
                description: 'Completed my bachelor in June and started a master in applied computer science with a specialization in AI.',
            },
        ],
    },
    projectsSection: {
        title: 'Selected projects',
        intro: 'An overview of projects I have worked on during my studies, including both school and personal projects.',
        cta: 'See all projects',
        visitSite: 'Visit site',
    },
    projectsPage: {
        title: 'My projects',
        subtitle: 'Explore my projects and see what I have been working on',
        loading: 'Loading…',
        empty: 'No projects found.',
    },
    projectCard: {
        github: 'GitHub',
        live: 'Live',
        sourceCode: 'Source code',
        readMore: 'Read more',
    },
    projectDetails: {
        notFound: 'Project not found.',
        stack: 'Tech stack',
        tags: 'Tags',
    },
    contactPage: {
        title: 'Let us get in touch',
        subtitle: 'Have questions or want to collaborate? Feel free to reach out!',
        cards: {
            linkedin: {
                title: 'LinkedIn',
                description: 'Connect with my network',
                button: 'CONTACT',
            },
            github: {
                title: 'GitHub',
                description: 'See my projects and contributions',
                button: 'VIEW PROFILE',
            },
            email: {
                title: 'Email',
                description: 'Send me a direct message',
                button: 'SEND EMAIL',
                compose: 'New message',
                subject: "Let's build something together",
            },
        },
    },
    knowledge: {
        title: 'Skills & Technologies',
        intro: 'Technologies and tools I have experience with across frontend, backend, and tooling.',
        categories: {
            frontend: 'Frontend',
            backend: 'Backend',
            tools: 'Tools & Platforms',
        },
    },
    certifications: {
        title: 'Courses & Certifications',
        intro: 'Internal courses and certifications I have completed, spanning compliance, sales, services, and systems.',
        switcherLabel: 'Course provider',
        totalLabel: '{{count}} completed courses',
        courseCount_one: '{{count}} course',
        courseCount_other: '{{count}} courses',
        categories: {
            compliance: 'Compliance',
            hr: 'HR',
            b2b: 'B2B',
            services: 'Services',
            system: 'System',
            program: 'Program',
            selfDev: 'Self Development',
            sales: 'Sales',
            intro: 'Introduction',
            other: 'Products & Other',
        },
    },
    github: {
        title: 'GitHub',
        intro: 'Some of my most active repositories. Visit my profile to see everything.',
        noDescription: 'No description available.',
        loading: 'Loading repositories…',
        loadError: 'Could not load GitHub data. Try again later.',
        rateLimited: "GitHub's public API rate limit has been hit for this network — this section will work again once it resets, usually within an hour.",
        viewRepo: 'View repository',
        visitProfile: 'Go to GitHub',
        followers: 'followers',
        publicRepos: 'public repos',
        recentActivity: 'Recent activity',
        pushedTo: 'Pushed to {{repo}}',
        prOpened: 'Opened',
        prMerged: 'Merged',
        prClosed: 'Closed',
        prReopened: 'Reopened',
    },
}

type TranslationSchema = typeof en

const no: TranslationSchema = {
    nav: {
        home: 'Hjem',
        about: 'Om meg',
        domains: 'Domener',
        timeline: 'Tidslinje',
        contact: 'Kontakt',
        projects: 'Prosjekter',
        knowledge: 'Kunnskap',
        certifications: 'Kurs',
        gitHub: 'GitHub',
    },
    header: {
        navigation: 'Navigasjon',
        settings: 'Innstillinger',
        openMenu: 'Åpne meny',
        closeMenu: 'Lukk meny',
        skipToContent: 'Hopp til innhold',
    },
    languageSwitcher: {
        section: 'Språk',
        choose: 'Velg språk',
    },
    themeSwitcher: {
        light: 'Lys',
        dark: 'Mørk',
        system: 'System',
    },
    settingsMenu: {
        appearance: 'Utseende',
        accentColor: 'Aksentfarge',
        chooseAccent: 'Velg aksentfarge',
    },
    cookieConsent: {
        section: 'Personvern',
        message: 'Dette nettstedet bruker informasjonskapsler for å huske tema, aksentfarge og språk. Ingenting deles med tredjeparter.',
        accept: 'Godta',
        decline: 'Avslå',
        manage: 'Endre cookie-innstillinger',
        statusAccepted: 'Valgene dine lagres på denne enheten.',
        statusDeclined: 'Valgene dine lagres ikke. De gjelder kun for denne økten.',
        statusUndecided: 'Du har ikke tatt et valg ennå.',
    },
    contactButton: {
        label: 'Ta kontakt',
    },
    backButton: {
        aria: 'Tilbake til forsiden',
        label: 'Tilbake',
    },
    footer: {
        tagline: 'Tilgjengelig for samarbeid og nye prosjekter',
        github: 'Se kildekode på GitHub',
        madeBy: 'Laget med ❤️ av',
    },
    aiWidget: {
        assistant: 'AI-assistent',
        title: 'Spør meg om hva som helst',
        description: 'Spør meg om Emil, prosjektene hans, ferdigheter eller annet!',
        close: 'Lukk',
        open: 'Åpne AI-assistent',
        closed: 'Lukk AI-assistent',
        teaser: 'Spør meg om hva som helst',
        placeholder: 'Spør meg noe…',
        inputLabel: 'Meldingsfelt',
        send: 'Send',
        welcome: 'Hei! Jeg er Emils AI-assistent. Spør meg om prosjektene, ferdighetene eller bakgrunnen hans — eller hva som helst annet!',
        thinking: 'Tenker…',
        error: 'Noe gikk galt. Prøv igjen.',
        newChat: 'Ny chat',
        disclaimer: 'Svar kan inneholde feil eller hallusinasjoner.',
        suggestionsTitle: 'Prøv å spørre',
        suggestions: {
            s1: 'Hvem er Emil?',
            s2: 'Hvilke prosjekter har han laget?',
            s3: 'Hvilke teknologier jobber han med?',
            s4: 'Hvordan kan jeg ta kontakt?',
        },
        stop: 'Stopp',
        retry: 'Prøv igjen',
        copy: 'Kopier melding',
        copied: 'Kopiert',
        scrollToBottom: 'Hopp til nyeste',
        expand: 'Utvid panel',
        collapse: 'Forminsk panel',
        you: 'Du',
    },
    toTop: {
        aria: 'Tilbake til toppen',
        title: 'Tilbake til toppen',
        prefix: 'Tilbake til',
        label: 'Toppen',
    },
    home: {
        title: 'Hei! Jeg er Emil Berglund',
        roles: [
            'Masterstudent i KI',
            'Informatikkstudent',
            'Fullstackutvikler',
            'Frontendutvikler',
            'Backendutvikler',
            'KI interessert',
        ],
        intro:

            'Jeg er en person med interesse for teknologi og har et mål om å lære og utvikle meg. Jeg mener det finnes flere måter å nå et mål eller finne en løsning på. ',
        githubAria: 'GitHub-profil',
        linkedinAria: 'LinkedIn-profil',
        cta: 'Ta en titt',
        location: 'Halden, Norge',
    },
    about: {
        title: 'Hvem er jeg?',
        intro: 'En kort versjon av hvem jeg er, hva jeg studerer og hva jeg liker å bruke tiden min på.',
        studentTitle: 'Som student',
        student:
            'Jeg fullførte bachelor i informatikk - design og utvikling av IT-systemer, med fordypning i programmering, ved Høgskolen i Østfold i Halden (2023-2026). Fra høsten 2026 tar jeg master i anvendt informatikk samme sted, med fordypning i kunstig intelligens (KI).',
        personTitle: 'Som person',
        person:
            'Jeg er {{age}} år gammel og bor i Halden. Teknologi har alltid fascinert meg, og jeg liker prosessen med å lære, forbedre meg og finne løsninger som fungerer i praksis.',
        leisureTitle: 'På fritiden',
        leisure:
            'Ved siden av studiene jobber jeg på Elkjøp som servicerådgiver. Der får jeg brukt interessen min for teknologi og elektronikk, samtidig som jeg holder meg oppdatert på nye produkter og trender. På fritiden liker jeg å spille, se på filmer og serier, eller ta med dronen eller kameraet ut for å fange motiver i nærområdet.',
        kicker: {
            student: 'Utdanning',
            person: 'Personlig',
            leisure: 'Fritid',
        },
    },
    showcase: {
        title: 'Domener i drift',
        intro: 'Nettsteder jeg har bygget og holder i drift.',
        goToSlide: 'Gå til slide {{number}}',
        status: 'Live',
        visit: 'Besøk siden',
        browserLabel: 'Nettleserforhåndsvisning',
        prev: 'Forrige',
        next: 'Neste',
        items: [
            {
                title: 'SpillArena',
                description: 'Arenaen hvor spillene dine samles. En samling av nettbaserte spill du kan spille direkte i nettleseren — ingen nedlasting nødvendig.',
                tags: ['Nettspill', 'Bot-motstander', 'Norsk / engelsk'],
                url: 'spillarena.no',
                logoAlt: 'SpillArena-logo',
                previewAlt: 'Forhåndsvisning av SpillArena-nettsiden',
            },
            {
                title: 'Emils verktøy',
                description: 'En praktisk samling av personlige verktøy og utviklerverktøy, samlet på ett sted.',
                tags: ['Verktøy', 'Utviklerverktøy'],
                url: 'tools.emilb.no',
                logoAlt: 'Verktøy-logo',
                previewAlt: 'Forhåndsvisning av verktøy-nettsiden',
            },
        ],
    },
    timeline: {
        title: 'Tidslinje',
        intro: 'En oversikt over emnene jeg har gjennomført under studiene mine på HiØ.',
        loading: 'Laster tidslinje…',
        error: 'Kunne ikke laste tidslinje: {{error}}',
        semesterLabel: '{{number}}. semester',
        semesterLabelMaster: '{{number}}. semester (master)',
        stats: {
            years: 'År med IT-utdanning',
            courses: 'Emner fullført',
            institution: 'Høgskolen i Østfold',
        },
        seasons: {
            spring: 'Vår',
            autumn: 'Høst',
        },
        degrees: {
            bachelor: {
                kicker: 'Studiestart',
                title: 'Bachelor i informatikk',
                description:
                    'Design og utvikling av IT-systemer, med fordypning i programmering. Høgskolen i Østfold, 2023-2026.',
            },
            master: {
                kicker: 'Nytt kapittel',
                title: 'Master i anvendt informatikk',
                description:
                    'Med fordypning i kunstig intelligens. Høgskolen i Østfold, 2026-2028.',
            },
        },
        items: [
            {
                time: '2023',
                title: 'Startet studiene',
                description: 'Startet på informatikkstudiet mitt i Halden.',
            },
            {
                time: '2024',
                title: 'Bygde porteføljefunksjoner',
                description: 'Lever­te nye seksjoner, routing og animasjoner på siden.',
            },
            {
                time: '2025',
                title: 'Fortsatte å lære',
                description: 'Utforsket TypeScript, React og praktisk produktarbeid.',
            },
            {
                time: '2026',
                title: 'Bachelor ferdig, master neste',
                description: 'Fullførte bacheloren i juni og startet på master i anvendt informatikk med fordypning i KI.',
            },
        ],
    },
    projectsSection: {
        title: 'Utvalgte prosjekter',
        intro: 'En oversikt over prosjekter jeg har jobbet med under studiene. Dette inkluderer både skoleprosjekter og personlige prosjekter.',
        cta: 'Se alle prosjekter',
        visitSite: 'Besøk siden',
    },
    projectsPage: {
        title: 'Mine prosjekter',
        subtitle: 'Utforsk mine prosjekter og se hva jeg har jobbet med',
        loading: 'Laster…',
        empty: 'Ingen prosjekter funnet.',
    },
    projectCard: {
        github: 'GitHub',
        live: 'Live',
        sourceCode: 'Kildekode',
        readMore: 'Les mer',
    },
    projectDetails: {
        notFound: 'Prosjekt ikke funnet.',
        stack: 'Teknologi',
        tags: 'Stikkord',
    },
    contactPage: {
        title: 'La oss komme i kontakt',
        subtitle: 'Har du spørsmål eller vil du samarbeide? Ta gjerne kontakt!',
        cards: {
            linkedin: {
                title: 'LinkedIn',
                description: 'Koble deg til mitt nettverk',
                button: 'KONTAKT',
            },
            github: {
                title: 'GitHub',
                description: 'Se mine prosjekter og bidrag',
                button: 'SE PROFIL',
            },
            email: {
                title: 'E-post',
                description: 'Send meg en melding direkte',
                button: 'SEND E-POST',
                compose: 'Ny melding',
                subject: 'La oss bygge noe sammen',
            },
        },
    },
    knowledge: {
        title: 'Ferdigheter & teknologier',
        intro: 'Teknologier og verktøy jeg har erfaring med innen frontend, backend og verktøy.',
        categories: {
            frontend: 'Frontend',
            backend: 'Backend',
            tools: 'Verktøy & plattformer',
        },
    },
    certifications: {
        title: 'Kurs & sertifiseringer',
        intro: 'Interne kurs og sertifiseringer jeg har fullført, innen compliance, salg, tjenester og systemer.',
        switcherLabel: 'Kurssted',
        totalLabel: '{{count}} fullførte kurs',
        courseCount_one: '{{count}} kurs',
        courseCount_other: '{{count}} kurs',
        categories: {
            compliance: 'Compliance',
            hr: 'HR',
            b2b: 'B2B',
            services: 'Tjenester',
            system: 'System',
            program: 'Program',
            selfDev: 'Egenutvikling',
            sales: 'Salg',
            intro: 'Introduksjon',
            other: 'Produkter & annet',
        },
    },
    github: {
        title: 'GitHub',
        intro: 'Noen av mine mest aktive repositories. Besøk profilen min for å se alt.',
        noDescription: 'Ingen beskrivelse tilgjengelig.',
        loading: 'Laster repositories…',
        loadError: 'Kunne ikke laste GitHub-data. Prøv igjen senere.',
        rateLimited: 'GitHubs offentlige API-grense er nådd for dette nettverket — denne seksjonen fungerer igjen når grensen tilbakestilles, vanligvis innen en time.',
        viewRepo: 'Se repository',
        visitProfile: 'Gå til GitHub',
        followers: 'følgere',
        publicRepos: 'offentlige repos',
        recentActivity: 'Nylig aktivitet',
        pushedTo: 'Pushet til {{repo}}',
        prOpened: 'Åpnet',
        prMerged: 'Slått sammen',
        prClosed: 'Lukket',
        prReopened: 'Gjenåpnet',
    },
}

const es: TranslationSchema = {
    nav: {
        home: 'Inicio',
        about: 'Sobre mí',
        domains: 'Dominios',
        timeline: 'Cronología',
        contact: 'Contacto',
        projects: 'Proyectos',
        knowledge: 'Conocimientos',
        certifications: 'Cursos',
        gitHub: 'GitHub',
    },
    header: {
        navigation: 'Navegación',
        settings: 'Ajustes',
        openMenu: 'Abrir menú',
        closeMenu: 'Cerrar menú',
        skipToContent: 'Saltar al contenido',
    },
    languageSwitcher: {
        section: 'Idioma',
        choose: 'Elegir idioma',
    },
    themeSwitcher: {
        light: 'Claro',
        dark: 'Oscuro',
        system: 'Sistema',
    },
    settingsMenu: {
        appearance: 'Apariencia',
        accentColor: 'Color de acento',
        chooseAccent: 'Elegir color de acento',
    },
    cookieConsent: {
        section: 'Privacidad',
        message: 'Este sitio usa cookies para recordar tu tema, color de acento e idioma. No se comparte nada con terceros.',
        accept: 'Aceptar',
        decline: 'Rechazar',
        manage: 'Cambiar preferencias de cookies',
        statusAccepted: 'Tus preferencias se están guardando en este dispositivo.',
        statusDeclined: 'Tus preferencias no se guardan. Solo aplican a esta sesión.',
        statusUndecided: 'Todavía no has tomado una decisión.',
    },
    contactButton: {
        label: 'Contáctame',
    },
    backButton: {
        aria: 'Volver al inicio',
        label: 'Volver',
    },
    footer: {
        tagline: 'Disponible para colaborar y nuevos proyectos',
        github: 'Ver el código fuente en GitHub',
        madeBy: 'Hecho con ❤️ por',
    },
    aiWidget: {
        assistant: 'Asistente de IA',
        title: 'Pregúntame lo que quieras',
        description: '¡Pregúntame sobre Emil, sus proyectos, habilidades o cualquier otra cosa!',
        close: 'Cerrar',
        open: 'Abrir asistente de IA',
        closed: 'Cerrar asistente de IA',
        teaser: 'Pregúntame lo que quieras',
        placeholder: 'Pregúntame algo…',
        inputLabel: 'Campo de mensaje',
        send: 'Enviar',
        welcome: '¡Hola! Soy el asistente de IA de Emil. ¡Pregúntame sobre sus proyectos, habilidades o su trayectoria — o cualquier otra cosa!',
        thinking: 'Pensando…',
        error: 'Algo salió mal. Inténtalo de nuevo.',
        newChat: 'Nueva conversación',
        disclaimer: 'Las respuestas pueden contener errores o alucinaciones.',
        suggestionsTitle: 'Prueba a preguntar',
        suggestions: {
            s1: '¿Quién es Emil?',
            s2: '¿Qué proyectos ha creado?',
            s3: '¿Con qué tecnologías trabaja?',
            s4: '¿Cómo puedo contactarlo?',
        },
        stop: 'Detener',
        retry: 'Reintentar',
        copy: 'Copiar mensaje',
        copied: 'Copiado',
        scrollToBottom: 'Ir a lo último',
        expand: 'Ampliar panel',
        collapse: 'Reducir panel',
        you: 'Tú',
    },
    toTop: {
        aria: 'Volver arriba',
        title: 'Volver arriba',
        prefix: 'Volver a',
        label: 'Arriba',
    },
    home: {
        title: 'Hola. Soy Emil Berglund',
        roles: [
            'Estudiante de máster en IA',
            'Estudiante de informática',
            'Desarrollador full-stack',
            'Desarrollador frontend',
            'Desarrollador backend',
            'Interesado en IA',
        ],
        intro:
            'Soy una persona con interés por la tecnología y con el objetivo de aprender y desarrollarme. Creo que hay varias maneras de alcanzar un objetivo o encontrar una solución. ',
        githubAria: 'Perfil de GitHub',
        linkedinAria: 'Perfil de LinkedIn',
        cta: 'Echa un vistazo',
        location: 'Halden, Noruega',
    },
    about: {
        title: '¿Quién soy?',
        intro: 'Una versión breve de quién soy, qué estudio y en qué me gusta emplear mi tiempo.',
        studentTitle: 'Como estudiante',
        student:
            'Terminé el grado en informática — diseño y desarrollo de sistemas informáticos, con especialización en programación — en Østfold University of Applied Sciences, en Halden (2023–2026). Desde otoño de 2026 curso un máster en informática aplicada en el mismo centro, con especialización en inteligencia artificial.',
        personTitle: 'Como persona',
        person:
            'Tengo {{age}} años y vivo en Halden. La tecnología siempre me ha fascinado, y disfruto del proceso de aprender, mejorar y encontrar soluciones que funcionen en la práctica.',
        leisureTitle: 'En mi tiempo libre',
        leisure:
            'Además de mis estudios, trabajo en Elkjøp como asesor de servicio. Allí puedo aprovechar mi interés por la tecnología y la electrónica, al mismo tiempo que me mantengo al día con nuevos productos y tendencias. En mi tiempo libre me gusta jugar, ver películas y series, o sacar el dron o la cámara para capturar escenas de la zona.',
        kicker: {
            student: 'Educación',
            person: 'Personal',
            leisure: 'Tiempo libre',
        },
    },
    showcase: {
        title: 'Dominios activos',
        intro: 'Sitios que he creado y mantengo en línea.',
        goToSlide: 'Ir a la diapositiva {{number}}',
        status: 'En vivo',
        visit: 'Visitar sitio',
        browserLabel: 'Vista previa del navegador',
        prev: 'Anterior',
        next: 'Siguiente',
        items: [
            {
                title: 'SpillArena',
                description: 'La arena donde se reúnen tus juegos. Una colección de juegos en línea que puedes jugar directamente en el navegador, sin descargas.',
                tags: ['Juegos web', 'Oponente bot', 'Noruego / inglés'],
                url: 'spillarena.no',
                logoAlt: 'Logotipo de SpillArena',
                previewAlt: 'Vista previa del sitio web de SpillArena',
            },
            {
                title: 'Herramientas de Emil',
                description: 'Una práctica colección de utilidades personales y para desarrolladores, todo en un solo lugar.',
                tags: ['Utilidades', 'Herramientas para desarrolladores'],
                url: 'tools.emilb.no',
                logoAlt: 'Logotipo de herramientas',
                previewAlt: 'Vista previa del sitio de herramientas',
            },
        ],
    },
    timeline: {
        title: 'Cronología',
        intro: 'Una visión general de las asignaturas que he completado durante mis estudios en HiØ.',
        loading: 'Cargando cronología…',
        error: 'No se pudo cargar la cronología: {{error}}',
        semesterLabel: 'Semestre {{number}}',
        semesterLabelMaster: 'Semestre {{number}} (máster)',
        stats: {
            years: 'Años de formación en TI',
            courses: 'Asignaturas completadas',
            institution: 'Østfold University of Applied Sciences',
        },
        seasons: {
            spring: 'Primavera',
            autumn: 'Otoño',
        },
        degrees: {
            bachelor: {
                kicker: 'Inicio de los estudios',
                title: 'Grado en informática',
                description:
                    'Diseño y desarrollo de sistemas informáticos, con especialización en programación. Østfold University of Applied Sciences, 2023-2026.',
            },
            master: {
                kicker: 'Nuevo capítulo',
                title: 'Máster en informática aplicada',
                description:
                    'Con especialización en inteligencia artificial. Østfold University of Applied Sciences, 2026-2028.',
            },
        },
        items: [
            {
                time: '2023',
                title: 'Comencé los estudios',
                description: 'Empecé mi carrera de informática en Halden.',
            },
            {
                time: '2024',
                title: 'Construí funciones del portafolio',
                description: 'Publiqué nuevas secciones, rutas y animaciones en el sitio.',
            },
            {
                time: '2025',
                title: 'Seguí aprendiendo',
                description: 'Exploré TypeScript, React y trabajo práctico de producto.',
            },
            {
                time: '2026',
                title: 'Grado terminado, máster a la vista',
                description: 'Terminé el grado en junio y empecé un máster en informática aplicada con especialización en IA.',
            },
        ],
    },
    projectsSection: {
        title: 'Proyectos destacados',
        intro: 'Un resumen de los proyectos en los que he trabajado durante mis estudios, incluyendo proyectos escolares y personales.',
        cta: 'Ver todos los proyectos',
        visitSite: 'Visitar sitio',
    },
    projectsPage: {
        title: 'Mis proyectos',
        subtitle: 'Explora mis proyectos y mira en qué he estado trabajando',
        loading: 'Cargando…',
        empty: 'No se encontraron proyectos.',
    },
    projectCard: {
        github: 'GitHub',
        live: 'En vivo',
        sourceCode: 'Código fuente',
        readMore: 'Leer más',
    },
    projectDetails: {
        notFound: 'Proyecto no encontrado.',
        stack: 'Tecnologías',
        tags: 'Etiquetas',
    },
    contactPage: {
        title: 'Pongámonos en contacto',
        subtitle: '¿Tienes preguntas o quieres colaborar? No dudes en escribirme.',
        cards: {
            linkedin: {
                title: 'LinkedIn',
                description: 'Conéctate con mi red',
                button: 'CONTACTAR',
            },
            github: {
                title: 'GitHub',
                description: 'Mira mis proyectos y contribuciones',
                button: 'VER PERFIL',
            },
            email: {
                title: 'Correo',
                description: 'Envíame un mensaje directo',
                button: 'ENVIAR CORREO',
                compose: 'Nuevo mensaje',
                subject: 'Construyamos algo juntos',
            },
        },
    },
    knowledge: {
        title: 'Habilidades & tecnologías',
        intro: 'Tecnologías y herramientas con las que tengo experiencia en frontend, backend y herramientas.',
        categories: {
            frontend: 'Frontend',
            backend: 'Backend',
            tools: 'Herramientas & plataformas',
        },
    },
    certifications: {
        title: 'Cursos & certificaciones',
        intro: 'Cursos y certificaciones internas que he completado, sobre cumplimiento, ventas, servicios y sistemas.',
        switcherLabel: 'Proveedor de cursos',
        totalLabel: '{{count}} cursos completados',
        courseCount_one: '{{count}} curso',
        courseCount_other: '{{count}} cursos',
        categories: {
            compliance: 'Cumplimiento',
            hr: 'RR. HH.',
            b2b: 'B2B',
            services: 'Servicios',
            system: 'Sistemas',
            program: 'Programa',
            selfDev: 'Desarrollo personal',
            sales: 'Ventas',
            intro: 'Introducción',
            other: 'Productos & otros',
        },
    },
    github: {
        title: 'GitHub',
        intro: 'Algunos de mis repositorios más activos. Visita mi perfil para verlos todos.',
        noDescription: 'Sin descripción disponible.',
        loading: 'Cargando repositorios…',
        loadError: 'No se pudieron cargar los datos de GitHub. Inténtalo de nuevo más tarde.',
        rateLimited: 'Se alcanzó el límite de la API pública de GitHub para esta red — esta sección volverá a funcionar cuando se restablezca, normalmente en menos de una hora.',
        viewRepo: 'Ver repositorio',
        visitProfile: 'Ir a GitHub',
        followers: 'seguidores',
        publicRepos: 'repos públicos',
        recentActivity: 'Actividad reciente',
        pushedTo: 'Envió cambios a {{repo}}',
        prOpened: 'Abrió',
        prMerged: 'Fusionó',
        prClosed: 'Cerró',
        prReopened: 'Reabrió',
    },
}

const de: TranslationSchema = {
    nav: {
        home: 'Start',
        about: 'Über mich',
        domains: 'Domains',
        timeline: 'Zeitleiste',
        contact: 'Kontakt',
        projects: 'Projekte',
        knowledge: 'Kenntnisse',
        certifications: 'Kurse',
        gitHub: 'GitHub',
    },
    header: {
        navigation: 'Navigation',
        settings: 'Einstellungen',
        openMenu: 'Menü öffnen',
        closeMenu: 'Menü schließen',
        skipToContent: 'Zum Inhalt springen',
    },
    languageSwitcher: {
        section: 'Sprache',
        choose: 'Sprache wählen',
    },
    themeSwitcher: {
        light: 'Hell',
        dark: 'Dunkel',
        system: 'System',
    },
    settingsMenu: {
        appearance: 'Darstellung',
        accentColor: 'Akzentfarbe',
        chooseAccent: 'Akzentfarbe wählen',
    },
    cookieConsent: {
        section: 'Datenschutz',
        message: 'Diese Seite verwendet Cookies, um dein Design, deine Akzentfarbe und deine Sprache zu speichern. Nichts wird an Dritte weitergegeben.',
        accept: 'Akzeptieren',
        decline: 'Ablehnen',
        manage: 'Cookie-Einstellungen ändern',
        statusAccepted: 'Einstellungen werden auf diesem Gerät gespeichert.',
        statusDeclined: 'Einstellungen werden nicht gespeichert. Deine Auswahl gilt nur für diese Sitzung.',
        statusUndecided: 'Du hast noch keine Auswahl getroffen.',
    },
    contactButton: {
        label: 'Kontaktiere mich',
    },
    backButton: {
        aria: 'Zurück zur Startseite',
        label: 'Zurück',
    },
    footer: {
        tagline: 'Offen für Zusammenarbeit und neue Projekte',
        github: 'Quellcode auf GitHub ansehen',
        madeBy: 'Mit ❤️ gemacht von',
    },
    aiWidget: {
        assistant: 'KI-Assistent',
        title: 'Frag mich etwas',
        description: 'Frag mich nach Emil, seinen Projekten, Fähigkeiten oder etwas anderem!',
        close: 'Schließen',
        open: 'KI-Assistent öffnen',
        closed: 'KI-Assistent schließen',
        teaser: 'Frag mich etwas',
        placeholder: 'Frag mich etwas…',
        inputLabel: 'Nachrichteneingabe',
        send: 'Senden',
        welcome: 'Hallo! Ich bin Emils KI-Assistent. Frag mich nach seinen Projekten, Fähigkeiten oder seinem Hintergrund – oder nach etwas ganz anderem!',
        thinking: 'Denke nach…',
        error: 'Etwas ist schiefgelaufen. Versuch es erneut.',
        newChat: 'Neuer Chat',
        disclaimer: 'Antworten können Fehler oder Halluzinationen enthalten.',
        suggestionsTitle: 'Probier mal',
        suggestions: {
            s1: 'Wer ist Emil?',
            s2: 'Welche Projekte hat er gebaut?',
            s3: 'Mit welchen Technologien arbeitet er?',
            s4: 'Wie kann ich ihn kontaktieren?',
        },
        stop: 'Stopp',
        retry: 'Erneut versuchen',
        copy: 'Nachricht kopieren',
        copied: 'Kopiert',
        scrollToBottom: 'Zur neuesten Nachricht',
        expand: 'Fenster vergrößern',
        collapse: 'Fenster verkleinern',
        you: 'Du',
    },
    toTop: {
        aria: 'Nach oben',
        title: 'Nach oben',
        prefix: 'Zurück nach',
        label: 'Oben',
    },
    home: {
        title: 'Hallo! Ich bin Emil Berglund',
        roles: [
            'Masterstudent in KI',
            'Informatikstudent',
            'Full-Stack-Entwickler',
            'Frontend-Entwickler',
            'Backend-Entwickler',
            'KI-interessiert',
        ],
        intro:
            'Ich bin ein technikbegeisterter Mensch mit dem Ziel, stets dazuzulernen und mich weiterzuentwickeln. Ich glaube, dass es mehrere Wege gibt, ein Ziel zu erreichen oder eine Lösung zu finden. ',
        githubAria: 'GitHub-Profil',
        linkedinAria: 'LinkedIn-Profil',
        cta: 'Schau es dir an',
        location: 'Halden, Norwegen',
    },
    about: {
        title: 'Wer bin ich?',
        intro: 'Eine Kurzfassung davon, wer ich bin, was ich studiere und womit ich meine Zeit gerne verbringe.',
        studentTitle: 'Als Student',
        student:
            'Ich habe einen Bachelor in Informatik – Design und Entwicklung von IT-Systemen mit Schwerpunkt Programmierung – an der Hochschule Østfold in Halden abgeschlossen (2023–2026). Seit Herbst 2026 studiere ich dort im Master angewandte Informatik mit Schwerpunkt künstliche Intelligenz.',
        personTitle: 'Als Person',
        person:
            'Ich bin {{age}} Jahre alt und wohne in Halden. Technologie hat mich schon immer fasziniert, und ich mag den Prozess, zu lernen, besser zu werden und Lösungen zu finden, die in der Praxis funktionieren.',
        leisureTitle: 'In meiner Freizeit',
        leisure:
            'Neben dem Studium arbeite ich bei Elkjøp als Serviceberater. Dort kann ich mein Interesse für Technik und Elektronik einsetzen und bleibe bei neuen Produkten und Trends auf dem Laufenden. In meiner Freizeit spiele ich gerne, schaue Filme und Serien oder nehme meine Drohne oder Kamera mit, um Motive in der Umgebung einzufangen.',
        kicker: {
            student: 'Ausbildung',
            person: 'Persönlich',
            leisure: 'Nach Feierabend',
        },
    },
    showcase: {
        title: 'Live-Domains',
        intro: 'Seiten, die ich gebaut habe und online halte.',
        goToSlide: 'Zu Folie {{number}}',
        status: 'Live',
        visit: 'Seite besuchen',
        browserLabel: 'Browser-Vorschau',
        prev: 'Zurück',
        next: 'Weiter',
        items: [
            {
                title: 'SpillArena',
                description: 'Die Arena, in der deine Spiele zusammenkommen. Eine Sammlung von Online-Spielen, die du direkt im Browser spielen kannst – ganz ohne Download.',
                tags: ['Webspiele', 'Bot-Gegner', 'Norwegisch / Englisch'],
                url: 'spillarena.no',
                logoAlt: 'SpillArena-Logo',
                previewAlt: 'Vorschau der SpillArena-Website',
            },
            {
                title: "Emil's Tools",
                description: 'Eine praktische Sammlung persönlicher Tools und Entwicklerwerkzeuge an einem Ort.',
                tags: ['Hilfsprogramme', 'Entwicklertools'],
                url: 'tools.emilb.no',
                logoAlt: 'Tools-Logo',
                previewAlt: 'Vorschau der Tools-Website',
            },
        ],
    },
    timeline: {
        title: 'Zeitleiste',
        intro: 'Ein Überblick über die Kurse, die ich während meines Studiums an der HiØ abgeschlossen habe.',
        loading: 'Zeitleiste wird geladen…',
        error: 'Zeitleiste konnte nicht geladen werden: {{error}}',
        semesterLabel: '{{number}}. Semester',
        semesterLabelMaster: '{{number}}. Semester (Master)',
        stats: {
            years: 'Jahre IT-Ausbildung',
            courses: 'Abgeschlossene Kurse',
            institution: 'Hochschule Østfold',
        },
        seasons: {
            spring: 'Frühjahr',
            autumn: 'Herbst',
        },
        degrees: {
            bachelor: {
                kicker: 'Studienbeginn',
                title: 'Bachelor in Informatik',
                description:
                    'Design und Entwicklung von IT-Systemen mit Schwerpunkt Programmierung. Hochschule Østfold, 2023–2026.',
            },
            master: {
                kicker: 'Neues Kapitel',
                title: 'Master in angewandter Informatik',
                description:
                    'Schwerpunkt künstliche Intelligenz. Hochschule Østfold, 2026–2028.',
            },
        },
        items: [
            {
                time: '2023',
                title: 'Studium begonnen',
                description: 'Mit dem Informatikstudium in Halden angefangen.',
            },
            {
                time: '2024',
                title: 'Portfolio-Funktionen gebaut',
                description: 'Neue Bereiche, Routing und Animationen auf der Seite umgesetzt.',
            },
            {
                time: '2025',
                title: 'Weiter gelernt',
                description: 'TypeScript, React und praktische Produktarbeit vertieft.',
            },
            {
                time: '2026',
                title: 'Bachelor fertig, Master als Nächstes',
                description: 'Im Juni meinen Bachelor abgeschlossen und einen Master in angewandter Informatik mit Schwerpunkt KI begonnen.',
            },
        ],
    },
    projectsSection: {
        title: 'Ausgewählte Projekte',
        intro: 'Ein Überblick über Projekte, an denen ich während meines Studiums gearbeitet habe – sowohl Studien- als auch private Projekte.',
        cta: 'Alle Projekte ansehen',
        visitSite: 'Seite besuchen',
    },
    projectsPage: {
        title: 'Meine Projekte',
        subtitle: 'Entdecke meine Projekte und sieh dir an, woran ich gearbeitet habe',
        loading: 'Wird geladen…',
        empty: 'Keine Projekte gefunden.',
    },
    projectCard: {
        github: 'GitHub',
        live: 'Live',
        sourceCode: 'Quellcode',
        readMore: 'Mehr lesen',
    },
    projectDetails: {
        notFound: 'Projekt nicht gefunden.',
        stack: 'Tech-Stack',
        tags: 'Tags',
    },
    contactPage: {
        title: 'Lass uns in Kontakt treten',
        subtitle: 'Hast du Fragen oder möchtest zusammenarbeiten? Melde dich gerne!',
        cards: {
            linkedin: {
                title: 'LinkedIn',
                description: 'Vernetze dich mit mir',
                button: 'KONTAKT',
            },
            github: {
                title: 'GitHub',
                description: 'Sieh dir meine Projekte und Beiträge an',
                button: 'PROFIL ANSEHEN',
            },
            email: {
                title: 'E-Mail',
                description: 'Schick mir eine direkte Nachricht',
                button: 'E-MAIL SENDEN',
                compose: 'Neue Nachricht',
                subject: 'Lass uns gemeinsam etwas bauen',
            },
        },
    },
    knowledge: {
        title: 'Fähigkeiten & Technologien',
        intro: 'Technologien und Werkzeuge, mit denen ich in Frontend, Backend und Tooling Erfahrung habe.',
        categories: {
            frontend: 'Frontend',
            backend: 'Backend',
            tools: 'Tools & Plattformen',
        },
    },
    certifications: {
        title: 'Kurse & Zertifikate',
        intro: 'Interne Kurse und Zertifikate, die ich abgeschlossen habe – von Compliance über Vertrieb und Services bis zu Systemen.',
        switcherLabel: 'Kursanbieter',
        totalLabel: '{{count}} abgeschlossene Kurse',
        courseCount_one: '{{count}} Kurs',
        courseCount_other: '{{count}} Kurse',
        categories: {
            compliance: 'Compliance',
            hr: 'Personal',
            b2b: 'B2B',
            services: 'Services',
            system: 'System',
            program: 'Programm',
            selfDev: 'Persönliche Entwicklung',
            sales: 'Vertrieb',
            intro: 'Einführung',
            other: 'Produkte & Sonstiges',
        },
    },
    github: {
        title: 'GitHub',
        intro: 'Einige meiner aktivsten Repositories. Besuche mein Profil, um alles zu sehen.',
        noDescription: 'Keine Beschreibung verfügbar.',
        loading: 'Repositories werden geladen…',
        loadError: 'GitHub-Daten konnten nicht geladen werden. Versuch es später erneut.',
        rateLimited: 'Das Limit der öffentlichen GitHub-API wurde für dieses Netzwerk erreicht – dieser Bereich funktioniert wieder, sobald es zurückgesetzt wird, meist innerhalb einer Stunde.',
        viewRepo: 'Repository ansehen',
        visitProfile: 'Zu GitHub',
        followers: 'Follower',
        publicRepos: 'öffentliche Repos',
        recentActivity: 'Letzte Aktivität',
        pushedTo: 'Push nach {{repo}}',
        prOpened: 'Geöffnet',
        prMerged: 'Gemergt',
        prClosed: 'Geschlossen',
        prReopened: 'Wieder geöffnet',
    },
}

const fr: TranslationSchema = {
    nav: {
        home: 'Accueil',
        about: 'À propos',
        domains: 'Domaines',
        timeline: 'Parcours',
        contact: 'Contact',
        projects: 'Projets',
        knowledge: 'Compétences',
        certifications: 'Formations',
        gitHub: 'GitHub',
    },
    header: {
        navigation: 'Navigation',
        settings: 'Paramètres',
        openMenu: 'Ouvrir le menu',
        closeMenu: 'Fermer le menu',
        skipToContent: 'Aller au contenu',
    },
    languageSwitcher: {
        section: 'Langue',
        choose: 'Choisir la langue',
    },
    themeSwitcher: {
        light: 'Clair',
        dark: 'Sombre',
        system: 'Système',
    },
    settingsMenu: {
        appearance: 'Apparence',
        accentColor: "Couleur d'accent",
        chooseAccent: "Choisir la couleur d'accent",
    },
    cookieConsent: {
        section: 'Confidentialité',
        message: "Ce site utilise des cookies pour mémoriser votre thème, votre couleur d'accent et votre langue. Rien n'est partagé avec des tiers.",
        accept: 'Accepter',
        decline: 'Refuser',
        manage: 'Modifier les préférences de cookies',
        statusAccepted: 'Vos préférences sont enregistrées sur cet appareil.',
        statusDeclined: "Vos préférences ne sont pas enregistrées. Vos choix ne valent que pour cette session.",
        statusUndecided: "Vous n'avez pas encore fait de choix.",
    },
    contactButton: {
        label: 'Me contacter',
    },
    backButton: {
        aria: "Retour à l'accueil",
        label: 'Retour',
    },
    footer: {
        tagline: 'Disponible pour des collaborations et de nouveaux projets',
        github: 'Voir le code source sur GitHub',
        madeBy: 'Fait avec ❤️ par',
    },
    aiWidget: {
        assistant: 'Assistant IA',
        title: 'Posez-moi une question',
        description: "Posez-moi des questions sur Emil, ses projets, ses compétences ou n'importe quoi d'autre !",
        close: 'Fermer',
        open: "Ouvrir l'assistant IA",
        closed: "Fermer l'assistant IA",
        teaser: 'Posez-moi une question',
        placeholder: 'Posez-moi une question…',
        inputLabel: 'Saisie du message',
        send: 'Envoyer',
        welcome: "Bonjour ! Je suis l'assistant IA d'Emil. Posez-moi des questions sur ses projets, ses compétences ou son parcours — ou sur tout autre sujet !",
        thinking: 'Réflexion…',
        error: "Une erreur s'est produite. Réessayez.",
        newChat: 'Nouvelle discussion',
        disclaimer: 'Les réponses peuvent contenir des erreurs ou des hallucinations.',
        suggestionsTitle: 'Essayez de demander',
        suggestions: {
            s1: 'Qui est Emil ?',
            s2: "Quels projets a-t-il réalisés ?",
            s3: 'Avec quelles technologies travaille-t-il ?',
            s4: 'Comment le contacter ?',
        },
        stop: 'Arrêter',
        retry: 'Réessayer',
        copy: 'Copier le message',
        copied: 'Copié',
        scrollToBottom: 'Aller au dernier message',
        expand: 'Agrandir le panneau',
        collapse: 'Réduire le panneau',
        you: 'Vous',
    },
    toTop: {
        aria: 'Retour en haut',
        title: 'Retour en haut',
        prefix: 'Retour en',
        label: 'Haut',
    },
    home: {
        title: 'Bonjour ! Je suis Emil Berglund',
        roles: [
            'Étudiant en master IA',
            'Étudiant en informatique',
            'Développeur full-stack',
            'Développeur frontend',
            'Développeur backend',
            "Passionné d'IA",
        ],
        intro:
            "Je suis passionné de technologie, avec l'envie d'apprendre et de progresser. Je crois qu'il existe plusieurs chemins pour atteindre un objectif ou trouver une solution. ",
        githubAria: 'Profil GitHub',
        linkedinAria: 'Profil LinkedIn',
        cta: 'Jetez un œil',
        location: 'Halden, Norvège',
    },
    about: {
        title: 'Qui suis-je ?',
        intro: "Une version courte de qui je suis, de ce que j'étudie et de ce que j'aime faire de mon temps.",
        studentTitle: 'En tant qu’étudiant',
        student:
            "J'ai obtenu une licence en informatique — conception et développement de systèmes informatiques, spécialisation programmation — à l'Université des sciences appliquées d'Østfold à Halden (2023–2026). Depuis l'automne 2026, j'y suis un master en informatique appliquée, spécialisé en intelligence artificielle.",
        personTitle: 'En tant que personne',
        person:
            "J'ai {{age}} ans et j'habite à Halden. La technologie m'a toujours fasciné, et j'aime le fait d'apprendre, de m'améliorer et de trouver des solutions qui fonctionnent en pratique.",
        leisureTitle: 'Pendant mon temps libre',
        leisure:
            "En parallèle de mes études, je travaille chez Elkjøp comme conseiller service. J'y mets à profit mon intérêt pour la technologie et l'électronique tout en suivant les nouveaux produits et tendances. Pendant mon temps libre, j'aime jouer aux jeux vidéo, regarder des films et des séries, ou sortir mon drone ou mon appareil photo pour capturer des paysages des environs.",
        kicker: {
            student: 'Formation',
            person: 'Personnel',
            leisure: 'Hors du travail',
        },
    },
    showcase: {
        title: 'Domaines en ligne',
        intro: "Des sites que j'ai créés et que je maintiens en ligne.",
        goToSlide: 'Aller à la diapositive {{number}}',
        status: 'En ligne',
        visit: 'Visiter le site',
        browserLabel: 'Aperçu du navigateur',
        prev: 'Précédent',
        next: 'Suivant',
        items: [
            {
                title: 'SpillArena',
                description: "L'arène où vos jeux se retrouvent. Une collection de jeux en ligne jouables directement dans le navigateur — sans téléchargement.",
                tags: ['Jeux web', 'Adversaire bot', 'Norvégien / Anglais'],
                url: 'spillarena.no',
                logoAlt: 'Logo SpillArena',
                previewAlt: 'Aperçu du site SpillArena',
            },
            {
                title: "Emil's Tools",
                description: "Une collection pratique d'outils personnels et pour développeurs, réunis au même endroit.",
                tags: ['Utilitaires', 'Outils de développement'],
                url: 'tools.emilb.no',
                logoAlt: 'Logo Tools',
                previewAlt: 'Aperçu du site Tools',
            },
        ],
    },
    timeline: {
        title: 'Parcours',
        intro: "Un aperçu des cours que j'ai suivis pendant mes études à HiØ.",
        loading: 'Chargement du parcours…',
        error: 'Impossible de charger le parcours : {{error}}',
        semesterLabel: 'Semestre {{number}}',
        semesterLabelMaster: 'Semestre {{number}} (master)',
        stats: {
            years: "Années d'études en informatique",
            courses: 'Cours validés',
            institution: "Université des sciences appliquées d'Østfold",
        },
        seasons: {
            spring: 'Printemps',
            autumn: 'Automne',
        },
        degrees: {
            bachelor: {
                kicker: 'Début des études',
                title: 'Licence en informatique',
                description:
                    "Conception et développement de systèmes informatiques, spécialisation programmation. Université des sciences appliquées d'Østfold, 2023-2026.",
            },
            master: {
                kicker: 'Nouveau chapitre',
                title: 'Master en informatique appliquée',
                description:
                    "Spécialisation en intelligence artificielle. Université des sciences appliquées d'Østfold, 2026-2028.",
            },
        },
        items: [
            {
                time: '2023',
                title: 'Début des études',
                description: "J'ai commencé mes études d'informatique à Halden.",
            },
            {
                time: '2024',
                title: 'Nouvelles fonctionnalités du portfolio',
                description: 'Ajout de nouvelles sections, du routage et des animations sur le site.',
            },
            {
                time: '2025',
                title: "Toujours en apprentissage",
                description: 'Approfondissement de TypeScript, React et du travail produit concret.',
            },
            {
                time: '2026',
                title: 'Licence terminée, place au master',
                description: "Licence obtenue en juin, puis début d'un master en informatique appliquée avec une spécialisation en IA.",
            },
        ],
    },
    projectsSection: {
        title: 'Projets sélectionnés',
        intro: "Un aperçu des projets sur lesquels j'ai travaillé pendant mes études, qu'ils soient scolaires ou personnels.",
        cta: 'Voir tous les projets',
        visitSite: 'Visiter le site',
    },
    projectsPage: {
        title: 'Mes projets',
        subtitle: 'Découvrez mes projets et ce sur quoi je travaille',
        loading: 'Chargement…',
        empty: 'Aucun projet trouvé.',
    },
    projectCard: {
        github: 'GitHub',
        live: 'En ligne',
        sourceCode: 'Code source',
        readMore: 'En savoir plus',
    },
    projectDetails: {
        notFound: 'Projet introuvable.',
        stack: 'Stack technique',
        tags: 'Tags',
    },
    contactPage: {
        title: 'Restons en contact',
        subtitle: "Des questions ou envie de collaborer ? N'hésitez pas à me contacter !",
        cards: {
            linkedin: {
                title: 'LinkedIn',
                description: 'Rejoignez mon réseau',
                button: 'CONTACTER',
            },
            github: {
                title: 'GitHub',
                description: 'Découvrez mes projets et contributions',
                button: 'VOIR LE PROFIL',
            },
            email: {
                title: 'E-mail',
                description: 'Envoyez-moi un message direct',
                button: 'ENVOYER UN E-MAIL',
                compose: 'Nouveau message',
                subject: 'Construisons quelque chose ensemble',
            },
        },
    },
    knowledge: {
        title: 'Compétences & Technologies',
        intro: "Les technologies et outils avec lesquels j'ai de l'expérience, côté frontend, backend et outillage.",
        categories: {
            frontend: 'Frontend',
            backend: 'Backend',
            tools: 'Outils & Plateformes',
        },
    },
    certifications: {
        title: 'Formations & Certifications',
        intro: "Formations internes et certifications que j'ai validées, couvrant conformité, vente, services et systèmes.",
        switcherLabel: 'Organisme de formation',
        totalLabel: '{{count}} formations validées',
        courseCount_one: '{{count}} formation',
        courseCount_other: '{{count}} formations',
        categories: {
            compliance: 'Conformité',
            hr: 'RH',
            b2b: 'B2B',
            services: 'Services',
            system: 'Système',
            program: 'Programme',
            selfDev: 'Développement personnel',
            sales: 'Vente',
            intro: 'Introduction',
            other: 'Produits & autres',
        },
    },
    github: {
        title: 'GitHub',
        intro: 'Quelques-uns de mes dépôts les plus actifs. Visitez mon profil pour tout voir.',
        noDescription: 'Aucune description disponible.',
        loading: 'Chargement des dépôts…',
        loadError: 'Impossible de charger les données GitHub. Réessayez plus tard.',
        rateLimited: "La limite de l'API publique de GitHub a été atteinte pour ce réseau — cette section fonctionnera de nouveau après sa réinitialisation, généralement en moins d'une heure.",
        viewRepo: 'Voir le dépôt',
        visitProfile: 'Aller sur GitHub',
        followers: 'abonnés',
        publicRepos: 'dépôts publics',
        recentActivity: 'Activité récente',
        pushedTo: 'Push vers {{repo}}',
        prOpened: 'Ouverte',
        prMerged: 'Fusionnée',
        prClosed: 'Fermée',
        prReopened: 'Rouverte',
    },
}

i18n.use(initReactI18next).init({
    resources: {
        no: { translation: no },
        en: { translation: en },
        es: { translation: es },
        de: { translation: de },
        fr: { translation: fr },
    },
    supportedLngs: SUPPORTED_LANGUAGES.map((language) => language.code),
    load: 'languageOnly',
    lng: readPreference('portfolio-lang') ?? detectBrowserLanguage(),
    fallbackLng: FALLBACK_LANGUAGE,
    interpolation: {
        escapeValue: false,
    },
})

function applyHtmlLang(lng: string) {
    if (typeof document !== 'undefined') {
        document.documentElement.lang = lng
    }
}
applyHtmlLang(i18n.resolvedLanguage ?? i18n.language)
i18n.on('languageChanged', applyHtmlLang)

export default i18n