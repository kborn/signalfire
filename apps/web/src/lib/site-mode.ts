export type SiteMode = 'portfolio' | 'demo';

export function getSiteMode(): SiteMode {
  return process.env.NEXT_PUBLIC_SITE_MODE === 'demo' ? 'demo' : 'portfolio';
}

export function isAdminExposed(): boolean {
  return getSiteMode() === 'portfolio';
}
