/// Import Modules ///
const WebHooks = require('node-webhooks');
const fs = require('fs');
const Express = require('express');
const ssdp = require("./ssdp");
const colorout = require("./coreoutput");
const request = require('request');

/// Initialize Stuff ///
const app = Express();

webHooks = new WebHooks({db:{"": ["http://localhost:8060/"]}});

var conf = JSON.parse(fs.readFileSync('config.json', 'utf8'));

var responses = [];

webHooks.add('Home', conf.Buttons[0].url);
webHooks.add('Rev', conf.Buttons[1].url);
webHooks.add('Fwd', conf.Buttons[2].url);
webHooks.add('Play', conf.Buttons[3].url);
webHooks.add('Select', conf.Buttons[4].url);
webHooks.add('Left', conf.Buttons[5].url);
webHooks.add('Right', conf.Buttons[6].url);
webHooks.add('Down', conf.Buttons[7].url);
webHooks.add('Up', conf.Buttons[8].url);
webHooks.add('Back', conf.Buttons[9].url);
webHooks.add('InstantReplay', conf.Buttons[10].url);
webHooks.add('Info', conf.Buttons[11].url);
webHooks.add('Backspace', conf.Buttons[12].url);
webHooks.add('Search', conf.Buttons[13].url);
webHooks.add('Enter', conf.Buttons[14].url);

request.shouldKeepAlive = false;

ssdp.run();

/// Send RootResponse.xml ///
app.get('/', function (req, res)
{
    if(!responses.includes(req.ip))
    {
        responses.push(req.ip);
        colorout.Log("info", req.ip + " found me! Sending RootResponse.xml..." );
    }
    res.type('application/xml');
    res.send(fs.readFileSync('RootResponse.xml', 'utf8'));
    res.end();
})

/// Webhook Trigger ///
function triggerWebhook(btnName, btnID)
{
    colorout.Log("debug", "[HarmonySpan] got " + btnName + " (" + conf.Buttons[btnID].requesttype + ": " + conf.Buttons[btnID].label + ")");
    if(conf.Buttons[btnID].requesttype == "POST")
    {
        webHooks.trigger(btnName, JSON.parse(conf.Buttons[btnID].query), JSON.parse(conf.Buttons[btnID].header));
    }
    else if(conf.Buttons[btnID].requesttype == "GET")
    {
        request(conf.Buttons[btnID].url, function (error, response, body)
        {
            if(error != null)
            {
                colorout.Log("error", "HTTP GET: " + response.statusCode + ", error: " + error);
            }
            else
            {
                colorout.Log("warning", "HTTP GET: " + response.statusCode);
            }
        });
    }
}

/// Button Event Handlers ///
app.post('/keypress/Home', function (req, res)
{
    triggerWebhook('Home', 0);
    res.end();
})

app.post('/keypress/Rev', function (req, res)
{
    triggerWebhook('Rev', 1);
    res.end();
})

app.post('/keypress/Fwd', function (req, res)
{
    triggerWebhook('Fwd', 2);
    res.end();
})

app.post('/keypress/Play', function (req, res)
{
    triggerWebhook('Play', 3);
    res.end();
})

app.post('/keypress/Select', function (req, res)
{
    triggerWebhook('Select', 4);
    res.end();
})

app.post('/keypress/Up', function (req, res)
{
    triggerWebhook('Up', 5);
    res.end();
})

app.post('/keypress/Down', function (req, res)
{
    triggerWebhook('Down', 6);
    res.end();
})

app.post('/keypress/Left', function (req, res)
{
    triggerWebhook('Left', 7);
    res.end();
})

app.post('/keypress/Right', function (req, res)
{
    triggerWebhook('Right', 8);
    res.end();
})

app.post('/keypress/Back', function (req, res)
{
    triggerWebhook('Back', 9);
    res.end();
})

app.post('/keypress/InstantReplay', function (req, res)
{
    triggerWebhook('InstantReplay', 10);
    res.end();
})

app.post('/keypress/Info', function (req, res)
{
    triggerWebhook('Info', 11);
    res.end();
})

app.post('/keypress/Backspace', function (req, res)
{
    triggerWebhook('Backspace', 12);
    res.end();
})

app.post('/keypress/Search', function (req, res)
{
    triggerWebhook('Search', 13);
    res.end();
})

app.post('/keypress/Enter', function (req, res)
{
    triggerWebhook('Enter', 14);
    res.end();
})

///
/// HarmonySpan Configuration API
///

app.get('/config/config.json', function (req, res)
{
    res.sendFile(__dirname + '/config.json');
})

app.get('/config', function (req, res)
{
    res.sendFile(__dirname + '/config_utility/config.html');
})

app.get('/config/write/btn', function(req, res)
{
    colorout.Log("warning", "Writing to configuration NOW! \nButton: " + req.query.btn + "\nLabel: " + req.query.lbl + "\nURL: " + req.query.url + "\nRequest Type: " + req.query.rqt + "\nRequest Header: " + req.query.hdr + "\nRequest Query: " + req.query.qry);
    conf.Buttons[req.query.btn].label = req.query.lbl;
    conf.Buttons[req.query.btn].url = req.query.url;
    conf.Buttons[req.query.btn].requesttype = req.query.rqt;
    conf.Buttons[req.query.btn].header = req.query.hdr;
    conf.Buttons[req.query.btn].query = req.query.qry;
    fs.writeFileSync("config.json", JSON.stringify(conf));
    res.status(200).end();
})

app.get('/config/write/ifttt', function(req, res)
{
    colorout.Log("warning", "Writing to configuration NOW! \nIFTTT URL: " + req.query.ifttt);
    conf.maker_url = req.query.ifttt;
    fs.writeFileSync("config.json", JSON.stringify(conf));
    res.status(200).end();
})

var webserver = app.listen(8060, function ()
{
    var host = webserver.address().address
    var port = webserver.address().port
})