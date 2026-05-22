type MediaResourceType = 'image' | 'video' | 'raw'

export const CLOUDINARY_SCHEMA = {
    root: 'portfolio',
    projects: 'portfolio/projects',
    projectShowcase: 'portfolio/projects/spillarena',
    branding: 'portfolio/branding',
    social: 'portfolio/social',
    ui: 'portfolio/ui',
    misc: 'portfolio/misc',
} as const

type ResolveMediaUrlOptions = {
    fallback?: string
    resourceType?: MediaResourceType
    transformations?: string[]
}

const CLOUDINARY_CLOUD_NAME = import.meta.env.CLOUDINARY_CLOUD_NAME?.trim()

function isAbsoluteMediaUrl(value: string) {
    return /^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')
}

function stripLeadingSlashes(value: string) {
    return value.replace(/^\/+/, '')
}

function normalizeCloudinaryPublicId(source: string) {
    const normalizedSource = stripLeadingSlashes(source)

    if (normalizedSource.startsWith('images/projects/SpillArena/')) {
        return `${CLOUDINARY_SCHEMA.projectShowcase}/${normalizedSource.replace('images/projects/SpillArena/', '')}`
    }

    if (normalizedSource.startsWith('images/projects/')) {
        return `${CLOUDINARY_SCHEMA.projects}/${normalizedSource.replace('images/projects/', '')}`
    }

    if (normalizedSource.startsWith('assets/icons/')) {
        return `${CLOUDINARY_SCHEMA.branding}/${normalizedSource.replace('assets/icons/', '').replace(/\.(png|jpg|jpeg|webp|svg)$/i, '')}`
    }

    if (normalizedSource.startsWith('social/')) {
        return `${CLOUDINARY_SCHEMA.social}/${normalizedSource.replace('social/', '')}`
    }

    if (normalizedSource.startsWith('ui/')) {
        return `${CLOUDINARY_SCHEMA.ui}/${normalizedSource.replace('ui/', '')}`
    }

    return normalizedSource
}

function inferResourceType(source: string): MediaResourceType {
    const extension = source.split(/[?#]/)[0].split('.').pop()?.toLowerCase()

    if (extension && ['mp4', 'webm', 'mov', 'm4v', 'ogv'].includes(extension)) {
        return 'video'
    }

    if (extension && ['mp3', 'wav', 'ogg', 'm4a'].includes(extension)) {
        return 'raw'
    }

    return 'image'
}

export function resolveMediaUrl(source?: string | null, options: ResolveMediaUrlOptions = {}) {
    const fallback = options.fallback ?? ''

    if (!source) {
        return fallback
    }

    if (isAbsoluteMediaUrl(source)) {
        return source
    }

    if (CLOUDINARY_CLOUD_NAME) {
        const resourceType = options.resourceType ?? inferResourceType(source)
        const normalizedPublicId = normalizeCloudinaryPublicId(source)
        const transformationSegment = options.transformations?.filter(Boolean).join(',')
        const transformationPrefix = transformationSegment ? `${transformationSegment}/` : ''

        return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload/${transformationPrefix}${normalizedPublicId}`
    }

    return fallback || source
}