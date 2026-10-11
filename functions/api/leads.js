export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const data = await request.json();

    const filename = `lead-${Date.now()}.json`;
    const payload = JSON.stringify({
      ...data,
      timestamp: new Date().toISOString()
    });

    await env.LEADS_BUCKET.put(filename, payload, {
      httpMetadata: { contentType: 'application/json' }
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
