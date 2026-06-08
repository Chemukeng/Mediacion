import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

// Necesitamos la clave de servicio (Service Role Key) para saltarnos el RLS en el webhook
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Fallback para desarrollo si no hay admin key
);

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    // Si tenemos configurado el Webhook Secret de Stripe, lo usamos para validar la firma
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    } else {
      // Para desarrollo rápido sin proxy/firma (NO recomendado en producción)
      event = JSON.parse(payload) as Stripe.Event;
    }
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Manejar el evento de pago completado
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Recuperar metadatos que inyectamos en createCheckoutSession
    const metadata = session.metadata;
    if (metadata && metadata.caseId) {
      const { caseId, type, userId } = metadata;
      
      try {
        // Obtener el caso actual
        const { data: caseData } = await supabaseAdmin.from('cases').select('*').eq('id', caseId).single();
        
        if (caseData) {
          const isUserA = caseData.user_a_id === userId;
          const currentAmount = caseData.amount_paid || 0;
          const newAmount = type === 'full' ? 500 : currentAmount + 250;
          
          let newStatus = 'pending';
          if (newAmount >= 500) {
            newStatus = 'paid_in_full';
          } else {
            newStatus = isUserA ? 'half_paid_by_A' : 'half_paid_by_B';
          }

          // Actualizar en base de datos
          await supabaseAdmin.from('cases').update({
            amount_paid: newAmount,
            payment_status: newStatus
          }).eq('id', caseId);

          console.log(`Caso ${caseId} actualizado tras pago de ${type}. Nuevo status: ${newStatus}`);
        }
      } catch (dbError) {
        console.error("Error actualizando Supabase desde Webhook:", dbError);
      }
    }
  }

  return NextResponse.json({ received: true });
}
