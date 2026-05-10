/*
 * routes.ts
 * Centralized definition of all routes used in the frontend application, including
 * their paths, display names, and unique nicknames.
 * This file serves as a single source of truth for route information, making it
 * easier to manage navigation and ensure consistency across the application.
 */

import type { Route } from './types'

export type RouteNickname =
    | 'home'
    | 'projects'
    | 'project-details'
    | 'contact'

export const ROUTES: Record<string, Route> = {
    HOME: {
        nickname: 'home',
        path: '/',
        displayName: 'Hjem',
    },
    PROJECTS: {
        nickname: 'projects',
        path: '/projects',
        displayName: 'Prosjekter',
    },
    PROJECT_DETAILS: {
        nickname: 'project-details',
        path: '/projects/:projectId',
        displayName: 'Prosjektdetaljer',
    },
    CONTACT: {
        nickname: 'contact',
        path: '/contact',
        displayName: 'Kontakt',
    },
} as const

