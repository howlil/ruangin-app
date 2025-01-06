const { ResponseError } = require('./responseError.js');

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

        throw new ResponseError(400, "Data is invalid", errors);
    } 
    return result.value;
}

module.exports = { validate };