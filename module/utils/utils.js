const moment = require('moment')
const util = {
    successTrue: (status, message, data) => {
        return {
            status: status,
            success: true,
            message: message,
            data: data
        }
    },
    successFalse: (status, message) => {
        return {
            status: status,
            success: false,
            message: message
        }
    },
    getAfterCreateDate: (date) => {
        var createDate = moment(date)
        console.log(createDate)
        var currentDate = moment()
        console.log(currentDate)

        var diff = currentDate.diff(createDate,"day")

        if(diff == 0){
            return '오늘'
        } else if(diff < 8){
            return diff.toString().concat('일전')
        } else if(currentDate.diff(createDate,'year') == 0){
            return createDate.format('M월 DD일')
        } else {
            return createDate.format('YYYY.MM.DD')
        }
    },
    insertAfterCreateDateAtResult: (selectResult) => {
        for(i = 0;i<selectResult.length;i++){
            selectResult[i].after_create_date = util.getAfterCreateDate(selectResult[i].created_date)
        }
        return selectResult
    },
    cutSiteUrl: (url) => {
        var hostname;
        if (url.indexOf("//") > -1) {
            hostname = url.split('/')[2];
        }
        else {
            hostname = url.split('/')[0];
        }
        hostname = hostname.split(':')[0];
        hostname = hostname.split('?')[0];
        if(hostname.split('.').length > 2){
            var cuttingStr = hostname.split('.')[0]
            hostname = hostname.replace(cuttingStr.concat('.'),'')
        }
        return hostname;
    }
};

module.exports = util;