import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

export const SUPPORTED_LANGUAGES = [
    { code: 'no', label: 'Norsk' },
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
] as const

const en = {
    nav: {
        home: 'Home',
        about: 'About me',
        domains: 'Domains',
        timeline: 'Timeline',
        contact: 'Contact',
        projects: 'Projects',
        knowledge: 'Knowledge',
        gitHub: 'GitHub',
    },
    header: {
        navigation: 'Navigation',
        settings: 'Settings',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
    },
    languageSwitcher: {
        section: 'Language',
        choose: 'Choose language',
    },
    themeSwitcher: {
        light: 'Switch to light mode',
        dark: 'Switch to dark mode',
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
        updated: 'Last updated: {{month}} {{year}}',
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
        send: 'Send',
        welcome: 'Hi! I\'m Emil\'s AI assistant. Ask me about his projects, skills, or background — or anything else!',
        thinking: 'Thinking…',
        error: 'Something went wrong. Try again.',
    },
    toTop: {
        aria: 'Back to top',
        title: 'Back to top',
        prefix: 'Back to',
        label: 'Top',
    },
    home: {
        title: 'Hi! I am Emil Berglund',
        roles: ['Computer science student', 'Full-stack developer', 'Frontend developer', 'Backend developer'],
        intro:
            'I am a person with a passion for technology and a desire to learn and grow. I believe there are multiple ways to reach a goal or find a solution, and I enjoy exploring innovative approaches to tackle challenges.',
        githubAria: 'GitHub profile',
        linkedinAria: 'LinkedIn profile',
        cta: 'Take a look',
    },
    about: {
        title: 'Who am I?',
        intro: 'A short version of who I am, what I study, and what I like to spend my time on.',
        studentTitle: 'As a student',
        student:
            'I study computer science with a specialization in design and development of IT systems at Østfold University College in Halden. The program started in autumn 2023, and I finish in spring 2026. I like diving into programming and spend my free time exploring Vue, Quasar, and other technologies.',
        personTitle: 'As a person',
        person:
            'I am {{age}} years old and live in Halden. Technology has always fascinated me, and I enjoy the process of learning, improving, and finding solutions that work in practice. I thrive best when I can combine creativity with structure.',
        leisureTitle: 'In my free time',
        leisure:
            'Besides my studies, I often work at Elkjøp as a sales associate. There I get to use my interest in technology and electronics while staying up to date with new products and trends. In my free time I play games, watch films and series, socialize, and often bring my drone or camera out to capture scenes in the local area.',
    },
    showcase: {
        title: 'SpillArena',
        status: 'Live',
        description:
            'The arena where your games come together. A collection of online games you can play directly in the browser — no download required.',
        tags: ['Web games', 'Bot opponent', 'Norwegian / English'],
        visit: 'Visit site',
        browserLabel: 'Browser preview',
        logoAlt: 'SpillArena logo',
        previewAlt: 'SpillArena website preview',
        url: 'spillarena.no',
    },
    timeline: {
        title: 'Timeline',
        intro: 'An overview of the courses I have completed during my studies at HiØ.',
        loading: 'Loading timeline…',
        error: 'Could not load timeline: {{error}}',
        semesterLabel: 'Semester {{number}}',
        seasons: {
            spring: 'Spring',
            autumn: 'Autumn',
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
                title: 'Looking ahead',
                description: 'Finishing my studies and preparing for the next role.',
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
        readMore: 'Read more',
    },
    projectDetails: {
        title: 'Project title',
        description:
            'This is a detailed description of the project. It includes the technologies used, the challenges faced, and the outcomes achieved.',
        techTitle: 'Technologies used',
        highlightsTitle: 'Project highlights',
        highlight:
            'This project was particularly challenging due to [specific challenge], but it was rewarding to see it come together successfully.',
        back: 'Back to Projects',
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
        gitHub: 'GitHub',
    },
    header: {
        navigation: 'Navigasjon',
        settings: 'Innstillinger',
        openMenu: 'Åpne meny',
        closeMenu: 'Lukk meny',
    },
    languageSwitcher: {
        section: 'Språk',
        choose: 'Velg språk',
    },
    themeSwitcher: {
        light: 'Bytt til lys modus',
        dark: 'Bytt til mørk modus',
    },
    contactButton: {
        label: 'Kontakt meg',
    },
    backButton: {
        aria: 'Tilbake til forsiden',
        label: 'Tilbake',
    },
    footer: {
        tagline: 'Tilgjengelig for samarbeid og nye prosjekter',
        github: 'Se kildekode på GitHub',
        madeBy: 'Laget med ❤️ av',
        updated: 'Sist oppdatert: {{month}} {{year}}',
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
        send: 'Send',
        welcome: 'Hei! Jeg er Emils AI-assistent. Spør meg om prosjektene, ferdighetene eller bakgrunnen hans — eller hva som helst annet!',
        thinking: 'Tenker…',
        error: 'Noe gikk galt. Prøv igjen.',
    },
    toTop: {
        aria: 'Tilbake til toppen',
        title: 'Tilbake til toppen',
        prefix: 'Tilbake til',
        label: 'Toppen',
    },
    home: {
        title: 'Hei! Jeg er Emil Berglund',
        roles: ['Informatikkstudent', 'Fullstackutvikler', 'Frontendutvikler', 'Backendutvikler'],
        intro:
            'Jeg er en person med lidenskap for teknologi og et ønske om å lære og vokse. Jeg tror det finnes flere måter å nå et mål eller finne en løsning på, og jeg liker å utforske innovative tilnærminger for å takle utfordringer.',
        githubAria: 'GitHub-profil',
        linkedinAria: 'LinkedIn-profil',
        cta: 'Ta en titt',
    },
    about: {
        title: 'Hvem er jeg?',
        intro: 'En kort versjon av hvem jeg er, hva jeg studerer og hva jeg liker å bruke tiden min på.',
        studentTitle: 'Som student',
        student:
            'Jeg studerer informatikk med fordypning i design og utvikling av IT-systemer ved Høgskolen i Østfold i Halden. Studiet startet høsten 2023, og jeg fullfører våren 2026. Jeg liker å fordype meg i programmering og bruker fritiden på å utforske Vue, Quasar og andre teknologier.',
        personTitle: 'Som person',
        person:
            'Jeg er {{age}} år gammel og bor i Halden. Teknologi har alltid fascinert meg, og jeg liker prosessen med å lære, forbedre meg og finne løsninger som fungerer i praksis. Jeg trives best når jeg kan kombinere kreativitet med struktur.',
        leisureTitle: 'På fritiden',
        leisure:
            'Ved siden av studiene jobber jeg ofte på Elkjøp som selger. Der får jeg brukt interessen min for teknologi og elektronikk, samtidig som jeg holder meg oppdatert på nye produkter og trender. På fritiden spiller jeg, ser på filmer og serier, er sosial og tar gjerne med dronen eller kameraet mitt ut for å fange motiver i lokalområdet.',
    },
    showcase: {
        title: 'SpillArena',
        status: 'Live',
        description:
            'Arenaen hvor spillene dine samles. En samling av nettbaserte spill du kan spille direkte i nettleseren — ingen nedlasting nødvendig.',
        tags: ['Nettspill', 'Bot-motstander', 'Norsk / engelsk'],
        visit: 'Besøk siden',
        browserLabel: 'Nettleserforhåndsvisning',
        logoAlt: 'SpillArena-logo',
        previewAlt: 'Forhåndsvisning av SpillArena-nettsiden',
        url: 'spillarena.no',
    },
    timeline: {
        title: 'Tidslinje',
        intro: 'En oversikt over emnene jeg har gjennomført under studiene mine på HiØ.',
        loading: 'Laster tidslinje…',
        error: 'Kunne ikke laste tidslinje: {{error}}',
        semesterLabel: '{{number}}. semester',
        seasons: {
            spring: 'Vår',
            autumn: 'Høst',
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
                title: 'Ser fremover',
                description: 'Avslutter studiene og gjør meg klar for neste rolle.',
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
        readMore: 'Les mer',
    },
    projectDetails: {
        title: 'Prosjekttittel',
        description:
            'Dette er en detaljert beskrivelse av prosjektet. Det inkluderer teknologiene som ble brukt, utfordringene som oppstod og resultatene som ble oppnådd.',
        techTitle: 'Teknologier brukt',
        highlightsTitle: 'Høydepunkter',
        highlight:
            'Dette prosjektet var spesielt utfordrende på grunn av [spesifikk utfordring], men det var givende å se det komme sammen på en vellykket måte.',
        back: 'Tilbake til prosjekter',
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
        gitHub: 'GitHub',
    },
    header: {
        navigation: 'Navegación',
        settings: 'Ajustes',
        openMenu: 'Abrir menú',
        closeMenu: 'Cerrar menú',
    },
    languageSwitcher: {
        section: 'Idioma',
        choose: 'Elegir idioma',
    },
    themeSwitcher: {
        light: 'Cambiar a modo claro',
        dark: 'Cambiar a modo oscuro',
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
        updated: 'Última actualización: {{month}} de {{year}}',
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
        send: 'Enviar',
        welcome: '¡Hola! Soy el asistente de IA de Emil. ¡Pregúntame sobre sus proyectos, habilidades o su trayectoria — o cualquier otra cosa!',
        thinking: 'Pensando…',
        error: 'Algo salió mal. Inténtalo de nuevo.',
    },
    toTop: {
        aria: 'Volver arriba',
        title: 'Volver arriba',
        prefix: 'Volver a',
        label: 'Arriba',
    },
    home: {
        title: 'Hola. Soy Emil Berglund',
        roles: ['Estudiante de informática', 'Desarrollador full-stack', 'Desarrollador frontend', 'Desarrollador backend'],
        intro:
            'Soy una persona apasionada por la tecnología y con ganas de aprender y crecer. Creo que hay varias maneras de alcanzar un objetivo o encontrar una solución, y me gusta explorar enfoques innovadores para afrontar los retos.',
        githubAria: 'Perfil de GitHub',
        linkedinAria: 'Perfil de LinkedIn',
        cta: 'Echa un vistazo',
    },
    about: {
        title: '¿Quién soy?',
        intro: 'Una versión breve de quién soy, qué estudio y en qué me gusta emplear mi tiempo.',
        studentTitle: 'Como estudiante',
        student:
            'Estudio informática con especialización en diseño y desarrollo de sistemas informáticos en Østfold University College, en Halden. El programa comenzó en otoño de 2023 y termino en primavera de 2026. Me gusta profundizar en programación y uso mi tiempo libre para explorar Vue, Quasar y otras tecnologías.',
        personTitle: 'Como persona',
        person:
            'Tengo {{age}} años y vivo en Halden. La tecnología siempre me ha fascinado, y disfruto del proceso de aprender, mejorar y encontrar soluciones que funcionen en la práctica. Me siento mejor cuando puedo combinar creatividad con estructura.',
        leisureTitle: 'En mi tiempo libre',
        leisure:
            'Además de mis estudios, suelo trabajar en Elkjøp como vendedor. Allí puedo aprovechar mi interés por la tecnología y la electrónica, al mismo tiempo que me mantengo al día con nuevos productos y tendencias. En mi tiempo libre juego, veo películas y series, socializo y suelo sacar mi dron o cámara para capturar escenas de la zona.',
    },
    showcase: {
        title: 'SpillArena',
        status: 'En vivo',
        description:
            'La arena donde se reúnen tus juegos. Una colección de juegos en línea que puedes jugar directamente en el navegador, sin descargas.',
        tags: ['Juegos web', 'Oponente bot', 'Noruego / inglés'],
        visit: 'Visitar sitio',
        browserLabel: 'Vista previa del navegador',
        logoAlt: 'Logotipo de SpillArena',
        previewAlt: 'Vista previa del sitio web de SpillArena',
        url: 'spillarena.no',
    },
    timeline: {
        title: 'Cronología',
        intro: 'Una visión general de las asignaturas que he completado durante mis estudios en HiØ.',
        loading: 'Cargando cronología…',
        error: 'No se pudo cargar la cronología: {{error}}',
        semesterLabel: 'Semestre {{number}}',
        seasons: {
            spring: 'Primavera',
            autumn: 'Otoño',
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
                title: 'Mirando hacia adelante',
                description: 'Terminando mis estudios y preparándome para el siguiente puesto.',
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
        readMore: 'Leer más',
    },
    projectDetails: {
        title: 'Título del proyecto',
        description:
            'Esta es una descripción detallada del proyecto. Incluye las tecnologías usadas, los desafíos enfrentados y los resultados obtenidos.',
        techTitle: 'Tecnologías usadas',
        highlightsTitle: 'Aspectos destacados',
        highlight:
            'Este proyecto fue especialmente desafiante debido a [desafío específico], pero fue gratificante verlo completarse con éxito.',
        back: 'Volver a proyectos',
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
}

i18n.use(initReactI18next).init({
    resources: {
        no: { translation: no },
        en: { translation: en },
        es: { translation: es },
    },
    supportedLngs: SUPPORTED_LANGUAGES.map((language) => language.code),
    load: 'languageOnly',
    lng: localStorage.getItem('portfolio-lang') ?? 'no',
    fallbackLng: 'no',
    interpolation: {
        escapeValue: false,
    },
})

export default i18n