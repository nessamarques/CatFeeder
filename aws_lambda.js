var https = require('https');
exports.handler = function(event, context, callback) {
    var body = JSON.stringify({
    	".sv": "timestamp"
    })

    var options = {
      host: 'cat-feeder-ba350.firebaseio.com',
      port: 443,
      path: '/cat.json',
      method: 'POST'
    };

    var req = https.request(options, function(res) {
      console.log(res.statusCode);
      res.on('data', function(d) {
        process.stdout.write(d);
      });
    });
    req.end(body);
    
    req.on('error', function(e) {
      console.error(e);
    });
    callback(null, event);
}