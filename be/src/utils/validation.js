const { ValidationError } = require('./responseError');

function validate(schema, request) {
    const result = schema.validate(request, {
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: true,
    });

    if (result.error) {
        const errors = result.error.details.reduce((acc, error) => {
            acc[error.context.key] = error.message;
            return acc;
        }, {});

        throw new ValidationError('Validation failed', errors);
    }
    return result.value;
}

module.exports = { validate };