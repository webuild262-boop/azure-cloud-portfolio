export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { name, email } = await request.json();

    const filename = `lead-${Date.now()}.json`;
    const blobContent = JSON.stringify({ 
      name, 
      email, 
      timestamp: new Date().toISOString() 
    });

    const azureUrl = `${env.AZURE_BLOB_BASE_URL}/${filename}?${env.AZURE_SAS_TOKEN}`;

    const response = await fetch(azureUrl, {
      method: 'PUT',
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': 'application/json'
      },
      body: blobContent
    });

    if (!response.ok) {
      throw new Error('Azure Blob upload failed');
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to process lead' }), { status: 500 });
  }
}
