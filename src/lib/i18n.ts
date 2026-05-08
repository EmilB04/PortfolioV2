import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
    en: {
        translation: {
            'nav.projects': 'Projects',
            'nav.about': 'About',
            'nav.contact': 'Contact',
            'home.title': 'Hi — I\'m Emil',
            'home.subtitle': 'I build web apps with React, TypeScript and Supabase.',
            'projects.title': 'Projects',
            'projects.loading': 'Loading…',
            'about.title': 'About',
            'contact.title': 'Contact',
            'contact.name': 'Name',
            'contact.email': 'Email',
            'contact.message': 'Message',
            'contact.send': 'Send',
            'contact.sending': 'Sending…',
            'contact.sent': 'Sent — thanks!',
            'contact.error': 'Error sending message.'
        }
    },
    es: {
        translation: {
            'nav.projects': 'Proyectos',
            'nav.about': 'Acerca de',
            'nav.contact': 'Contacto',
            'home.title': 'Hola — Soy Emil',
            'home.subtitle': 'Construyo aplicaciones web con React, TypeScript y Supabase.',
            'projects.title': 'Proyectos',
            'projects.loading': 'Cargando…',
            'about.title': 'Acerca de',
            'contact.title': 'Contacto',
            'contact.name': 'Nombre',
            'contact.email': 'Correo',
            'contact.message': 'Mensaje',
            'contact.send': 'Enviar',
            'contact.sending': 'Enviando…',
            'contact.sent': '¡Enviado — gracias!',
            'contact.error': 'Error al enviar el mensaje.'
        }
    }
}

i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    interpolation: {
        escapeValue: false
    }
})

export default i18n
