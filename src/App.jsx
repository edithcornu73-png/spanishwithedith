import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import logo from './assets/logo.svg'

export default function App(){
  const { t, i18n } = useTranslation()
  const [bookingResult, setBookingResult] = useState('')
  const [contactResult, setContactResult] = useState('')

  function changeLang(l){ i18n.changeLanguage(l) }

  function downloadSample(){
    const text = '20 frases para viajar:\n1. ¿Dónde está el baño?\n2. Quisiera...'
    const blob = new Blob([text],{type:'text/plain'})
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'frases_para_viajar.txt'; a.click()
  }

  function makeICS({title,description,location,start,end,uid,organizer}){
    function toICSDate(dt){
      const y = dt.getUTCFullYear(); const m = String(dt.getUTCMonth()+1).padStart(2,'0')
      const d = String(dt.getUTCDate()).padStart(2,'0'); const hh = String(dt.getUTCHours()).padStart(2,'0')
      const mm = String(dt.getUTCMinutes()).padStart(2,'0'); const ss = String(dt.getUTCSeconds()).padStart(2,'0')
      return `${y}${m}${d}T${hh}${mm}${ss}Z`
    }
    const dtstamp = toICSDate(new Date()); const dtstart = toICSDate(start); const dtend = toICSDate(end)
    return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//EdithProfe//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT',
      `UID:${uid}`,`DTSTAMP:${dtstamp}`,`DTSTART:${dtstart}`,`DTEND:${dtend}`,`SUMMARY:${title}`,
      `DESCRIPTION:${description||''}`,`LOCATION:${location||'Online'}`,`ORGANIZER:MAILTO:${organizer||'edithcornu73@gmail.com'}`,
      'END:VEVENT','END:VCALENDAR'].join('\r\n')
  }

  function downloadBlob(content,filename,type){ const blob = new Blob([content],{type}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=filename; a.click() }

  function handleBooking(e){
    e.preventDefault()
    const f = e.target; const name = f.name.value.trim(); const email = f.email.value.trim(); const minutes = Number(f.type.value); const dt = f.date.value; const notes = f.notes.value.trim()
    if(!name||!email||!dt){ alert('Completa los campos requeridos'); return }
    const start = new Date(dt)
    if(isNaN(start)){ alert('Fecha inválida'); return }
    const end = new Date(start.getTime() + minutes*60000)
    const ics = makeICS({title:`Clase con Edith (${minutes} min)`,description:notes,location:'Online (Zoom/Meet)',start,end,uid:Math.random().toString(36).slice(2,9),organizer:'edithcornu73@gmail.com'})
    downloadBlob(ics,`reserva-edith.ics`,'text/calendar')
    const subject = encodeURIComponent(`Reserva: Clase con Edith — ${start.toLocaleString()}`)
    const body = encodeURIComponent(`Hola Edith,\n\nMe llamo ${name} y quiero reservar una clase el ${start.toLocaleString()} (duración: ${minutes} min).\n\nNotas: ${notes}\n\nMi correo: ${email}\n\nGracias,\n${name}`)
    window.location.href = `mailto:edithcornu73@gmail.com?subject=${subject}&body=${body}`
    setBookingResult(t('booking_confirmation'))
  }

  function contactSubmit(e){
    e.preventDefault()
    const f = e.target; const n = f.c_name.value.trim(); const em = f.c_email.value.trim(); const m = f.c_msg.value.trim()
    if(!n||!em||!m){ alert('Completa todos los campos'); return }
    const subject = encodeURIComponent('Contacto desde la web — ' + n)
    const body = encodeURIComponent(m + '\n\nCorreo: ' + em)
    window.location.href = `mailto:edithcornu73@gmail.com?subject=${subject}&body=${body}`
    setContactResult('Se abrió tu cliente de correo para enviar el mensaje.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--warm-100)] to-white text-slate-900 font-sans">
      <header className="bg-gradient-to-r from-[var(--warm-300)] via-[var(--accent-2)] to-[var(--accent)] text-white p-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Spanish with Edith logo" className="w-12 h-12 rounded" />
            <div>
              <div className="font-bold text-lg">{t('title')}</div>
              <div className="text-sm opacity-90">{t('hero_sub')}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <nav className="hidden md:flex gap-4 font-semibold">
              <a href="#clases" className="hover:underline">{t('classes')}</a>
              <a href="#reservar" className="hover:underline">{t('reserve')}</a>
              <a href="#recursos" className="hover:underline">{t('download_phrases')}</a>
              <a href="#contacto" className="hover:underline">{t('contact')}</a>
            </nav>
            <select aria-label="Idioma" onChange={(e)=>changeLang(e.target.value)} value={i18n.language} className="rounded px-2 py-1 text-slate-700">
              <option value="es">🇪🇸 ES</option>
              <option value="en">🇬🇧 EN</option>
              <option value="fr">🇫🇷 FR</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-12">
        <section id="hero" className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <p className="bg-white/30 inline-block px-3 py-1 rounded-full mb-2">{t('hero_sub')}</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{t('hero_h1')}</h1>
            <p className="text-slate-700 mb-4">{t('hero_p')}</p>
            <button onClick={()=>document.getElementById('reservar').scrollIntoView({behavior:'smooth'})} className="bg-white text-[var(--accent)] px-4 py-2 rounded-md font-semibold">{t('reserve')}</button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md w-full md:w-72">
            <h3 className="font-bold">Clase de prueba — 30 min</h3>
            <p className="text-slate-500 text-sm">Conoce tu nivel y objetivos. Precio: $10</p>
          </div>
        </section>

        <section id="clases">
          <h2 className="text-2xl font-bold mb-3">{t('classes')}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow"><strong>Clase individual — 60 min</strong><p className="text-slate-500">$25</p></div>
            <div className="bg-white p-4 rounded-lg shadow"><strong>Clase corta — 30 min</strong><p className="text-slate-500">$15</p></div>
            <div className="bg-white p-4 rounded-lg shadow"><strong>Paquete 10 clases</strong><p className="text-slate-500">$220</p></div>
          </div>
        </section>

        <section id="reservar" className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-3">{t('reserve')}</h2>
          <form onSubmit={handleBooking} className="space-y-3">
            <input name="name" placeholder={t('name_placeholder')} required className="w-full border rounded px-3 py-2" />
            <input name="email" type="email" placeholder={t('email_placeholder')} required className="w-full border rounded px-3 py-2" />
            <select name="type" className="w-full border rounded px-3 py-2">
              <option value="30">Clase prueba — 30 min</option>
              <option value="60">Clase individual — 60 min</option>
            </select>
            <input name="date" type="datetime-local" required className="w-full border rounded px-3 py-2" />
            <textarea name="notes" rows="3" placeholder="Notas opcionales" className="w-full border rounded px-3 py-2"></textarea>
            <button type="submit" className="bg-[var(--accent)] text-white px-4 py-2 rounded">{t('reserve')}</button>
          </form>
          {bookingResult && <p className="mt-3 text-sm text-[var(--accent)] bg-white/60 p-2 rounded">{bookingResult}</p>}
        </section>

        <section id="recursos">
          <h2 className="text-2xl font-bold mb-3">{t('download_phrases')}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow"><strong>Guía rápida — 20 frases para viajar</strong><button onClick={downloadSample} className="block mt-2 bg-[var(--accent)] text-white px-3 py-1 rounded">{t('download_phrases')}</button></div>
            <div className="bg-white p-4 rounded-lg shadow"><strong>Mini-curso de pronunciación</strong></div>
            <div className="bg-white p-4 rounded-lg shadow"><strong>Blog: consejos de aprendizaje</strong></div>
          </div>
        </section>

        <section id="testimonios">
          <h2 className="text-2xl font-bold mb-3">{t('testimonials_title')}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">"Edith es una profesora excelente, muy dedicada." — Ana (ES)</div>
            <div className="bg-white p-4 rounded-lg shadow">"Edith is a wonderful teacher — patient and very clear." — Tom (EN)</div>
            <div className="bg-white p-4 rounded-lg shadow">"Edith est une professeure patiente et dynamique." — Claire (FR)</div>
          </div>
        </section>

        <section id="contacto" className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-3">{t('contact')}</h2>
          <form onSubmit={contactSubmit} className="space-y-3">
            <input name="c_name" placeholder={t('name_placeholder')} required className="w-full border rounded px-3 py-2" />
            <input name="c_email" type="email" placeholder={t('email_placeholder')} required className="w-full border rounded px-3 py-2" />
            <textarea name="c_msg" rows="3" placeholder="Tu mensaje" required className="w-full border rounded px-3 py-2"></textarea>
            <button type="submit" className="bg-[var(--accent)] text-white px-4 py-2 rounded">{t('contact')}</button>
          </form>
          {contactResult && <p className="mt-3 text-sm text-[var(--accent)] bg-white/60 p-2 rounded">{contactResult}</p>}
        </section>
      </main>

      <footer className="text-center text-slate-500 text-sm py-6 border-t mt-12">© {new Date().getFullYear()} Spanish with Edith · Hecho con ❤️</footer>
    </div>
  )
}
