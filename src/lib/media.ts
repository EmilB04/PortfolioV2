type MediaResourceType = 'image' | 'video' | 'raw'

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
        const normalizedPublicId = stripLeadingSlashes(source)
        const transformationSegment = options.transformations?.filter(Boolean).join(',')
        const transformationPrefix = transformationSegment ? `${transformationSegment}/` : ''

        return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload/${transformationPrefix}${normalizedPublicId}`
    }

    return fallback || source
}