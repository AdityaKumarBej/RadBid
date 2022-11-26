let applicationName = process.env.APP_NAME
/* Define the logging levels */
let LOGGING_LEVELS = {
    'NONE': 0,
    'LOG': 1,
    'INFO': 2,
    'WARN': 3,
    'ERROR': 4,
    'DEBUG': 5
};

/* Set the default value of logging level to 4
   Display all the levels upto the desired level.
   In this case, all the logging related to LOG,
   INFO, WARN and ERROR will be displayed/written
   to the console.
   This value can be overrided by setting the
   environment variable LOG_LEVEL.
*/

//let LOG_LEVEL = parseInt(process.env.LOG_LEVEL) || 2;
let LOG_LEVEL = (process.env.LOG_LEVEL) ? parseInt(process.env.LOG_LEVEL) : 2;
console.log("INFO: Logging Level is set to: " + Object.keys(LOGGING_LEVELS)[LOG_LEVEL]);

Object.defineProperty(global, '__stack', {
    get: function () {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function (_, stack) { return stack; };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});

Object.defineProperty(global, '__line', {
    get: function () {
        return __stack[2].getLineNumber();
    }
});

Object.defineProperty(global, '__func', {
    get: function () {
        return (__stack[2].getFunctionName() == null ? "main" : __stack[2].getFunctionName());
    }
});

/* Override the console methods */
['error', 'log', 'info', 'warn', 'debug'].forEach(function (method) {
    let fn = console[method];
    let tag = (method.toLocaleUpperCase() === "LOG") ? "INFO" : method.toUpperCase();
    console[method] = function () {
        /* Only if its within the desired logging level */
        if (LOG_LEVEL !== 0 && Number(LOGGING_LEVELS[method.toLocaleUpperCase()]) <= LOG_LEVEL) {
            /* Build the arguments array */
            let message = [`[${new Date().toUTCString()}] ${(applicationName) ? `[${applicationName}]` : ''} [${tag}] : `]
            for (let i = 0; i < arguments.length; i++) {
                message.push(arguments[i]);
            }
            return fn.apply(this, message);
        } else {
            return null;
        }
    };
});
