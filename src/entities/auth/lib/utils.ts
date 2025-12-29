// entities/auth/lib/utils.ts
export function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (!cleaned.startsWith('+')) {
    return '+' + cleaned;
  }
  return cleaned;
}

export function detectContactType(contact: string): 'email' | 'phone' {
  return contact.includes('@') ? 'email' : 'phone';
}

export function formatContact(contact: string): string {
  const type = detectContactType(contact);

  if (type === 'phone') {
    return normalizePhone(contact);
  }

  return contact.toLowerCase().trim();
}

export function maskContact(contact: string): string {
  const type = detectContactType(contact);

  if (type === 'email') {
    const [username, domain] = contact.split('@');
    const maskedUsername = username.slice(0, 2) + '***' + username.slice(-1);
    return `${maskedUsername}@${domain}`;
  }

  const cleaned = contact.replace(/[\s\-\(\)]/g, '');
  const masked = cleaned.slice(0, -4).replace(/\d/g, '*') + cleaned.slice(-4);
  return masked;
}