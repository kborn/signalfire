type EventLocation = {
  city?: string | null;
  region?: string | null;
  country?: string | null;
};

const COUNTRY_TIMEZONE_BY_CODE: Record<string, string> = {
  PR: 'America/Puerto_Rico',
  USA: 'America/New_York',
  US: 'America/New_York',
  'UNITED STATES': 'America/New_York',
};

const REGION_TIMEZONE_BY_CODE: Record<string, string> = {
  AL: 'America/Chicago',
  AK: 'America/Anchorage',
  AZ: 'America/Phoenix',
  AR: 'America/Chicago',
  CA: 'America/Los_Angeles',
  CO: 'America/Denver',
  CT: 'America/New_York',
  DC: 'America/New_York',
  DE: 'America/New_York',
  FL: 'America/New_York',
  GA: 'America/New_York',
  HI: 'Pacific/Honolulu',
  IA: 'America/Chicago',
  ID: 'America/Denver',
  IL: 'America/Chicago',
  IN: 'America/New_York',
  KS: 'America/Chicago',
  KY: 'America/New_York',
  LA: 'America/Chicago',
  MA: 'America/New_York',
  MD: 'America/New_York',
  ME: 'America/New_York',
  MI: 'America/New_York',
  MN: 'America/Chicago',
  MO: 'America/Chicago',
  MS: 'America/Chicago',
  MT: 'America/Denver',
  NC: 'America/New_York',
  ND: 'America/Chicago',
  NE: 'America/Chicago',
  NH: 'America/New_York',
  NJ: 'America/New_York',
  NM: 'America/Denver',
  NV: 'America/Los_Angeles',
  NY: 'America/New_York',
  OH: 'America/New_York',
  OK: 'America/Chicago',
  OR: 'America/Los_Angeles',
  PA: 'America/New_York',
  PR: 'America/Puerto_Rico',
  RI: 'America/New_York',
  SC: 'America/New_York',
  SD: 'America/Chicago',
  TN: 'America/Chicago',
  TX: 'America/Chicago',
  UT: 'America/Denver',
  VA: 'America/New_York',
  VT: 'America/New_York',
  WA: 'America/Los_Angeles',
  WI: 'America/Chicago',
  WV: 'America/New_York',
  WY: 'America/Denver',
};

const CITY_REGION_OVERRIDES: Record<string, string> = {
  'EL PASO|TX': 'America/Denver',
  'SAN JUAN|PR': 'America/Puerto_Rico',
};

function normalize(value?: string | null): string {
  return value?.trim().toUpperCase() ?? '';
}

export function resolveEventTimeZone({ city, region, country }: EventLocation): string | null {
  const normalizedRegion = normalize(region);
  const normalizedCity = normalize(city);
  const normalizedCountry = normalize(country);

  const cityRegionKey = `${normalizedCity}|${normalizedRegion}`;
  const cityRegionMatch = CITY_REGION_OVERRIDES[cityRegionKey];
  if (cityRegionMatch) {
    return cityRegionMatch;
  }

  const regionMatch = REGION_TIMEZONE_BY_CODE[normalizedRegion];
  if (regionMatch) {
    return regionMatch;
  }

  return COUNTRY_TIMEZONE_BY_CODE[normalizedCountry] ?? null;
}
