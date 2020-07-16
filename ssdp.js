const Server = require('node-ssdp').Server;
const colorout = require("./coreoutput");
const fs = require('fs');
var ip = require("ip");

module.exports.run = async () =>
{
    ssdp = new Server
    ({
        "location":"http://"+ ip.address() +":8060/",
        "udn":"uuid:roku:ecp:HARMONYSPAN",
        "ssdpSig":'Server: Roku/9.3.0 UPnP/1.0 Roku/9.3.0'
    });
    
    ssdp.addUSN("roku:ecp");
    
    ssdp.start();
    
    colorout.Log("success", "SSDP server running on "+ ip.address() +"!");

    colorout.Log("info", "HarmonySpan's Configuration Menu is available at http://localhost:8060/config");

    process.on('exit', function()
    {
        ssdp.stop();
    })
}