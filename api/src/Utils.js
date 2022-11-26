const methods = {};
module.exports = methods;

methods.mandatoryFieldCheck = (payload, mandatoryFields) => {
    let missingFields = [];
    mandatoryFields.forEach(mandatoryField => {
        if (payload[mandatoryField] === undefined || String(payload[mandatoryField]).trim().length === 0 ) {
            missingFields.push(mandatoryField);
        }
    });
    return {
        status: (missingFields.length === 0) ? true : false,
        missingFields: missingFields
    }
}

methods.buildMissingFieldResponse = (missingFields) => {
    return {
        status: false,
        errorMsg: 'Mandatory fields check failed',
        missingFields: missingFields
    }
}


