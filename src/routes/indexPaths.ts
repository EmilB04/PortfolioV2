/*
    * indexPaths.ts - Centralized definition of index paths for the portfolio website.
    * This file defines the paths for each section of the index page, ensuring consistency across the application.
    * Each path corresponds to a specific section component, allowing for easy navigation and linking.
    * Usage: Use with <IndexLayout /> and set id to the corresponding path from INDEX_PATHS.
*/

export const INDEX_PATHS = {
    LANDING: 'landing',
    ABOUT: 'about',
    DOMAIN: 'live-domain',
    TIMELINE: 'timeline',
    PROJECTS: 'projects',
    KNOWLEDGE: 'knowledge',
    GITHUB: 'github',
} as const

export type IndexPath = (typeof INDEX_PATHS)[keyof typeof INDEX_PATHS]

export const INDEX_NAV_ITEMS = [
    { href: INDEX_PATHS.LANDING, labelKey: 'nav.home' },
    { href: INDEX_PATHS.ABOUT, labelKey: 'nav.about' },
    { href: INDEX_PATHS.DOMAIN, labelKey: 'nav.domains' },
    { href: INDEX_PATHS.TIMELINE, labelKey: 'nav.timeline' },
    { href: INDEX_PATHS.PROJECTS, labelKey: 'nav.projects' },
    { href: INDEX_PATHS.KNOWLEDGE, labelKey: 'nav.knowledge' },
    { href: INDEX_PATHS.GITHUB, labelKey: 'nav.gitHub' },
] as const