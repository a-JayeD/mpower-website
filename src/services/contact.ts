import { ApiError, insert } from '@/lib/api';

export interface ContactInput {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactErrorKind = 'duplicate' | 'busy' | 'invalid' | 'network' | 'unknown';

export class ContactError extends Error {
  constructor(public kind: ContactErrorKind) { super(kind); }
}

/** Submit the contact form. Only these five columns can be written by visitors. */
export async function sendContactMessage(v: ContactInput): Promise<void> {
  const clean = (s: string) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
  try {
    await insert('contact_messages', {
      name: clean(v.name),
      phone: clean(v.phone) || null,
      email: clean(v.email) || null,
      subject: clean(v.subject),
      message: clean(v.message),
    });
  } catch (e) {
    if (e instanceof ApiError) {
      if (e.hint === 'duplicate') throw new ContactError('duplicate');
      if (e.hint === 'busy') throw new ContactError('busy');
      if (e.code === '23514' || e.code === '22001') throw new ContactError('invalid');
      throw new ContactError('unknown');
    }
    throw new ContactError('network');
  }
}
