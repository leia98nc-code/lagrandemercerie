import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' })
  const [envoye, setEnvoye] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = () => {
    if (!form.nom || !form.email || !form.message) {
      alert('Merci de remplir tous les champs obligatoires.')
      return
    }
    const subject = encodeURIComponent(form.sujet || 'Demande depuis le site')
    const body = encodeURIComponent(
      `Nom : ${form.nom}\nEmail : ${form.email}\n\n${form.message}`
    )
    window.location.href = `mailto:lagrandemercerie.nc@gmail.com?subject=${subject}&body=${body}`
    setEnvoye(true)
  }

  return (
    <main className="page" style={{ paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>

        <div className="section-titre" style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: 'var(--font-titre)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Contactez-nous
          </h1>
          <p>Nous sommes là pour répondre à toutes vos questions</p>
          <span className="trait" />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2.5rem',
        }}>

          {/* Informations */}
<div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
  <h2 style={{ fontFamily: 'var(--font-titre)', fontSize: '1.3rem', color: 'var(--noir)' }}>
    Nos coordonnées
  </h2>

  {/* Adresse seule */}
  <div style={{
    display: 'flex', gap: '1rem', alignItems: 'flex-start',
    background: 'var(--blanc)',
    borderRadius: 'var(--radius)',
    padding: '1rem 1.25rem',
    boxShadow: 'var(--shadow-card)',
  }}>
    <span style={{ fontSize: '1.4rem' }}>📍</span>
    <div>
      <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem', color: 'var(--rose-profond)' }}>Adresse</p>
      <p style={{ fontSize: '0.85rem', color: 'var(--gris-texte)', whiteSpace: 'pre-line', lineHeight: 1.6 }}>{"16 route de l'Anse Vata\n98800 Nouméa"}</p>
    </div>
  </div>

  {/* Carte Google Maps — juste sous l'adresse */}
  <div style={{
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-card)',
  }}>
    <iframe
      title="Localisation La Grande Mercerie"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3692.0327871492777!2d166.4450078747303!3d-22.276747815657256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6c27e285b2ca710d%3A0xb1883ff7ba9a777f!2sLa%20Grande%20Mercerie!5e0!3m2!1sfr!2sfr!4v1779944073441!5m2!1sfr!2sfr"
      width="100%"
      height="200"
      style={{ border: 0, display: 'block' }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  </div>

  {/* Téléphone, Email, Horaires */}
  {[
    { icon: '📞', titre: 'Téléphone', texte: '27.33.76' },
    { icon: '✉️', titre: 'Email',     texte: 'lagrandemercerie.nc@gmail.com' },
    { icon: '🕐', titre: 'Horaires',  texte: 'Lundi – Vendredi : 8h – 17H30\nSamedi : 8h - 12h\nFermé le dimanche' },
  ].map(({ icon, titre, texte }) => (
    <div key={titre} style={{
      display: 'flex', gap: '1rem', alignItems: 'flex-start',
      background: 'var(--blanc)',
      borderRadius: 'var(--radius)',
      padding: '1rem 1.25rem',
      boxShadow: 'var(--shadow-card)',
    }}>
      <span style={{ fontSize: '1.4rem' }}>{icon}</span>
      <div>
        <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem', color: 'var(--rose-profond)' }}>{titre}</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--gris-texte)', whiteSpace: 'pre-line', lineHeight: 1.6 }}>{texte}</p>
      </div>
    </div>
  ))}

</div>

          {/* Formulaire */}
          <div style={{
            background: 'var(--blanc)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            boxShadow: 'var(--shadow-soft)',
          }}>
            {envoye ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💌</div>
                <h3 style={{ fontFamily: 'var(--font-titre)', color: 'var(--rose-profond)', marginBottom: '0.5rem' }}>
                  Merci !
                </h3>
                <p style={{ color: 'var(--gris-texte)' }}>
                  Votre messagerie s'est ouverte. Nous vous répondrons dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <h2 style={{ fontFamily: 'var(--font-titre)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                  Envoyer un message
                </h2>

                {[
                  { name: 'nom',   label: 'Votre nom *',   type: 'text',  placeholder: 'Marie Dupont'            },
                  { name: 'email', label: 'Votre email *', type: 'email', placeholder: 'marie@exemple.fr'        },
                  { name: 'sujet', label: 'Sujet',         type: 'text',  placeholder: 'Question sur un produit' },
                ].map(({ name, label, type, placeholder }) => (
                  <div key={name}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem', color: 'var(--noir)' }}>
                      {label}
                    </label>
                    <input
                      type={type} name={name}
                      value={form[name]} onChange={handleChange}
                      placeholder={placeholder}
                      style={{
                        width: '100%', padding: '0.7rem 1rem',
                        border: '2px solid var(--rose-poudre)',
                        borderRadius: 'var(--radius)',
                        fontFamily: 'var(--font-corps)', fontSize: '0.9rem',
                        outline: 'none', transition: 'border-color 0.2s',
                        background: 'var(--blush)',
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--rose-profond)'}
                      onBlur={e => e.target.style.borderColor = 'var(--rose-poudre)'}
                    />
                  </div>
                ))}

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem', color: 'var(--noir)' }}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Votre message..."
                    rows={5}
                    style={{
                      width: '100%', padding: '0.7rem 1rem',
                      border: '2px solid var(--rose-poudre)',
                      borderRadius: 'var(--radius)',
                      fontFamily: 'var(--font-corps)', fontSize: '0.9rem',
                      outline: 'none', resize: 'vertical',
                      transition: 'border-color 0.2s',
                      background: 'var(--blush)',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--rose-profond)'}
                    onBlur={e => e.target.style.borderColor = 'var(--rose-poudre)'}
                  />
                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--gris-texte)' }}>
                  * Champs obligatoires. Vos données ne seront utilisées que pour répondre à votre demande.
                </p>

                <button onClick={handleSubmit} className="btn-primary">
                  Envoyer le message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}