const tls = require('tls');
const fs = require('fs');
const path = require('path');

exports.connect = (app) => {

  const options = {
    host: "iotg.sipgear.net",
    port: 107,
    key: fs.readFileSync(path.join(__dirname, './certs/Mbarx-SM-server.key')),
    cert: fs.readFileSync(path.join(__dirname, './certs/Mbarx-SM-server.pem')),
    ca: [ fs.readFileSync(path.join(__dirname, './certs/Mbarx-SM-ca-chain.pem')) ],
    passphrase: "uClinux123",
    checkServerIdentity: (hostname, cert) => { 
      console.debug(hostname, cert);
      return null; 
    },
  };

  var socket = tls.connect(options, function() {
    console.log('IoTG socket is connected',
                socket.authorized ? '(authorized)' : '(unauthorized)');
    app.emit("iotg-ready");
  });
  
  // wrapper functions
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
    } else if (data.startsWith("NK[") && data.endsWith("]")) {
      socket.emit("remote_registrar", data);
    }
  });

  socket.on('end', function() {
    socket.close();
    console.log('IoTG socket is disconnected');
  });
  
  // IoTG commands and response handling
  socket.on('header', function() {
    socket.send("login remote admin");
    socket.send("set prompt off");
    socket.send("NK=1");
    setInterval(()=>{
      socket.send("RD");
    }, 10000);
  });

  socket.on('remote_registrar', (notification) => {
    let kvpairs = notification.substring(3,notification.length-1).split(",");
    let registrar = {};
    kvpairs.map((kvpair, i) => {
      kvpair = kvpair.split("=");
      if (kvpair.length == 2)
        registrar[kvpair[0]] = kvpair[1];
    });
    
    if (!registrar.DUID)
      return;

    const params = {
      query: { DUID: registrar.DUID },
      mongoose: { upsert: true }
    };
    
    app
      .service("devices")
      // .patch(null, registrar, params)
      .create(registrar)
      .then(() => console.log(`registrar device '${JSON.stringify(registrar)}' created`))
      .catch((err) => console.error(`${err}\nCould not create registrar device '${JSON.stringify(registrar)}' from notification '${notification}'`));
  });
}