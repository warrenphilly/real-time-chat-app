const moment = require('moment');

function formatMessgae(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    };
};

module.exports = formatMessgae;