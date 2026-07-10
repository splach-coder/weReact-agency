export type ConsentChoice = 'accepted' | 'rejected';
type ConsentStatus = 'granted' | 'denied';

export type GoogleConsentState = {
  ad_storage: ConsentStatus;
  ad_user_data: ConsentStatus;
  ad_personalization: ConsentStatus;
  analytics_storage: ConsentStatus;
  functionality_storage: ConsentStatus;
  personalization_storage: ConsentStatus;
  security_storage: ConsentStatus;
};

export const CONSENT_STORAGE_KEY = 'wereact_cookie_consent_v1';
export const OPEN_CONSENT_PREFERENCES_EVENT = 'wereact:open-consent-preferences';

export function parseConsentChoice(value: unknown): ConsentChoice | null {
  return value === 'accepted' || value === 'rejected' ? value : null;
}

export function getConsentState(choice: ConsentChoice | null): GoogleConsentState {
  const status: ConsentStatus = choice === 'accepted' ? 'granted' : 'denied';

  return {
    ad_storage: status,
    ad_user_data: status,
    ad_personalization: status,
    analytics_storage: status,
    functionality_storage: status,
    personalization_storage: status,
    security_storage: 'granted',
  };
}