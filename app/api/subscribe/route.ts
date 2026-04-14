import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const BodySchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 422 });
  }

  const { email } = parsed.data;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!audienceId) {
    // No audience configured — still return success so the UI works
    // before env vars are set up. Log server-side for visibility.
    console.warn('[subscribe] RESEND_AUDIENCE_ID not set — skipping contact creation');
    return NextResponse.json({ ok: true });
  }

  try {
    await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[subscribe] Resend error:', err);
    return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 });
  }
}
