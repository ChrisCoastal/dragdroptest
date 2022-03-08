// Validation
export interface Validation {
  value: string | number;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

export function validate(formInput: Validation) {
  let isValid = true;
  if (formInput.required) {
    isValid = isValid && formInput.value.toString().trim().length !== 0;
  }
  if (formInput.minLength != null && typeof formInput.value === "string") {
    isValid = isValid && formInput.value.length >= formInput.minLength;
  }
  if (formInput.maxLength != null && typeof formInput.value === "string") {
    isValid = isValid && formInput.value.length <= formInput.maxLength;
  }
  if (formInput.min != null && typeof formInput.value === "number") {
    isValid = isValid && formInput.value >= formInput.min;
  }
  if (formInput.max != null && typeof formInput.value === "number") {
    isValid = isValid && formInput.value <= formInput.max;
  }
  //
  return isValid;
}
