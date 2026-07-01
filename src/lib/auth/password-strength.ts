export type PasswordStrengthLevel = 0 | 1 | 2 | 3 | 4;

export type PasswordStrengthResult = {
  level: PasswordStrengthLevel;
  score: number;
  checks: {
    minLength: boolean;
    hasLetter: boolean;
    hasNumber: boolean;
    hasSymbol: boolean;
  };
};

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const checks = {
    minLength: password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSymbol: /[^a-zA-Z0-9]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  let level: PasswordStrengthLevel = 0;
  if (password.length === 0) {
    level = 0;
  } else if (score <= 1) {
    level = 1;
  } else if (score === 2) {
    level = 2;
  } else if (score === 3) {
    level = 3;
  } else {
    level = 4;
  }

  return { level, score, checks };
}
