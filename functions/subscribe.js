export async function onRequestPost(context) {
  const { request, env } = context;

  let email;
  try {
    const body = await request.json();
    email = body.email;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400 });
  }

  const res = await fetch(
    'https://api.beehiiv.com/v2/publications/pub_93e361b4-4db5-45da-9c55-9a3c5db8ba46/subscriptions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.BEEHIIV_API_KEY}`
      },
      body: JSON.stringify({
        email,
        reactivate_existing: true,
        send_welcome_email: true
      })
    }
  );

  return new Response(
    JSON.stringify({ success: res.ok }),
    { status: res.ok ? 200 : 500, headers: { 'Content-Type': 'application/json' } }
  );
}
