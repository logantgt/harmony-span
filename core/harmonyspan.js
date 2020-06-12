/// Import Modules ///
const WebHooks = require('node-webhooks');
const fs = require('fs');
const Express = require('express');
const ssdp = require("./ssdp");

/// Initialize Stuff ///
const app = Express();

webHooks = new WebHooks
({
    db: {"addPost": ["http://localhost:9100/posts"]}
});

var btns = JSON.parse(fs.readFileSync('../assignments.json', 'utf8'));

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
    console.log( "Harmony Hub found me! Sending response..." );
    res.type('application/xml');
    res.send(fs.readFileSync('../RootResponse.xml', 'utf8'));
    res.end();
})

/// Button Event Handlers ///
app.post('/keypress/Home', function (req, res)
{
    console.log( "[Pressed] Home" );
    webHooks.trigger('Home', JSON.parse("{\""+btns.Home.label +"\":\""+btns.Home.data+"\"}"), {header:"Content-Type: application/json"});
    res.end();
})

app.post('/keypress/Rev', function (req, res)
{
    console.log( "[Pressed] Rev" );
    webHooks.trigger('Rev', JSON.parse("{\""+btns.Rev.label +"\":\""+btns.Rev.data+"\"}"), {header:"Content-Type: application/json"});
    res.end();
})

app.post('/keypress/Fwd', function (req, res)
{
    console.log( "[Pressed] Fwd" );
    webHooks.trigger('Fwd', JSON.parse("{\""+btns.Fwd.label +"\":\""+btns.Fwd.data+"\"}"), {header:"Content-Type: application/json"});
    res.end();
})

app.post('/keypress/Play', function (req, res)
{
    console.log( "[Pressed] Play" );
    webHooks.trigger('Play', JSON.parse("{\""+btns.Play.label +"\":\""+btns.Play.data+"\"}"), {header:"Content-Type: application/json"});
    res.end();
})

app.post('/keypress/Select', function (req, res)
{
    console.log( "[Pressed] Select" );
    webHooks.trigger('Select', JSON.parse("{\""+btns.Select.label +"\":\""+btns.Select.data+"\"}"), {header:"Content-Type: application/json"});
    res.end();
})

app.post('/keypress/Up', function (req, res)
{
    console.log( "[Pressed] Up" );
    webHooks.trigger('Up', JSON.parse("{\""+btns.Up.label +"\":\""+btns.Up.data+"\"}"), {header:"Content-Type: application/json"});
    res.end();
})

app.post('/keypress/Down', function (req, res)
{
    console.log( "[Pressed] Down" );
    webHooks.trigger('Down', JSON.parse("{\""+btns.Down.label +"\":\""+btns.Down.data+"\"}"), {header:"Content-Type: application/json"});
    res.end();
})

app.post('/keypress/Left', function (req, res)
{
    console.log( "[Pressed] Left" );
    webHooks.trigger('Left', JSON.parse("{\""+btns.Left.label +"\":\""+btns.Left.data+"\"}"), {header:"Content-Type: application/json"});
    res.end();
})

app.post('/keypress/Right', function (req, res)
{
    console.log( "[Pressed] Right" );
    webHooks.trigger('Up', JSON.parse("{\""+btns.Up.label +"\":\""+btns.Up.data+"\"}"), {header:"Content-Type: application/json"});
    res.end();
})

app.post('/keypress/Back', function (req, res)
{
    console.log( "[Pressed] Back" );
    webHooks.trigger('Back', JSON.parse("{\""+btns.Back.label +"\":\""+btns.Back.data+"\"}"), {header:"Content-Type: application/json"});
    res.end();
})

app.post('/keypress/InstantReplay', function (req, res)
{
    console.log( "[Pressed] InstantReplay" );
    webHooks.trigger('InstantReplay', JSON.parse("{\""+btns.InstantReplay.label +"\":\""+btns.InstantReplay.data+"\"}"), {header:"Content-Type: application/json"});
    res.end();
})

app.post('/keypress/Info', function (req, res)
{
    console.log( "[Pressed] Info" );
    webHooks.trigger('Info', JSON.parse("{\""+btns.Info.label +"\":\""+btns.Info.data+"\"}"), {header:"Content-Type: application/json"});
    res.end();
})

app.post('/keypress/Backspace', function (req, res)
{
    console.log( "[Pressed] Backspace" );
    webHooks.trigger('Backspace', JSON.parse("{\""+btns.Backspace.label +"\":\""+btns.Backspace.data+"\"}"), {header:"Content-Type: application/json"});
    res.end();
})

app.post('/keypress/Search', function (req, res)
{
    console.log( "[Pressed] Search" );
    webHooks.trigger('Search', JSON.parse("{\""+btns.Search.label +"\":\""+btns.Search.data+"\"}"), {header:"Content-Type: application/json"});
    res.end();
})

app.post('/keypress/Enter', function (req, res)
{
    console.log( "[Pressed] Enter" );
    webHooks.trigger('Enter', JSON.parse("{\""+btns.Enter.label +"\":\""+btns.Enter.data+"\"}"), {header:"Content-Type: application/json"});
    res.end();
})

var webserver = app.listen(8060, function ()
{
    var host = webserver.address().address
    var port = webserver.address().port
})