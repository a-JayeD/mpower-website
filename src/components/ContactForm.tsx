import { useId, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { ContactError, sendContactMessage, type ContactInput } from '@/services/contact';
import { cn } from '@/utils/cn';
import { Icon } from './ui/Icon';

type Field = keyof ContactInput;
type Errors = Partial<Record<Field | 'form', string>>;

// Same rules as the database check constraints, so problems are caught before sending.
const PHONE_RE = /^\+?[0-9][0-9 -]{5,19}$/;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const LIMITS: Record<Field, number> = { name: 100, phone: 20, email: 200, subject: 200, message: 5000 };

export function ContactForm({ initialSubject = '' }: { initialSubject?: string }) {
  const { t, num } = useI18n();
  const e = t.contact.errors;
  const id = useId();
  const startedAt = useRef(Date.now());
  const [values, setValues] = useState<ContactInput>({ name: '', phone: '', email: '', subject: initialSubject, message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [honey, setHoney] = useState('');
  const statusRef = useRef<HTMLDivElement>(null);

  const validate = (v: ContactInput): Errors => {
    const out: Errors = {};
    if (v.name.trim().length < 2) out.name = e.name;
    const phone = v.phone.trim();
    const email = v.email.trim();
    if (phone && !PHONE_RE.test(phone)) out.phone = e.phone;
    if (email && !EMAIL_RE.test(email)) out.email = e.email;
    if (!phone && !email) out.phone = e.contact;
    if (v.message.trim().length < 5) out.message = e.message;
    for (const k of Object.keys(LIMITS) as Field[]) if (v[k].length > LIMITS[k]) out[k] = e.tooLong(num(LIMITS[k]));
    return out;
  };

  const set = (k: Field, value: string) => {
    const next = { ...values, [k]: value };
    setValues(next);
    if (submitted) setErrors(validate(next));
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    setSubmitted(true);
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = (['name', 'phone', 'email', 'subject', 'message'] as Field[]).find((k) => errs[k]);
      if (first) document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    // Bots fill hidden fields and submit instantly; people do neither.
    if (honey) { setDone(true); return; }
    if (Date.now() - startedAt.current < 3000) { setErrors({ form: e.tooFast }); return; }

    setSending(true);
    try {
      await sendContactMessage(values);
      setDone(true);
      requestAnimationFrame(() => statusRef.current?.focus());
    } catch (err) {
      const kind = err instanceof ContactError ? err.kind : 'unknown';
      setErrors({ form: kind === 'invalid' ? e.unknown : e[kind] });
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="rounded-lg border border-led/40 bg-led-soft p-6 outline-none">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-led text-white"><Icon name="check" className="h-5 w-5" /></span>
          <div>
            <h3 className="text-[1.2rem] font-semibold">{t.contact.successTitle}</h3>
            <p className="mt-1 text-ink-soft">{t.contact.successBody}</p>
            <button type="button" className="btn btn-outline mt-4"
              onClick={() => { setValues({ name: values.name, phone: values.phone, email: values.email, subject: '', message: '' }); setDone(false); setSubmitted(false); startedAt.current = Date.now(); }}>
              {t.contact.sendAnother}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const field = (k: Field, label: string, opts: { required?: boolean; type?: string; hint?: string; area?: boolean; autoComplete?: string; inputMode?: 'tel' | 'email' } = {}) => {
    const fid = `${id}-${k}`;
    const err = errors[k];
    const describedBy = [err ? `${fid}-err` : null, opts.hint ? `${fid}-hint` : null].filter(Boolean).join(' ') || undefined;
    const cls = cn('w-full rounded-md border bg-white px-4 text-[17px] text-ink placeholder:text-ink-muted/70 focus:border-trace focus:outline-none focus:ring-2 focus:ring-trace/30',
      err ? 'border-red-500' : 'border-line');
    return (
      <div>
        <label htmlFor={fid} className="mb-1.5 block font-medium text-ink">
          {label}{opts.required && <span className="ml-1 text-[14px] font-normal text-ink-muted">({t.contact.required})</span>}
        </label>
        {opts.area ? (
          <textarea id={fid} rows={6} value={values[k]} onChange={(ev) => set(k, ev.target.value)} aria-invalid={!!err} aria-describedby={describedBy}
            required={opts.required} maxLength={LIMITS[k] + 50} className={cn(cls, 'py-3 leading-relaxed')} />
        ) : (
          <input id={fid} type={opts.type ?? 'text'} value={values[k]} onChange={(ev) => set(k, ev.target.value)} aria-invalid={!!err} aria-describedby={describedBy}
            required={opts.required} autoComplete={opts.autoComplete} inputMode={opts.inputMode} maxLength={LIMITS[k] + 20} className={cn(cls, 'h-12')} />
        )}
        {opts.hint && !err && <p id={`${fid}-hint`} className="mt-1 text-[14px] text-ink-muted">{opts.hint}</p>}
        {err && <p id={`${fid}-err`} className="mt-1 flex items-center gap-1.5 text-[14px] text-red-700"><Icon name="alert" className="h-4 w-4 shrink-0" />{err}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5" aria-describedby={`${id}-intro`}>
      <p id={`${id}-intro`} className="text-ink-muted">{t.contact.formIntro}</p>
      {field('name', t.contact.name, { required: true, autoComplete: 'name' })}
      <div className="grid gap-5 sm:grid-cols-2">
        {field('phone', t.contact.phoneField, { type: 'tel', hint: t.contact.phoneHint, autoComplete: 'tel', inputMode: 'tel' })}
        {field('email', t.contact.emailField, { type: 'email', autoComplete: 'email', inputMode: 'email' })}
      </div>
      {field('subject', t.contact.subject, { hint: t.contact.subjectHint })}
      {field('message', t.contact.message, { required: true, area: true })}
      {/* honeypot: hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} tabIndex={-1} autoComplete="off" value={honey} onChange={(ev) => setHoney(ev.target.value)} />
      </div>
      <div aria-live="assertive">
        {errors.form && <p role="alert" className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-[15px] text-red-800"><Icon name="alert" className="mt-0.5 h-5 w-5 shrink-0" />{errors.form}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={sending} className="btn btn-dark min-w-[12rem] disabled:opacity-60">
          {sending ? t.contact.sending : t.contact.send}
        </button>
        <p className="text-[14px] text-ink-muted">{t.contact.privacy} <Link to="/privacy" className="link">{t.contact.privacyLink}</Link></p>
      </div>
    </form>
  );
}
