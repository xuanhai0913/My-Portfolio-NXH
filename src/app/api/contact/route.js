import { createClient } from '@vercel/edge-config';

export async function POST(request) {
  try {
    const edge = createClient(process.env.EDGE_CONFIG);
    const { name, email, message } = await request.json();

    // Get existing messages
    const messages = await edge.get('contact_messages') || [];
    
    // Add new message
    const newMessage = {
      id: Date.now(),
      name,
      email,
      message,
      created_at: new Date().toISOString()
    };

    // Update messages in Edge Config
    await edge.set('contact_messages', [...messages, newMessage]);

    return new Response(JSON.stringify({
      success: true,
      message: 'Message sent successfully!'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Edge Config error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Server error, please try again'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
