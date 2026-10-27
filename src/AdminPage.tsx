import React, { useState } from 'react';
import { Copy, Link as LinkIcon, MessageCircle, CheckCircle } from 'lucide-react';
import { WEDDING } from './weddingConfig';

const PREFIXES = ['Mr.', 'Mrs.', 'Miss', 'Mr. & Mrs.', 'Family', 'Dear'] as const;
type Prefix = (typeof PREFIXES)[number];

// "Dear" is a message style, not a title: the greeting already starts with "Dear".
export function buildDisplayName(prefix: Prefix, name: string): string {
  const cleanName = name.trim().replace(/\s+/g, ' ');
  if (!cleanName) return '';
  switch (prefix) {
    case 'Family':
      return `${cleanName} and Family`;
    case 'Dear':
      return cleanName;
    default:
      return `${prefix} ${cleanName}`;
  }
}

function buildMessage(displayName: string, link: string): string {
  return `Dear ${displayName} ❤️

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${link}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ ${WEDDING.groomName} & ${WEDDING.brideName}`;
}

export function AdminPage() {
  const [prefix, setPrefix] = useState<Prefix>('Mr.');
  const [guestName, setGuestName] = useState('');
  const [generated, setGenerated] = useState<{ displayName: string; link: string } | null>(null);
  const [toast, setToast] = useState('');

  const handleGenerate = () => {
    const displayName = buildDisplayName(prefix, guestName);
    if (!displayName) return;
    const link = `${window.location.origin}/${encodeURIComponent(displayName)}`;
    setGenerated({ displayName, link });
  };

  const copy = async (text: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast(successMessage);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setToast('Copy failed — please copy manually');
    }
    setTimeout(() => setToast(''), 2000);
  };

  const message = generated ? buildMessage(generated.displayName, generated.link) : '';
  const inputClass =
    'w-full px-4 py-3 rounded-lg border border-brand-beige focus:ring-2 focus:ring-brand-beige-deep focus:border-transparent outline-none transition-all bg-white font-sans';
  const copyButtonClass =
    'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-brand-beige-deep text-brand-beige-deep font-sans text-xs tracking-[0.15em] uppercase hover:bg-brand-beige/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div className="min-h-screen bg-brand-ivory py-12 px-4 sm:px-6 lg:px-8 font-sans text-stone-800 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-[0_8px_30px_rgba(176,137,104,0.15)] overflow-hidden border border-brand-beige/50">
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-2 text-stone-800">Link Generator</h2>
            <p className="text-stone-500 font-sans text-sm uppercase tracking-[0.2em]">
              {WEDDING.brideName} & {WEDDING.groomName}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="prefix" className="block text-sm font-medium text-stone-700 mb-1 tracking-wide">
                Select Prefix
              </label>
              <select id="prefix" value={prefix} onChange={(e) => setPrefix(e.target.value as Prefix)} className={inputClass}>
                {PREFIXES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="guestName" className="block text-sm font-medium text-stone-700 mb-1 tracking-wide">
                Guest Name
              </label>
              <input
                type="text"
                id="guestName"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g. Sanjaya"
                className={inputClass}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!guestName.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-beige-deep text-white font-sans text-sm tracking-[0.2em] uppercase shadow-lg hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LinkIcon className="w-5 h-5" />
              Generate Link
            </button>

            {generated && (
              <div className="p-4 bg-brand-ivory rounded-xl border border-brand-beige/50 space-y-4">
                <div>
                  <p className="text-xs text-stone-500 mb-1 font-medium uppercase tracking-[0.15em]">Generated Link</p>
                  <a
                    href={generated.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block break-all text-sm text-brand-beige-deep underline underline-offset-2"
                  >
                    {generated.link}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-stone-500 mb-1 font-medium uppercase tracking-[0.15em]">Message Preview</p>
                  <pre className="whitespace-pre-wrap break-words text-sm text-stone-700 font-sans bg-white border border-brand-beige/50 rounded-md p-3 max-h-72 overflow-y-auto">
                    {message}
                  </pre>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button disabled={!generated} onClick={() => copy(generated!.link, 'Link copied!')} className={copyButtonClass}>
                <Copy className="w-4 h-4" />
                Copy Link Only
              </button>
              <button disabled={!generated} onClick={() => copy(message, 'Message copied!')} className={copyButtonClass}>
                <MessageCircle className="w-4 h-4" />
                Copy Full Message
              </button>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-stone-800 text-white text-sm px-5 py-3 rounded-full shadow-lg">
          <CheckCircle className="w-4 h-4 text-green-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
