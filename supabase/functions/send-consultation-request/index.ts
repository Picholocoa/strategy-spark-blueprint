
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { businessName, email } = await req.json()

    const emailHTML = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1FA2FF; margin-bottom: 24px;">🚀 Solicitud de Consultoría</h2>
        
        <div style="background: #f8f9fa; padding: 24px; border-radius: 12px; border-left: 4px solid #1FA2FF;">
          <h3 style="margin: 0 0 16px 0; color: #3E3E3E;">${businessName}</h3>
          <p style="margin: 0; color: #666; font-size: 16px;">
            <strong>Email:</strong> ${email}<br>
            <strong>Fecha:</strong> ${new Date().toLocaleString('es-CL')}<br>
            <strong>Acción:</strong> Solicitó agendar consultoría gratuita
          </p>
        </div>
        
        <p style="margin-top: 24px; color: #666;">
          Este lead completó el planificador estratégico y está interesado en una consultoría personalizada.
        </p>
      </div>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Consultoría <noreply@territorioux.cl>',
        to: ['pedro@territorioux.cl'],
        subject: `Consultoría: ${businessName}`,
        html: emailHTML
      })
    })

    if (!res.ok) {
      throw new Error('Failed to send email')
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
