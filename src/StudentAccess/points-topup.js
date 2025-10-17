// Helper logic for Points Top-Up component: validation and input sanitization

export function getAccountMaxLen(method) {
  if (method === 'GCash') return 11; // PH mobile
  if (method === 'UnionBank') return 12; // typical UB account length
  return 20;
}

export function sanitizeNumeric(value) {
  return (value || '').replace(/\D+/g, '');
}

export function sanitizeRequestedPoints(value) {
  if (value === '') return '';
  return /^\d+$/.test(value) ? value : '';
}

export function isAccountNumberValid(method, accountNumber) {
  if (method === 'GCash') return /^09\d{9}$/.test(accountNumber);
  if (method === 'UnionBank') return /^\d{12}$/.test(accountNumber);
  return !!accountNumber;
}

// Returns { value, error } where value is trimmed numeric string within max len
export function computeAccountValidationState(method, input) {
  const maxLen = getAccountMaxLen(method);
  const digits = sanitizeNumeric(input).slice(0, maxLen);

  if (method === 'GCash') {
    if (digits.length > 0 && !/^09/.test(digits)) {
      return { value: digits, error: 'GCash number must start with 09' };
    }
    if (digits.length === 11 && !/^09\d{9}$/.test(digits)) {
      return { value: digits, error: 'Enter a valid 11-digit GCash number starting with 09' };
    }
    return { value: digits, error: '' };
  }

  if (method === 'UnionBank') {
    if (digits.length === 12 || digits.length === 0) {
      return { value: digits, error: '' };
    }
    return { value: digits, error: 'Enter a valid 12-digit UnionBank account number' };
  }

  return { value: digits, error: '' };
}


