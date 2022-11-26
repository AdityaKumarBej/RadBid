module.exports = {
    apps : [
        {
            name        : 'UI',
            script      : './Server.js',
            out_file    : '/var/log/ui.log',
            env         : {
                'NODE_ENV' : "production"
            }
        }
    ]
}