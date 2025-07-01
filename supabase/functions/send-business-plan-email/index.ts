
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { businessData } = await req.json()

    const emailHTML = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1FA2FF; margin-bottom: 24px;">Nuevo Plan de Negocio Generado</h2>
        
        <table style="width: 100%; border-collapse: collapse; background: #f8f9fa; border-radius: 8px; overflow: hidden;">
          <tr style="background: #1FA2FF; color: white;">
            <th style="padding: 12px; text-align: left;">Campo</th>
            <th style="padding: 12px; text-align: left;">Información</th>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;"><strong>Nombre del Negocio:</strong></td>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${businessData.businessName}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;"><strong>Email:</strong></td>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${businessData.email}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;"><strong>Industria:</strong></td>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${businessData.industry}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;"><strong>Presupuesto Mensual:</strong></td>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">$${businessData.monthlyBudget.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;"><strong>Objetivo Principal:</strong></td>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${businessData.primaryGoal}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;"><strong>Audiencia Objetivo:</strong></td>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${businessData.targetAudience}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;"><strong>Canales Actuales:</strong></td>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${businessData.currentChannels.join(', ')}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;"><strong>Desafíos:</strong></td>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${businessData.currentChallenges.join(', ')}</td>
          </tr>
          <tr>
            <td style="padding: 12px;"><strong>Plazo Esperado:</strong></td>
            <td style="padding: 12px;">${businessData.timeframe}</td>
          </tr>
        </table>
        
        <p style="margin-top: 24px; color: #666;">Este lead completó el planificador estratégico en ${new Date().toLocaleString('es-CL')}</p>
      </div>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Planificador <noreply@territorioux.cl>',
        to: ['pedro@territorioux.cl'],
        subject: `Nuevo Plan: ${businessData.businessName}`,
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
