import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false }

    static getDerivedStateFromError(): State {
        return { hasError: true }
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('Uncaught error:', error, info)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div
                    className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center"
                    style={{ background: 'var(--bg)', color: 'var(--text)' }}
                >
                    <h1 className="text-2xl font-bold">Something went wrong.</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Please refresh the page.</p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="rounded-full px-4 py-2 text-sm font-semibold"
                        style={{ background: 'var(--accent)', color: '#000' }}
                    >
                        Reload
                    </button>
                </div>
            )
        }
        return this.props.children
    }
}
