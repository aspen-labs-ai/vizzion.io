import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Get FormSubmit's payload
    const body = await request.json();
    
    // Log the full payload to understand its structure
    console.log('FormSubmit webhook payload:', JSON.stringify(body, null, 2));
    
    // Try multiple ways to extract the data
    // FormSubmit might send it as nested object or different structure
    let name, email, industry, details;
    
    // Option 1: Direct properties
    if (body.name) {
      name = body.name;
      email = body.email;
      industry = body.industry;
      details = body.details;
    }
    // Option 2: Nested in 'data' or 'form_data'
    else if (body.data) {
      name = body.data.name;
      email = body.data.email;
      industry = body.data.industry;
      details = body.data.details;
    }
    else if (body.form_data) {
      name = body.form_data.name;
      email = body.form_data.email;
      industry = body.form_data.industry;
      details = body.form_data.details;
    }
    
    // Default to N/A if not found
    name = name || 'N/A';
    email = email || 'N/A';
    industry = industry || 'N/A';
    details = details || 'N/A';
    
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
