var express = require('express');
var router = express.Router();
var crypto = require('crypto')
var xml2js = require('xml2js');
var messageHelper = require('../helper/message')

////////////////////////////need to move to another file
var TOKEN = "fuzhong"
function checkSignature(signature, timestamp,nonce)
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

///////////////////////////////
function responseMsg(err, result)
{
    var returnObj = {};
    returnObj.page = 'message_text';
    returnObj.model = {};
    returnObj.model.toUser = result.xml.FromUserName[0];
    returnObj.model.fromUser = result.xml.ToUserName[0];
    returnObj.model.createTime = result.xml.CreateTime[0];
    returnObj.model.msgType = result.xml.MsgType[0];
    returnObj.model.content = 'echo:'+ result.xml.Content;

    return returnObj;
}



///////////////////////////////
/* POST home page. */
router.post('/', function(req, res) {
    if (checkSignature(req.query.signature,req.query.timestamp,req.query.nonce))
    {
        var parseString = require('xml2js').parseString;
        parseString(req.body, {trim: true}, function (err, result) {
            //res.send(responseMsg(err, result))
            var respObj = messageHelper.responseMsg(err, result);
            res.render(respObj.page, respObj.model);
        });
    }
    else
    {
        res.send("haha!Invalid");
    }
  //res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/', function(req, res) {
    var echostr = req.query.echostr;
    var signature = req.query.signature;
    
    
    if (messageHelper.checkSignature(signature,req.query.timestamp,req.query.nonce))
    {
        if (typeof(echostr) == "undefined") 
        {
            res.send("haha!No echostr");
        }else{
            res.send(echostr);
        }
    }
    else
    {
        res.send("haha!Invalid");
    }
  //res.render('index', { title: 'Express' });
});

module.exports = router;
