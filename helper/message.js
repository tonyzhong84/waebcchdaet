var crypto = require('crypto')

////////////////////////////need to move to another file
var TOKEN = "fuzhong"
module.exports.checkSignature = function (signature, timestamp,nonce)
{

    var tempArr = [];
   
    tempArr.push(TOKEN);
    tempArr.push(timestamp);
    tempArr.push(nonce);
    tempArr.sort();
    
    var shasum = crypto.createHash('sha1');
    shasum.update(tempArr.join(''));
    
    var tmpStr = shasum.digest('hex');

    if( tmpStr == signature ){
        return true;      
    }else{
        return false;
    }
}

module.exports.responseMsg = function (err, result)
{
    var returnObj = {'data':{}};

    returnObj.data.toUser = result.xml.FromUserName[0];
    returnObj.data.fromUser = result.xml.ToUserName[0];
    returnObj.data.createTime = result.xml.CreateTime[0];
    returnObj.data.msgType = result.xml.MsgType[0];
    //TODO:catch the error here
    require('/model/message/'+result.xml.MsgType[0]).buildModel(returnObj, result);

    return returnObj;
}