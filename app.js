
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv'),
    http = require('http'),
    path = require('path'),
    fs = require('fs');

// create a new express server
var app = express();

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
app.use('/style', express.static(path.join(__dirname, '/style')));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();



app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());

// development only
if ('development' == app.get('env')) {
	app.use(errorHandler());
}

//----------------------------------------------------------------------------------------

var watson = require('watson-developer-cloud');
var conversation_username='f888870e-d090-4868-ac66-79e4d1c2cc88';//substitua pelo username do seu serviço
var conversation_password='zMXIndqK831k'//substitua pelo password do seu serviço
//credenciais de acesso ao serviço do Watson Conversation
var conversation = watson.conversation({
  username: conversation_username,
  password: conversation_password,
  version: 'v1',
  version_date: '2016-07-11'
});


//Worskpace ID a ser mudado pelo seu Conversation
var workspace = process.env.WORKSPACE_id ||'877f1af4-4643-4ebc-9c61-4e2091444289'// 'e8a9bc68-cfdc-4f8a-b48e-e6abcec2b4d7';


app.post('/converse', function(req, res, next) {
  var payload = {
    workspace_id: workspace,
    context: {},
    input: {}
  };
  if (req.body) {
    if ( req.body.input ) {
      payload.input = {text: req.body.input};
    }
    if (req.body.context) {
      payload.context = req.body.context;
    }
  }else{
    payload = {};
      }
  conversation.message(payload, function(err, data){
    if ( err ) {
      console.log(err);
    }else{

      // if(!data.output.text[0]){
      //   data.output.text[0] = resposta[data.intents[0].intent];
      // }
      return res.json(data);
    }
  });

});




//------------------------------------------------------------------------------------
// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});



//-----------------------------------


var request = require('request');

var options = {
    url: "http://fipeapi.appspot.com/api/1/carros/marcas/fiat",
    headers: {
        Accept: 'text/json'
    }
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(info);
    }
}
request(options, callback);


