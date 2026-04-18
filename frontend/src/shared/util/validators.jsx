// VALIDATOR TYPES

export const VALIDATOR_TYPE_REQUIRE = "REQUIRE";
export const VALIDATOR_TYPE_MINLENGTH = "MINLENGTH";
export const VALIDATOR_TYPE_EMAIL = "EMAIL";


// VALIDATOR FUNCTIONS

export const VALIDATOR_REQUIRE = () => {
  return { type: VALIDATOR_TYPE_REQUIRE };
};

export const VALIDATOR_MINLENGTH = (val) => {
  return {
    type: VALIDATOR_TYPE_MINLENGTH,
    val: val
  };
};

export const VALIDATOR_EMAIL = () => {
  return { type: VALIDATOR_TYPE_EMAIL };
};


// VALIDATION FUNCTION

export const validate = (value, validators) => {

  let isValid = true;

  for (const validator of validators) {

    if (validator.type === VALIDATOR_TYPE_REQUIRE) {
      isValid =
        isValid &&
        value.trim().length > 0;
    }

    if (validator.type === VALIDATOR_TYPE_MINLENGTH) {
      isValid =
        isValid &&
        value.trim().length >= validator.val;
    }

    if (validator.type === VALIDATOR_TYPE_EMAIL) {
      isValid =
        isValid &&
        value.includes("@");
    }

  }

  return isValid;

};