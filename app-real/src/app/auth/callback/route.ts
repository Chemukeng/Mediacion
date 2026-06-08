import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  
  const cookieStore = await cookies();
  const nextFromCookie = cookieStore.get("next_url")?.value;
  const next = searchParams.get("next") ?? nextFromCookie ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && session?.user) {
      // Intentar insertar/actualizar el usuario en nuestra tabla custom 'users'
      const { email, user_metadata } = session.user;
      
      await supabase.from('users').upsert({
        id: session.user.id,
        email: email,
        full_name: user_metadata?.full_name || user_metadata?.name || email
      }, { onConflict: 'id' });
    }
  }

  if (nextFromCookie) {
    cookieStore.delete("next_url");
  }

  // Redirigir siempre a next (dashboard o invite por defecto)
  return NextResponse.redirect(`${origin}${next}`);
}
