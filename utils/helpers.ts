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
 * Checks if theres an intersection between 2 arrays
 * @param array1 - array of strings
 * @param array2 - array of strings
 * @returns Boolean
 */
export const intersects = (array1: any[], array2: any[]) => {
  for (let i = 0; i < array1.length; i += 1) {
    for (let j = 0; j < array2.length; j += 1) {
      if (array1[i] === array2[j]) return true
    }
  }
  return false
}
