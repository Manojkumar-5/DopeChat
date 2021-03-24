const Joi = require('joi');

const passwordValidator = Joi.string()
	.pattern(
		/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/
	)
	.trim()
	.required();

const loginSchema = Joi.object({
	email: Joi.string().email().trim().required(),
	password: passwordValidator,
});

/* // USAGE

const user = {
	email: 'akash.menon@hyperverge.co',
	password: 'Ronaldo@07',
};

const { error, value } = loginSchema.validate(user);
if (error) console.error(error.name);
else console.log(value);

*/

const signupSchema = Joi.object({
	email: Joi.string().email().trim().required(),
	password: passwordValidator,
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	dob: Joi.date().required(),
	mobile: Joi.string().length(10).required(),
});

module.exports = {
	loginSchema,
	signupSchema,
};
