import React from 'react'
import { Linkedin, Mail } from 'lucide-react'

export default function FooterSection() {
    const year = new Date().getFullYear()

    return (
        <footer className="border-t mt-12 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        © {year} EmilB04 — Built with React, TypeScript, Supabase
                    </p>
                    <div className="flex gap-4">
                        <a href="https://github.com/EmilB04" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-900">
                            <p>GitHub ikon her </p>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-900">
                            <Linkedin size={20} />
                        </a>
                        <a href="mailto:your-email@example.com" className="text-gray-600 hover:text-gray-900">
                            <Mail size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
