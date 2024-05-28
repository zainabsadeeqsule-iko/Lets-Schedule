export const sleep = (ms = 0) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Validation */
export const validators = {
  email: (v: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(v) || 'Please enter a valid email address'
  },
  required: (v: any) => !!v || 'This field is required',
  minLength: (min: number) => (v: string) => (v && v.length >= min) || `This field must be at least ${min} characters`,
  maxLength: (max: number) => (v: string) => (v && v.length <= max) || `This field must not exceed ${max} characters`,
  numeric: (v: string) => {
    const pattern = /^\d+$/
    return pattern.test(v) || 'This field must contain only numeric characters'
  },
}
