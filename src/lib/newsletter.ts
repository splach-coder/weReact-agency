type NewsletterValidation = { valid: true } | { valid: false; message: string };

export function validateSubscriberEmail(email: string): NewsletterValidation {
  if (!/^\S+@\S+\.\S+$/.test(email.trim()) || email.length > 254) {
    return { valid: false, message: 'Please enter a valid email address.' };
  }

  return { valid: true };
}
