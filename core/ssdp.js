const Server = require('node-ssdp').Server;
const fs = require('fs');

module.exports.run = async () =>
{
    var ip = JSON.parse(fs.readFileSync('../config.json', 'utf8')).ip;
    ssdp = new Server
    ({
        "location":"http://" + ip + ":8060/",
        "udn":"uuid:roku:ecp:HARMONYSPAN",
        "ssdpSig":'Server: Roku/9.3.0 UPnP/1.0 Roku/9.3.0'
    });

    if(ip == "xxx.xxx.xxx.xxx")
    {
        console.log("Please set your machine's local IPv4 address in config.json! Cannot start SSDP server.");
        process.exit();
    }else
    {
        console.log("SSDP server running at " + ip + "");
    }
    
    ssdp.addUSN("roku:ecp");
    
    ssdp.start();
    
    process.on('exit', function()
    {
        ssdp.stop();
    })
}