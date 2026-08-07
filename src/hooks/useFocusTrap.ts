import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusable(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
}

/** Traps Tab focus inside `containerRef` while `active`, moves focus in on activation
 *  (to `initialFocusRef` if given, else the first focusable element), and restores focus
 *  to whatever was focused beforehand once `active` becomes false. */
export function useFocusTrap(
    active: boolean,
    containerRef: RefObject<HTMLElement | null>,
    opts?: { initialFocusRef?: RefObject<HTMLElement | null> },
) {
    const initialFocusRef = opts?.initialFocusRef
    const triggerRef = useRef<HTMLElement | null>(null)

    useEffect(() => {
        if (!active) return

        triggerRef.current = document.activeElement as HTMLElement | null

        const container = containerRef.current
        const toFocus = initialFocusRef?.current ?? (container ? getFocusable(container)[0] : undefined)
        toFocus?.focus()

        function onKeyDown(e: KeyboardEvent) {
            if (e.key !== 'Tab' || !container) return

            const focusable = getFocusable(container)
            if (focusable.length === 0) return

            const first = focusable[0]
            const last = focusable[focusable.length - 1]

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault()
                last.focus()
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault()
                first.focus()
            }
        }

        window.addEventListener('keydown', onKeyDown)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
            triggerRef.current?.focus()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active])
}
