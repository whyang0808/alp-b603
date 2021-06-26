/**
 * Checks if the object has keys with values that are undefined or null.
 * Optional fields are allowed, for example -> optionalFields = ['phone'],
 * means the "phone" value in "data" object is allowed to be undefined or null.
 * @param data - object
 * @param optionalFields - key of optional fields in object
 */
export const validateObject = (data: Record<string, any>, optionalFields: string[]) => {
  for (const key of Object.keys(data)) {
    const val = data[key]
    // empty string is allowed
    if (val === undefined || val === null) {
      if (!optionalFields.includes(key)) {
        throw 'FORM_INCOMPLETE'
      }
    }
  }
}

/**
 * Validates if an email is in the format "anything@anything.anything"
 * https://stackoverflow.com/a/9204568/15091497
 * @param email - string
 * @returns boolean
 */
export const validateEmail = (email?: string): boolean => {
  if (!email) return false
  const re = /^[^\s@]+@[^\s@]+$/
  return re.test(email)
}
