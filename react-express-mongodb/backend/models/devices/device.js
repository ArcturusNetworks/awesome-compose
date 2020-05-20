const mongoose = require('mongoose');

const Device = mongoose.model('Device', {
    DUID : {
        type: String,
        trim: true,
        required: true,
        index: true
    },
    serviceName: {
    	type: String,
        trim: true,
        required: true
    },
    sysP0Ver: String,
    sysP1Ver: String,
    sysP2Ver: String,
    IPAddr0: String,
    IPAddr1: String
});

module.exports = {Device};
