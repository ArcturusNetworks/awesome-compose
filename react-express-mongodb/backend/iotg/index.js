const tls = require('tls');
const fs = require('fs');
const path = require('path');

exports.connect = (app) => {

  console.log(process.cwd());

  const options = {
    host: "iotg.sipgear.net",
    port: 107,
    key: fs.readFileSync(path.join(__dirname, './certs/Mbarx-SM-server.key')),
    cert: fs.readFileSync(path.join(__dirname, './certs/Mbarx-SM-server.pem')),
    ca: [ fs.readFileSync(path.join(__dirname, './certs/Mbarx-SM-ca-chain.pem')) ],
    passphrase: "uClinux123",
    checkServerIdentity: () => { return null; },
  };

  var socket = tls.connect(options, function() {
    console.log('IoTG socket is connected',
                socket.authorized ? '(authorized)' : '(unauthorized)');
    app.emit("iotg-ready");
  });

  socket.send = (data) => {
  	console.log("[iotg] > '" + data + "'");
  	socket.write(data+"\n");
  }
  socket.setEncoding('utf8');
  socket.on('data', function(data) {
  	data = data.trim();
    console.log("[iotg] < '" + data + "'");
    if (data == ">") {
    	socket.emit('header');
    }
  });
  socket.on('end', function() {
    socket.close();
    console.log('IoTG socket is disconnected');
  });
  socket.on('header', function() {
  	socket.send("login remote admin");
  	socket.send("set prompt off");
  	socket.send("NK=1");
  	setInterval(()=>{
  		socket.send("RD");
  	}, 10000);
  });
}