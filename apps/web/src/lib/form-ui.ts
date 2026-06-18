export function getScrollBehavior(): ScrollBehavior {
  if (typeof window.matchMedia !== 'function') {
    return 'smooth';
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

export function focusAndScrollTo(id: string) {
  const element = document.getElementById(id);
  if (!(element instanceof HTMLElement)) {
    return;
  }

  element.focus({ preventScroll: true });
  element.scrollIntoView({
    behavior: getScrollBehavior(),
    block: 'center',
  });
}

export function getFieldA11y<TField extends string>(
  field: TField,
  errors: Partial<Record<TField, string>>,
  prefix: string,
  helperId?: string,
) {
  const describedBy = [helperId, errors[field] ? `${prefix}-${field}-error` : null]
    .filter(Boolean)
    .join(' ');

  return {
    'aria-describedby': describedBy || undefined,
    'aria-invalid': errors[field] ? true : undefined,
  };
}
