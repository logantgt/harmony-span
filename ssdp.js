const Server = require('node-ssdp').Server;
const colorout = require("./coreoutput");
const fs = require('fs');

module.exports.run = async () =>
{
    var ip = JSON.parse(fs.readFileSync('config.json', 'utf8')).ip;
    ssdp = new Server
    ({
        "location":"http://localhost:8060/",
        "udn":"uuid:roku:ecp:HARMONYSPAN",
        "ssdpSig":'Server: Roku/9.3.0 UPnP/1.0 Roku/9.3.0'
    });
    
    ssdp.addUSN("roku:ecp");
    
    ssdp.start();
    
    colorout.Log("success", "SSDP server running on localhost!");

    process.on('exit', function()
    {
        ssdp.stop();
    })
}