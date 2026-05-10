import { useEffect, useRef } from 'react'

type ShootingStar = {
    x: number
    y: number
    length: number
    speed: number
    angle: number
    opacity: number
}

function createStar(width: number, height: number): ShootingStar {
    return {
        x: -Math.random() * width,
        y: -Math.random() * height,
        length: Math.random() * 100 + 50,
        speed: 5,
        angle: Math.PI / 4,
        opacity: Math.random() * 0.5 + 0.5
    }
}

export default function Sections() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const canvasElement = canvasRef.current
        if (!canvasElement) {
            return
        }

        const renderingContext = canvasElement.getContext('2d')
        if (!renderingContext) {
            return
        }

        const canvas = canvasElement
        const context = renderingContext

        let shootingStars: ShootingStar[] = []
        let animationFrameId = 0

        function setSize() {
            const devicePixelRatio = window.devicePixelRatio || 1
            canvas.width = Math.floor(window.innerWidth * devicePixelRatio)
            canvas.height = Math.floor(window.innerHeight * devicePixelRatio)
            canvas.style.width = `${window.innerWidth}px`
            canvas.style.height = `${window.innerHeight}px`
            context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
        }

        function resetStars() {
            shootingStars = Array.from({ length: 5 }, () => createStar(window.innerWidth, window.innerHeight))
        }

        function drawStar(star: ShootingStar) {
            context.strokeStyle = `rgba(255, 255, 255, ${star.opacity})`
            context.lineWidth = 2
            context.beginPath()
            context.moveTo(star.x, star.y)
            context.lineTo(star.x - star.length * Math.cos(star.angle), star.y - star.length * Math.sin(star.angle))
            context.stroke()
        }

        function updateStar(star: ShootingStar) {
            star.x += star.speed
            star.y += star.speed

            const outOfBoundsX = star.x - star.length * Math.cos(star.angle) > window.innerWidth
            const outOfBoundsY = star.y - star.length * Math.sin(star.angle) > window.innerHeight

            if (outOfBoundsX || outOfBoundsY) {
                Object.assign(star, createStar(window.innerWidth, window.innerHeight))
            }
        }

        function animate() {
            context.clearRect(0, 0, window.innerWidth, window.innerHeight)

            for (const star of shootingStars) {
                updateStar(star)
                drawStar(star)
            }

            animationFrameId = window.requestAnimationFrame(animate)
        }

        function handleResize() {
            setSize()
            resetStars()
        }

        handleResize()
        animate()
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            window.cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return <canvas ref={canvasRef} className="stars-canvas" aria-hidden="true" />
}
