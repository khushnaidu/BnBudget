// src/utils/validators.ts


  // Allow free typing letters, numbers, special chars
  export const isNameTypingAllowed = (value: string): boolean => {
    const regex = /^[\w\s&'(),./#+-]*$/;
    return regex.test(value);
  };

  // Validate full name on submit
export const isValidName = (name: string): boolean => {
    const regexFull = /^[A-Za-z0-9\s&'(),./#+-]+$/;  // Full allowed characters
    const regexStartsWithLetter = /^[A-Za-z]/;       // Must start with a letter
    return (
      regexFull.test(name.trim()) && 
      !/^\d+$/.test(name.trim()) &&                  // Not pure numbers
      regexStartsWithLetter.test(name.trim()) &&     // Must start with letter
      !/[&'(),./#+-\s]$/.test(name.trim())            // Must not end with special char
    );
  };

  // Allow typing for numbers and decimal
  export const isNumberTypingAllowed = (value: string): boolean => {
    const regex = /^(\d+)?(\.\d*)?$/;
    return regex.test(value);
  };
  
  // General Validators
  export const isRequired = (value: string | number): boolean => {
    return value !== '' && value !== undefined && value !== null;
  };
  
  export const isPositiveNumber = (value: string | number): boolean => {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  };
  
  export const isNonNegativeNumber = (value: string | number): boolean => {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
  };
  
  export const isPercentage = (value: string | number): boolean => {
    const num = Number(value);
    return !isNaN(num) && num >= 0 && num <= 100;
  }; 