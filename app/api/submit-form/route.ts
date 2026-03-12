import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Add hidden fields for FormSubmit
    formData.append('_subject', 'New Vizzion Lead');
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');
    
    // Only add webhook if configured
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    console.log('[API] Webhook configured:', !!webhookUrl);
    if (webhookUrl) {
      formData.append('_webhook', webhookUrl);
    }
    
    // Log form data keys (not values for privacy)
    console.log('[API] Form fields:', Array.from(formData.keys()));
    
    // Forward to FormSubmit
    console.log('[API] Sending to FormSubmit...');
    const response = await fetch('https://formsubmit.co/trey@aspenlabs.ai', {
      method: 'POST',
      body: formData,
    });

    console.log('[API] FormSubmit response status:', response.status);
    
    if (!response.ok) {
      const text = await response.text();
      console.error('[API] FormSubmit error response:', text);
      return NextResponse.json(
        { error: 'Failed to submit form', details: text },
        { status: 500 }
      );
    }

    const responseText = await response.text();
    console.log('[API] FormSubmit success response:', responseText);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Form submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
