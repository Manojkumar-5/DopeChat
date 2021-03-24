import PasswordValidator from 'password-validator';

const schema = new PasswordValidator();

schema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase(1) // Must have uppercase letters
  .has()
  .lowercase(1) // Must have lowercase letters
  .has()
  .digits(1)
  .has()
  .symbols(1) // Must have at least 2 digits
  .has()
  .not()
  .spaces(); // Should not have spaces

const passwordValidator = (password) => schema.validate(password);

export default passwordValidator;
