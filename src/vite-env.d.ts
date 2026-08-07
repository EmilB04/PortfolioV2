/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL?: string
    readonly VITE_SUPABASE_ANON_KEY?: string
    readonly CLOUDINARY_CLOUD_NAME?: string
    readonly CLOUDINARY_API_KEY?: string
    readonly VITE_DEV_ADMIN_UPLOAD_SECRET?: string
}