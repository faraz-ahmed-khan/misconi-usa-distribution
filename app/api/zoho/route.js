import { submitZohoContact } from '../../../src/lib/zoho.js';

function badRequest(message) {
  return Response.json({ success: false, message }, { status: 400 });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const fullName = body?.fullName?.trim() || '';
    const email = body?.email?.trim() || '';
    const phone = body?.phone?.trim() || '';
    const companyName = body?.companyName?.trim() || '';
    const message = body?.message?.trim() || '';

    if (!fullName) return badRequest('Full name is required.');
    if (!email) return badRequest('Email is required.');
    if (!message) return badRequest('Message is required.');

    await submitZohoContact({
      fullName,
      email,
      phone,
      companyName,
      message,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error?.message || 'Failed to submit contact form.',
      },
      { status: 500 }
    );
  }
}
