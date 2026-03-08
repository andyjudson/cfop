import { Alg } from 'cubing/alg'

export interface ValidationResult {
  isValid: boolean
  error: string | null
}

export function validateAlgorithm(input: string, fieldName: 'setup' | 'move', allowEmpty: boolean): ValidationResult {
  const trimmed = input.trim()

  if (trimmed.length === 0) {
    return {
      isValid: allowEmpty,
      error: allowEmpty ? null : `${fieldName} algorithm is required.`,
    }
  }

  try {
    Alg.fromString(trimmed)
    return {
      isValid: true,
      error: null,
    }
  } catch {
    return {
      isValid: false,
      error: `Invalid ${fieldName} algorithm notation.`,
    }
  }
}

export function invertAlgorithmNotation(input: string): string | null {
  const trimmed = input.trim()
  if (trimmed.length === 0) {
    return null
  }

  try {
    return Alg.fromString(trimmed).invert().toString()
  } catch {
    return null
  }
}
