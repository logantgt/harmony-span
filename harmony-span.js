/// Import Modules ///
const WebHooks = require("node-webhooks");
const fs = require("fs");
const Express = require("express");
const ssdp = require("./ssdp");
const colorout = require("./coreoutput");
const request = require("request");
const mqtt = require("mqtt");
const yaml = require("node-yaml");
const ip = require("ip");
const { exec } = require("child_process");

const CONFIG_FILE = "config.yaml";
const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 8060;

let conf;
let port;
let host;
let app;
let server;
let webHooks;
let mqttClient;
// Array of client's IP-addresses. Clients are Logitech Harmony Hubs
let clients = [];

function init() {
    conf = yaml.readSync(CONFIG_FILE);
    if (conf.webserverConfig.hasOwnProperty("bindHost") && conf.webserverConfig.bindHost != "") {
        host = conf.webserverConfig.bindHost;
        if (host == "0.0.0.0") {
            colorout.log("debug", "[Webserver] Binding to all available local IPs; one is " + ip.address());
        } else {
            colorout.log("debug", "[Webserver] Found webserver-host in config-file. Using " + host);
        }
    } else {
        host = DEFAULT_HOST;
        colorout.log("debug", "[Webserver]: Found no webserver-host in config-file. Falling back to " + host);
    }

    if (conf.webserverConfig.hasOwnProperty("port") && conf.webserverConfig.port != "") {
        port = conf.webserverConfig.port;
        colorout.log("debug", "[Webserver] Found port in config-file. Using " + port);
    } else {
        port = DEFAULT_PORT;
        colorout.log("debug", "[Webserver] Found no port in config-file. Falling back to " + port);
    }

    app = Express();

    webHooks = new WebHooks({ db: {} });

    request.shouldKeepAlive = false;

    attachWebhooks();

    configureWebserverRoutes();

    if (host == "0.0.0.0") {
        ssdp.run("http://" + ip.address() + ":" + port + "/");
    } else {
        ssdp.run("http://" + host + ":" + port + "/");
    }

    process.on("SIGINT", () => {
        colorout.log("info", "[Webserver] Shutting down");
        server.close();
        process.exit();
    });

    if (host == "0.0.0.0") {
        // bind to all IPs.
        server = app.listen(port);
    } else {
        server = app.listen(port, host);
    }

    let mqttConfig = conf.mqttConfig;
    if (mqttConfig.hasOwnProperty("serverUrl") && mqttConfig.hasOwnProperty("serverUsername") && mqttConfig.hasOwnProperty("serverPassword") && mqttConfig.enabled == true) {
        connectMqttServer();
    }

    if (host == "0.0.0.0") {
        colorout.log("info", "[Webserver] Configuration Menu available at http://" + ip.address() + ":" + port + "/config/");
    } else {
        colorout.log("info", "[Webserver] Configuration Menu available at http://" + host + ":" + port + "/config/");
    }
}

function attachWebhooks() {
    conf.buttons.forEach(function(button) {
        webHooks.remove(button.name);
        if (button.action == "POST") webHooks.add(button.name, button.url);
    });
}

function connectMqttServer() {
    // TODO check if client is connected
    mqttClient = mqtt.connect(conf.mqttConfig.serverUrl, {
        username: conf.mqttConfig.serverUsername,
        password: conf.mqttConfig.serverPassword,
        reconnectPeriod: 0,
        connectTimeout: 5 * 1000
    });
    mqttClient.on("connect", function() {
        colorout.log("debug", "[MQTT-Connection] connected to MQTT-server");
    })
    mqttClient.on("error", function() {
        colorout.log("error", "[MQTT-Connection] could not connect to MQTT-server");
    });
}

function configureWebserverRoutes() {
    // server static content from public directory (http://.../config/*)
    app.use(Express.static('public'));
    // automatically interpret incoming post messages as JSON if Content-Type=application/json
    app.use(Express.json());

    // log all requests to debug
    app.use((req, res, next) => {
        colorout.log("debug", "[Webserver] " + req.method + " " + req.url + " from " + req.ip);
        next();
    });

    /// Send RootResponse.xml ///
    app.get('/', (req, res) => {
        if (!clients.includes(req.ip)) {
            clients.push(req.ip);
            colorout.log("info", "[Webserver] Logitech Hub at " + req.ip + " found me! Sending RootResponse.xml...");
        }
        res.type('application/xml');
        res.send(fs.readFileSync('RootResponse.xml', 'utf8'));
        res.end();
    });

    /// Button Event Handler ///
    app.post('/keypress/:action', function(req, res) {
        triggerAction(req.params['action']);
        res.end();
    });

    ///
    /// HarmonySpan Configuration API
    ///

    // get all buttons config
    app.get('/buttons/', function(req, res) {
        if (!req.accepts('json')) {
            res.sendStatus(415);
        } else {
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(conf.buttons));
        }
    });

    // get specific button config
    app.get('/buttons/:id', function(req, res) {
        if (!req.accepts('json')) {
            res.sendStatus(415);
        } else {
            let id = req.params['id'];
            if (!id.match(/[0-9]{1,2}/) || parseInt(id) < 0 || parseInt(id) > conf.buttons.length - 1) {
                res.send(404);
            } else {
                res.set('Content-Type', 'application/json');
                res.send(conf.buttons[id]);
            }
        }
    });

    // set specific button's config
    app.put('/buttons/:id', function(req, res) {
        // TODO validate
        let data = req.body;
        conf.buttons[data.id] = data;
        res.sendStatus(204);
        yaml.writeSync(CONFIG_FILE, conf);
        attachWebhooks();
        colorout.log("debug", "[Core] Updated config file.");
    });

    // get MQTT server config
    app.get('/mqttconfig', function(req, res) {
        res.contentType('application/json');
        res.send(JSON.stringify(conf.mqttConfig));
    });

    // set MQTT server config
    app.post('/mqttconfig', function(req, res) {
        let data = req.body;
        let enabledBefore = conf.mqttConfig.enabled;
        let enabledAfter = data.enabled;
        if (enabledBefore != enabledAfter) {

        }
        conf.mqttConfig = data;
        yaml.writeSync(CONFIG_FILE, conf);
        colorout.log("debug", "[Core] Updated config file.");
        if (enabledBefore != enabledAfter) {
            if (enabledAfter) {
                connectMqttServer();
            } else {
                mqttClient.end();
            }
        }
        res.sendStatus(204);
    });

    app.get('/mqttconnected', function(req, res) {
        res.set("Content-Type", "application/json");
        res.send("{\"connected\": " + mqttClient.connected + " }");
    });
}

function triggerAction(buttonFunction) {
    let buttonIndex = getButtonIndex(buttonFunction);
    let button = conf.buttons[buttonIndex];
    if (button.enabled) {
        switch (button.action) {
            case "SCRIPT":
            // check if script file exists
            if (fs.existsSync(button.scriptLocation)) {
                // file exists, so try to run it
                colorout.log("debug", "Running script file: " + button.scriptLocation);
                exec(button.scriptLocation, (error, stdout, stderr) => {
                        if (error){
                            colorout.log("error", "Error running script file " + button.scriptLocation + ". Error Message:\n" + error.message);
                            return;
                        }
                        if (stderr){
                            colorout.log("error", "Error running script file " + button.scriptLocation + ". STDERR:\n" + stderr);
                            return;
                        }
                        colorout.log("debug", "Output of script file " + button.scriptLocation + ":\n" + stdout);
                    });
                }
                else{
                    // file doesn't exist
                    colorout.log("error", "Script file " + button.scriptLocation + " doesn't exist.")
                }
            	break;            
            case "GET":
                request(button.url, function(error, response, body) {
                    if (error != null) {
                        colorout.log("error", "[Webserver] HTTP GET: error: " + error);
                    } else {
                        colorout.log("debug", "[Webserver] HTTP GET: " + response.statusCode);
                    }
                });
                break;
            case "POST":
                webHooks.trigger(button.name, JSON.parse(button.postPayload), button.httpHeaders);
                // console.log(JSON.parse(button.postPayload));
                break;
            case "MQTT":
                if (mqttClient && mqttClient.connected) {
                    mqttClient.publish(button.mqttTopic, button.mqttMessage);
                    colorout.log("debug", "[MQTT-Connection] Sent mqtt message");
                } else {
                    // TODO try reconnect
                    colorout.log("error", "[MQTT-Connection] MQTT not connected");
                }
                break;
            default:
                colorout.log("error", "[Core] Unknown action: " + button.action);
        }
    } else {
        colorout.log("debug", "[Core] Button disabled. Won't fire action");
    }
}

function getButtonIndex(btnFunction) {
    let i;
    for (i = 0; i < conf.buttons.length; i++) {
        if (conf.buttons[i].name == btnFunction) return i;
    }
    return -1;
}

init();
