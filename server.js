const http = require('http');
const fs = require('fs');
const path = require('path');

// Define the server
const server = http.createServer(function (req, res) {
	// Custom path aliases
	if (req.url == '/' || req.url == '/home') {
		req.url = '/index.html';
	}

	// Get the file path of the requested resource by adding a leading period
	var filePath = "." + req.url;

	// Serve the correct content type
	// Based upon the file extension of the requested resource
    var extName = path.extname(filePath);
    var contentType = 'text/html';
    switch (extName) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;      
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
	}

	// Create the response
	console.log(req.connection.remoteAddress + ' requested "' + req.url + '"')
	fs.readFile(filePath, function(err, data) {
		if (err) {
			// Respond with a 404 error for an unknown resource
			res.writeHead(404, {'Content-Type': 'text/html'});
			console.log('Responded with "404 not found"\n')
			return res.end("404 Not Found");
		}
		// Respond with the specified resource
		res.writeHead(200, {'Content-Type': contentType});
		res.write(data);
		console.log('Responded with "' + req.url + '" content type "' + contentType + '"\n')
		return res.end();
	});
})


console.log("Server started");

// Start the http server
server.listen(80);