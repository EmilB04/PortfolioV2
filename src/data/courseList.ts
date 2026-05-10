export interface CourseItem {
    name: string;
    link: string;
    code: string;
    description: string;
}

export interface CourseTypes {
    semester: string;
    courses: CourseItem[];
}

const courseList: CourseTypes[] = [
    {
        semester: 'Høst 2023',
        courses: [
            {
                name: 'Programmering 1',
                link: 'https://www.hiof.no/studier/emner/iio/itk/2023/host/itf10219.html',
                code: 'ITF10219',
                description:
                    'Kurset gir en innføring i programmering og programmeringsspråket Python.',
            },
            {
                name: 'Webutvikling',
                link: 'https://www.hiof.no/studier/emner/iio/itk/2023/host/itf10511.html',
                code: 'ITF10511',
                description:
                    'Kurset gir en innføring i webutvikling og språkene HTML, CSS og SCSS.',
            },
            {
                name: 'Innføring i design av digitale produkter',
                link: 'https://www.hiof.no/studier/emner/iio/itk/2023/host/itf14022.html',
                code: 'ITF14022',
                description:
                    'Kurset gir en innføring i design av digitale produkter, brukeropplevelse og arbeidsmetodikk.',
            },
        ],
    },
    {
        semester: 'Vår 2024',
        courses: [
            {
                name: 'Programmering 2',
                link: 'https://www.hiof.no/studier/emner/iio/itk/2024/var/itf10619.html',
                code: 'ITF20219',
                description:
                    'Kurset gir en videreføring i programmering i programmeringsspråket Java.',
            },
            {
                name: 'Databasesystemer',
                link: 'https://www.hiof.no/studier/emner/iio/itk/2024/var/itf10319.html',
                code: 'ITF20511',
                description:
                    'Kurset gir en innføring i databasesystemer og språket MySQL.',
            },
            {
                name: 'Innføring i datasikkerhet',
                link: 'https://www.hiof.no/studier/emner/iio/itk/2024/var/itf15019.html',
                code: 'ITF24022',
                description:
                    'Kurset gir en innføring i datasikkerhet, sikkerhetsløsninger og skadelig programvare.',
            },
        ],
    },
    {
        semester: 'Høst 2024',
        courses: [
            {
                name: 'Innføring i operativsystemer',
                link: 'https://www.hiof.no/studier/emner/iio/itk/2024/host/itf22519.html',
                code: 'ITF22519',
                description:
                    'Kurset gir en innføring i operativsystemer og C-programmering.',
            },
            {
                name: 'Diskret matematikk',
                link: 'https://www.hiof.no/studier/emner/iio/itk/2024/host/itf10705.html',
                code: 'ITF10705',
                description:
                    'Kurset gir en innføring i diskret matematikk og matematiske bevis.',
            },
            {
                name: 'Software Engineering og testing',
                link: 'https://www.hiof.no/studier/emner/iio/itk/2024/host/itf20319.html',
                code: 'ITF20319',
                description:
                    'Kurset gir en innføring i software engineering, utvikling, testing og arbeidsmetodikk.',
            },
        ],
    },
    {
        semester: 'Vår 2025',
        courses: [
            {
                name: 'Rammeverk og .NET',
                link: 'https://www.hiof.no/studier/emner/iio/itk/2025/var/itf20123.html',
                code: 'ITF20123',
                description:
                    'Kurset gir en innføring i rammeverk og .NET med programmeringsspråket C#.',
            },
            {
                name: 'Algoritmer og datastrukturer',
                link: 'https://www.hiof.no/studier/emner/iio/itk/2025/var/itf20006.html',
                code: 'ITF20006',
                description: 'Kurset gir en innføring i algoritmer og datastrukturer.',
            },
            {
                name: 'Innføring i Generativ AI',
                link: 'https://www.hiof.no/studier/emner/iio/itk/2025/var/itf31824.html',
                code: 'ITF31824',
                description:
                    'Kurset gir en innføring i generativ AI, og innsikt i etiske probleemstillinger knyttet til bruk av KI.',
            },
            {
                name: 'Utvikling av interaktive nettsteder',
                link: 'https://www.hiof.no/studier/emner/iio/itk/2025/var/itm30617.html',
                code: 'ITM30617',
                description:
                    'Kurset er en videreføring av Webutvikling og bygget videre med rammeverket React og språket JavaScript.',
            },
        ],
    },
    {
        semester: 'Høst 2025',
        courses: [
            {
                name: 'Mobilprogrammering',
                link: 'https://www.hiof.no/studier/emner/iio/itk/2025/host/itf21019.html',
                code: 'ITF21019',
                description:
                    'Kurset gir en innføring i mobilprogrammering med fokus på plattformene Android og iOS.',
            },
            {
                name: 'Webapplikasjoner',
                link: 'https://www.hiof.no/studier/emner/iio/itk/2025/host/itf31619.html',
                code: 'ITF31619',
                description:
                    'Kurset gir en innføring i webapplikasjoner med fokus på moderne rammeverk og teknologier.',
            },
            {
                name: 'Kommunikasjonsdesign',
                link: 'https://www.hiof.no/studier/emner/iio/itk/2025/host/itm30719.html',
                code: 'ITM30719',
                description:
                    'Kurset gir en innføring i kommunikasjonsdesign, brukeropplevelse og designmetodikk.',
            },
        ],
    },
    {
        semester: 'Vår 2026',
        courses: [
            {
                name: 'Bacheloroppgave',
                link: 'https://www.hiof.no/studier/emner/iio/itk/2026/var/itf32012.html',
                code: 'ITF32012',
                description: 'Kurset er en bacheloroppgave som avslutter studiet.',
            },
            {
                name: 'Parallel og distribuert programmering',
                link: 'https://www.hiof.no/studier/emner/iio/itk/2026/var/itf23019.html',
                code: 'ITF23019',
                description:
                    'Kurset gir en innføring i parallel og distribuert programmering.',
            },
        ],
    },
];

export default courseList;
