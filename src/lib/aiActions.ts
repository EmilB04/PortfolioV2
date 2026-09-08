/*
 * aiActions.ts
 * Registry of the in-site destinations the AI assistant is allowed to offer as buttons.
 *
 * The model never returns a URL. It returns an id from this list (via `[[action:id]]`
 * markers that the chat edge function validates and strips), and the widget maps that id
 * to a destination defined here. Anything unrecognized is dropped, so a reply can only
 * ever link to a page of this site.
 */

import { ROUTES } from '../routes/routes'
import { INDEX_PATHS } from '../routes/indexPaths'

export type AiActionId =
    | 'contact'
    | 'projects'
    | 'about'
    | 'timeline'
    | 'domains'
    | 'knowledge'
    | 'certifications'

type AiActionTarget =
    /** A router path. */
    | { kind: 'route'; path: string }
    /** A section of the landing page, scrolled to after navigating home if needed. */
    | { kind: 'section'; id: string }

export type AiAction = {
    target: AiActionTarget
    /** i18n key — button labels follow the site language, not the reply language. */
    labelKey: string
}

export const AI_ACTIONS: Record<AiActionId, AiAction> = {
    contact: { target: { kind: 'route', path: ROUTES.CONTACT.path }, labelKey: 'contactButton.label' },
    projects: { target: { kind: 'route', path: ROUTES.PROJECTS.path }, labelKey: 'nav.projects' },
    about: { target: { kind: 'section', id: INDEX_PATHS.ABOUT }, labelKey: 'nav.about' },
    timeline: { target: { kind: 'section', id: INDEX_PATHS.TIMELINE }, labelKey: 'nav.timeline' },
    domains: { target: { kind: 'section', id: INDEX_PATHS.DOMAIN }, labelKey: 'nav.domains' },
    knowledge: { target: { kind: 'section', id: INDEX_PATHS.KNOWLEDGE }, labelKey: 'nav.knowledge' },
    certifications: { target: { kind: 'section', id: INDEX_PATHS.CERTIFICATIONS }, labelKey: 'nav.certifications' },
}

export const MAX_ACTIONS = 3

export function isAiActionId(value: unknown): value is AiActionId {
    return typeof value === 'string' && Object.prototype.hasOwnProperty.call(AI_ACTIONS, value)
}

/** Keeps only known ids, drops duplicates, and caps how many buttons one reply can show. */
export function sanitizeActions(value: unknown): AiActionId[] {
    if (!Array.isArray(value)) return []
    return [...new Set(value.filter(isAiActionId))].slice(0, MAX_ACTIONS)
}

/** The href a button points at — real links, so middle-click and "open in new tab" work. */
export function actionHref(id: AiActionId): string {
    const { target } = AI_ACTIONS[id]
    return target.kind === 'route' ? target.path : `${ROUTES.HOME.path}#${target.id}`
}
