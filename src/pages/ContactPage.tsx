import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Contact() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setStatus('sending')
        const { error } = await supabase.from('messages').insert([{ name, email, message }])
        if (error) {
            console.error(error)
            setStatus('error')
        } else {
            setStatus('sent')
            setName('')
            setEmail('')
            setMessage('')
        }
    }

    return (
        <main className="max-w-2xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm">Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" required />
                </div>
                <div>
                    <label className="block text-sm">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" required />
                </div>
                <div>
                    <label className="block text-sm">Message</label>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" rows={6} required />
                </div>
                <div>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={status === 'sending'}>
                        {status === 'sending' ? 'Sending…' : 'Send'}
                    </button>
                    {status === 'sent' && <span className="ml-3 text-green-600">Sent — thanks!</span>}
                    {status === 'error' && <span className="ml-3 text-red-600">Error sending message.</span>}
                </div>
            </form>
        </main>
    )
}
