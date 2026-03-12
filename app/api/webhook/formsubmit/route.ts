import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Get FormSubmit's payload
    const body = await request.json();
    
    console.log('FormSubmit webhook payload:', JSON.stringify(body, null, 2));
    
    // FormSubmit sends form_data as a JSON string, not an object!
    let formData;
    if (body.form_data) {
      // Parse the JSON string
      formData = JSON.parse(body.form_data);
    } else {
      formData = body;
    }
    
    // Extract fields from the parsed data
    const name = formData.name || 'N/A';
    const email = formData.email || 'N/A';
    const industry = formData.industry || 'N/A';
    const details = formData.details || 'N/A';
    
    console.log('Extracted fields:', { name, email, industry, details });
    
    // Format for Slack (with @mention for Jak)
    const slackPayload = {
      text: `📬 *New Vizzion Form Submission*\n\n*Name:* ${name}\n*Email:* ${email}\n*Industry:* ${industry}\n*Details:* ${details}\n\n<@U0ADP3B8B6E> please draft a reply to this submission.`
    };
    
    // Forward to Slack
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    
    if (!slackWebhookUrl) {
      console.error('SLACK_WEBHOOK_URL not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }
    
    const slackResponse = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slackPayload),
    });
    
    if (!slackResponse.ok) {
      console.error('Slack webhook failed:', await slackResponse.text());
      return NextResponse.json(
        { error: 'Failed to post to Slack' },
        { status: 500 }
      );
    }
    
    console.log('Successfully posted to Slack');
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
