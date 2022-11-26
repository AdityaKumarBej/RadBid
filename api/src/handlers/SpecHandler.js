const fs            = require('fs');
const path          = require('path');
const express       = require('express');
const router        = express.Router()

router.get('/:format', (req, res) => {
    let format = req.params.format;
    let options = {
        root: path.join(__dirname, '../../public'),
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
        }
      }
    if(format.toLowerCase() === 'json') {
        res.sendFile('openapi.json', options)
    } else if(format.toLowerCase() === 'yaml') {
        res.sendFile('openapi.yaml', options)
    } else {
        res.status(400).send({status: false, msg: 'Unknown Specification Format'})
    }
})

module.exports = router;
