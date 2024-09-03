const passwordValidator = require('password-validator');

const usernameSchema = new passwordValidator();

usernameSchema
    .is().min(3)                                    // Minimum length 3
    .is().max(30)                                   // Maximum length 30
    .has().not().spaces()                           // Should not have spaces
    .has().letters()                                // Must have letters
    .is().not().oneOf(['admin', 'root', 'user']);   // Blacklist these values

const validateUsername = (username) => 
{
    return usernameSchema.validate(username, { details: true });
}

module.exports = validateUsername;
