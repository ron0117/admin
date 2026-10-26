type Spec = { specKey: string; unitPoints: number };

export const POINT_SPEC_FIELDS: Record<string, string> = {
  '768p': 'unit768p',
  '1080p': 'unit1080p',
  '2k': 'unit2k',
  default: 'unitPoints',
  local: 'unitLocal',
  high: 'unitHigh',
  medium: 'unitMedium',
  good: 'unitGood'
};

/** Preserve the server's exact spec set, including older servers without local mode. */
export function pointPricesPayload(specs: Spec[], form: Record<string, unknown>) {
  return specs.map(spec => {
    const field = POINT_SPEC_FIELDS[spec.specKey];
    const unitPoints = field && Object.hasOwn(form, field) ? Number(form[field]) : spec.unitPoints;
    if (!Number.isSafeInteger(unitPoints) || unitPoints < 0) throw new Error('Invalid point price');
    return { specKey: spec.specKey, unitPoints };
  });
}
