/// Import Modules ///
const WebHooks = require('node-webhooks');
const fs = require('fs');
const Express = require('express');
const ssdp = require("./ssdp");
const colorout = require("./coreoutput");

/// Initialize Stuff ///
const app = Express();

webHooks = new WebHooks({db:{"": ["http://localhost:8060/"]}});

var btns = JSON.parse(fs.readFileSync('config.json', 'utf8'));

webHooks.add('Home', btns.Home.url);
webHooks.add('Rev', btns.Rev.url);
webHooks.add('Fwd', btns.Fwd.url);
webHooks.add('Play', btns.Play.url);
webHooks.add('Select', btns.Select.url);
webHooks.add('Left', btns.Left.url);
webHooks.add('Right', btns.Right.url);
webHooks.add('Down', btns.Down.url);
webHooks.add('Up', btns.Up.url);
webHooks.add('Back', btns.Back.url);
webHooks.add('InstantReplay', btns.InstantReplay.url);
webHooks.add('Info', btns.Info.url);
webHooks.add('Backspace', btns.Backspace.url);
webHooks.add('Search', btns.Search.url);
webHooks.add('Enter', btns.Home.url);

ssdp.run();

app.get('/', function (req, res)
{
    colorout.Log("info", req.ip + " found me! Sending RootResponse.xml..." );
    res.type('application/xml');
    res.send(fs.readFileSync('RootResponse.xml', 'utf8'));
    res.end();
})

/// Button Event Handlers ///
app.post('/keypress/Home', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Home" );
    webHooks.trigger('Home', JSON.parse(btns.Home.query), JSON.parse(btns.Home.header));
    res.end();
})

app.post('/keypress/Rev', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Rev" );
    webHooks.trigger('Rev', JSON.parse(btns.Rev.query), JSON.parse(btns.Rev.header));
    res.end();
})

app.post('/keypress/Fwd', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Fwd" );
    webHooks.trigger('Fwd', JSON.parse(btns.Fwd.query), JSON.parse(btns.Fwd.header));
    res.end();
})

app.post('/keypress/Play', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Play" );
    webHooks.trigger('Play', JSON.parse(btns.Play.query), JSON.parse(btns.Play.header));
    res.end();
})

app.post('/keypress/Select', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Select" );
    webHooks.trigger('Select', JSON.parse(btns.Select.query), JSON.parse(btns.Select.header));
    res.end();
})

app.post('/keypress/Up', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Up" );
    webHooks.trigger('Up', JSON.parse(btns.Up.query), JSON.parse(btns.Up.header));
    res.end();
})

app.post('/keypress/Down', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Down" );
    webHooks.trigger('Down', JSON.parse(btns.Down.query), JSON.parse(btns.Down.header));
    res.end();
})

app.post('/keypress/Left', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Left" );
    webHooks.trigger('Left', JSON.parse(btns.Left.query), JSON.parse(btns.Left.header));
    res.end();
})

app.post('/keypress/Right', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Right" );
    webHooks.trigger('Right', JSON.parse(btns.Right.query), JSON.parse(btns.Right.header));
    res.end();
})

app.post('/keypress/Back', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Back" );
    webHooks.trigger('Back', JSON.parse(btns.Back.query), JSON.parse(btns.Back.header));
    res.end();
})

app.post('/keypress/InstantReplay', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got InstantReplay" );
    webHooks.trigger('InstantReplay', JSON.parse(btns.InstantReplay.query), JSON.parse(btns.InstantReplay.header));
    res.end();
})

app.post('/keypress/Info', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Info" );
    webHooks.trigger('Info', JSON.parse(btns.Info.query), JSON.parse(btns.Info.header));
    res.end();
})

app.post('/keypress/Backspace', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Backspace" );
    webHooks.trigger('Backspace', JSON.parse(btns.Backspace.query), JSON.parse(btns.Backspace.header));
    res.end();
})

app.post('/keypress/Search', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Search" );
    webHooks.trigger('Search', JSON.parse(btns.Search.query), JSON.parse(btns.Search.header));
    res.end();
})

app.post('/keypress/Enter', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Enter" );
    webHooks.trigger('Enter', JSON.parse(btns.Enter.query), JSON.parse(btns.Enter.header));
    res.end();
})

var webserver = app.listen(8060, function ()
{
    var host = webserver.address().address
    var port = webserver.address().port
})