const Server = require('node-ssdp').Server;
const colorout = require("./coreoutput");

module.exports.run = async(httpServerUrl) => {
    ssdp = new Server({
        "location": httpServerUrl,
        "udn": "uuid:roku:ecp:HARMONYSPAN",
        "ssdpSig": 'Server: Roku/9.3.0 UPnP/1.0 Roku/9.3.0'
    });

    ssdp.addUSN("roku:ecp");
    ssdp.start();
    colorout.log("success", "[SSDP-Server] running and bound to all available network interfaces");

    process.on('SIGINT', function() {
        colorout.log("info", "[SSDP-Server] Shutting down SSDP server.");
        ssdp.stop();
    });
};