export interface RouteSeo {
    title: string
    description: string
}

const SITE = 'https://emilb.no'
const SITE_NAME = 'Emil Berglund'

// Kept as one map so the prerender script (Node, no bundler) and the
// client-side route hook read the exact same copy — a route can't drift
// between what crawlers see in the static HTML and what hydration renders.
export const ROUTE_SEO: Record<string, RouteSeo> = {
    '/': {
        title: 'Emil Berglund - Full-Stack Developer & Computer Science Student in Halden, Norway',
        description:
            'Emil Berglund is a full-stack developer and computer science student in Halden, Norway, building with React, TypeScript, .NET and Python. Portfolio with projects, experience and skills.',
    },
    '/projects': {
        title: 'Projects - Emil Berglund',
        description:
            'Software projects built by Emil Berglund, full-stack developer in Halden, Norway — web apps, tools and experiments using React, TypeScript, .NET and Python.',
    },
    '/contact': {
        title: 'Contact - Emil Berglund',
        description: 'Get in touch with Emil Berglund, full-stack developer and computer science student in Halden, Norway.',
    },
}

export function canonicalFor(path: string): string {
    return path === '/' ? `${SITE}/` : `${SITE}${path}`
}

export function absoluteTitle(title: string): string {
    return title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
}
