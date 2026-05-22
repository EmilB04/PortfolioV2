import { motion } from 'framer-motion'

export default function LoadingSpinner({ size = 36 }: { size?: number }) {
    return (
        <div className="flex justify-center py-10">
            <motion.span
                style={{
                    display: 'inline-block',
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    border: '3px solid color-mix(in srgb, var(--accent) 20%, transparent)',
                    borderTopColor: 'var(--accent)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
            />
        </div>
    )
}
