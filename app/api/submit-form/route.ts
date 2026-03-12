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
    if (webhookUrl) {
      formData.append('_webhook', webhookUrl);
    }
    
    // Forward to FormSubmit
    const response = await fetch('https://formsubmit.co/trey@aspenlabs.ai', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('FormSubmit error:', text);
      return NextResponse.json(
        { error: 'Failed to submit form' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
