import { localizeProject } from './projects'
import type { Project } from './projects'
import type { LanguageCode } from '../hooks/useLanguage'

export interface RouteSeo {
    title: string
    description: string
    noindex?: boolean
}

export const SITE = 'https://emilb.no'
const SITE_NAME = 'Emil Berglund'
export const SITE_LOGO = `${SITE}/icons/EB_LOGO-512.png`

// Kept as one map so the prerender script (Node, no bundler) and the
// client-side route hook read the exact same copy — a route can't drift
// between what crawlers see in the static HTML and what hydration renders.
export const ROUTE_SEO: Record<string, RouteSeo> = {
    '/': {
        title: 'Emil Berglund – Fullstackutvikler og masterstudent i KI',
        description:
            'Emil Berglund er fullstackutvikler i Halden og masterstudent i anvendt informatikk med fordypning i kunstig intelligens. Se prosjekter, erfaring og kompetanse.',
    },
    '/projects': {
        title: 'Prosjekter – Emil Berglund',
        description:
            'Utforsk prosjektene til Emil Berglund: webapper, verktøy og programvare utviklet med blant annet React, TypeScript, .NET og Python.',
    },
    '/contact': {
        title: 'Kontakt – Emil Berglund',
        description: 'Ta kontakt med Emil Berglund, fullstackutvikler og masterstudent i Halden. Finn e-post, LinkedIn og GitHub for samarbeid og nye prosjekter.',
    },
}

export function canonicalFor(path: string): string {
    const pathname = path.split(/[?#]/)[0].replace(/\/+$/, '') || '/'
    return pathname === '/' ? `${SITE}/` : `${SITE}${pathname}`
}

export const NOT_FOUND_SEO: RouteSeo = {
    title: 'Siden ble ikke funnet – Emil Berglund',
    description: 'Denne siden finnes ikke. Gå til forsiden eller utforsk prosjektene til Emil Berglund.',
    noindex: true,
}

export function projectSeoFor(project: Project, language: LanguageCode = 'no'): RouteSeo {
    const text = localizeProject(project, language).description.replace(/\s+/g, ' ').trim()
    const description = text.length > 160 ? `${text.slice(0, 157).replace(/\s+\S*$/, '')}…` : text
    return {
        title: absoluteTitle(project.title),
        description: description || `Les om ${project.title}, et prosjekt av Emil Berglund.`,
    }
}

export function absoluteTitle(title: string): string {
    return title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
}

/** Identity and page data shared by the generated HTML and client navigation. */
export function structuredDataFor(path: string, title: string, description: string, projects: Project[] = [], language = 'nb-NO') {
    const canonical = canonicalFor(path)
    const pathname = new URL(canonical).pathname
    const project = projects.find(item => pathname === `/projects/${item.local_path}`)
    const personId = `${SITE}/#person`
    const websiteId = `${SITE}/#website`
    const breadcrumbId = `${canonical}#breadcrumb`
    const hasBreadcrumb = pathname === '/projects' || pathname === '/contact' || Boolean(project)
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Person',
                '@id': personId,
                name: SITE_NAME,
                givenName: 'Emil',
                familyName: 'Berglund',
                url: `${SITE}/`,
                image: 'https://avatars.githubusercontent.com/u/111691856?v=4&s=512',
                jobTitle: 'Fullstackutvikler og masterstudent i anvendt informatikk',
                description: ROUTE_SEO['/'].description,
                email: 'mailto:emil.berglund@live.no',
                sameAs: ['https://github.com/EmilB04', 'https://www.linkedin.com/in/emilber/'],
                knowsAbout: ['React', 'TypeScript', 'JavaScript', 'Vue.js', 'C#', '.NET', 'Python', 'Webutvikling', 'Kunstig intelligens'],
                alumniOf: {
                    '@type': 'CollegeOrUniversity',
                    name: 'Høgskolen i Østfold',
                    alternateName: 'HiØ',
                    url: 'https://www.hiof.no/',
                },
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Halden',
                    addressRegion: 'Østfold',
                    addressCountry: 'NO',
                },
            },
            {
                '@type': 'WebSite',
                '@id': websiteId,
                url: `${SITE}/`,
                name: SITE_NAME,
                alternateName: ['emilb.no', 'Emil Berglund – Portefølje'],
                description: ROUTE_SEO['/'].description,
                inLanguage: 'nb-NO',
                image: SITE_LOGO,
                author: { '@id': personId },
                publisher: { '@id': personId },
            },
            {
                '@type': pathname === '/' ? 'ProfilePage' : pathname === '/projects' ? 'CollectionPage' : pathname === '/contact' ? 'ContactPage' : 'WebPage',
                '@id': `${canonical}#webpage`,
                url: canonical,
                name: title,
                description,
                inLanguage: language,
                isPartOf: { '@id': websiteId },
                about: { '@id': personId },
                ...(pathname === '/' ? { mainEntity: { '@id': personId } } : {}),
                ...(project ? { mainEntity: { '@id': `${canonical}#project` } } : {}),
                ...(hasBreadcrumb ? { breadcrumb: { '@id': breadcrumbId } } : {}),
                ...(pathname === '/projects' ? {
                    mainEntity: {
                        '@type': 'ItemList',
                        itemListElement: projects.map((item, index) => ({
                            '@type': 'ListItem',
                            position: index + 1,
                            name: item.title,
                            url: canonicalFor(`/projects/${item.local_path}`),
                        })),
                    },
                } : {}),
            },
            ...(project ? [{
                '@type': 'CreativeWork',
                '@id': `${canonical}#project`,
                name: project.title,
                description,
                url: canonical,
                author: { '@id': personId },
                inLanguage: language,
            }] : []),
            ...(hasBreadcrumb ? [{
                '@type': 'BreadcrumbList',
                '@id': breadcrumbId,
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Hjem', item: `${SITE}/` },
                    {
                        '@type': 'ListItem', position: 2,
                        name: pathname === '/contact' ? 'Kontakt' : 'Prosjekter',
                        item: canonicalFor(pathname === '/contact' ? '/contact' : '/projects'),
                    },
                    ...(project ? [{ '@type': 'ListItem', position: 3, name: project.title, item: canonical }] : []),
                ],
            }] : []),
        ],
    }
}
