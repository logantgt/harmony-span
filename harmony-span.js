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

var btns = JSON.parse(fs.readFileSync('config.json', 'utf8'));

var responses = [];

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

request.shouldKeepAlive = false;

ssdp.run();

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

/// Button Event Handlers ///
app.post('/keypress/Home', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Home" );
    if(btns.Home.requesttype == "POST")
    {
        webHooks.trigger('Home', JSON.parse(btns.Home.query), JSON.parse(btns.Home.header));
        res.end();
    }
    else if(btns.Home.requesttype == "GET")
    {
        request(btns.Home.url, function (error, response, body)
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
        res.end();
    }
})

app.post('/keypress/Rev', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Rev" );
    if(btns.Rev.requesttype == "POST")
    {
        webHooks.trigger('Rev', JSON.parse(btns.Rev.query), JSON.parse(btns.Rev.header));
        res.end();
    }
    else if(btns.Rev.requesttype == "GET")
    {
        request(btns.Rev.url, function (error, response, body)
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
        res.end();
    }
})

app.post('/keypress/Fwd', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Fwd" );
    if(btns.Fwd.requesttype == "POST")
    {
        webHooks.trigger('Fwd', JSON.parse(btns.Fwd.query), JSON.parse(btns.Fwd.header));
        res.end();
    }
    else if(btns.Fwd.requesttype == "GET")
    {
        request(btns.Fwd.url, function (error, response, body)
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
        res.end();
    }
})

app.post('/keypress/Play', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Play" );
    if(btns.Play.requesttype == "POST")
    {
        webHooks.trigger('Play', JSON.parse(btns.Play.query), JSON.parse(btns.Play.header));
        res.end();
    }
    else if(btns.Play.requesttype == "GET")
    {
        request(btns.Play.url, function (error, response, body)
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
        res.end();
    }
})

app.post('/keypress/Select', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Select" );
    if(btns.Select.requesttype == "POST")
    {
        webHooks.trigger('Select', JSON.parse(btns.Select.query), JSON.parse(btns.Select.header));
        res.end();
    }
    else if(btns.Select.requesttype == "GET")
    {
        request(btns.Select.url, function (error, response, body)
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
        res.end();
    }
})

app.post('/keypress/Up', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Up" );
    if(btns.Up.requesttype == "POST")
    {
        webHooks.trigger('Up', JSON.parse(btns.Up.query), JSON.parse(btns.Up.header));
        res.end();
    }
    else if(btns.Up.requesttype == "GET")
    {
        request(btns.Up.url, function (error, response, body)
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
        res.end();
    }
})

app.post('/keypress/Down', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Down" );
    if(btns.Down.requesttype == "POST")
    {
        webHooks.trigger('Down', JSON.parse(btns.Down.query), JSON.parse(btns.Down.header));
        res.end();
    }
    else if(btns.Down.requesttype == "GET")
    {
        request(btns.Down.url, function (error, response, body)
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
        res.end();
    }
})

app.post('/keypress/Left', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Left" );
    if(btns.Left.requesttype == "POST")
    {
        webHooks.trigger('Left', JSON.parse(btns.Left.query), JSON.parse(btns.Left.header));
        res.end();
    }
    else if(btns.Left.requesttype == "GET")
    {
        request(btns.Left.url, function (error, response, body)
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
        res.end();
    }
})

app.post('/keypress/Right', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Right" );
    if(btns.Right.requesttype == "POST")
    {
        webHooks.trigger('Right', JSON.parse(btns.Right.query), JSON.parse(btns.Right.header));
        res.end();
    }
    else if(btns.Right.requesttype == "GET")
    {
        request(btns.Right.url, function (error, response, body)
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
        res.end();
    }
})

app.post('/keypress/Back', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Back" );
    if(btns.Back.requesttype == "POST")
    {
        webHooks.trigger('Back', JSON.parse(btns.Back.query), JSON.parse(btns.Back.header));
        res.end();
    }
    else if(btns.Back.requesttype == "GET")
    {
        request(btns.Back.url, function (error, response, body)
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
        res.end();
    }
})

app.post('/keypress/InstantReplay', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got InstantReplay" );
    if(btns.InstantReplay.requesttype == "POST")
    {
        webHooks.trigger('InstantReplay', JSON.parse(btns.InstantReplay.query), JSON.parse(btns.InstantReplay.header));
        res.end();
    }
    else if(btns.InstantReplay.requesttype == "GET")
    {
        request(btns.InstantReplay.url, function (error, response, body)
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
        res.end();
    }
})

app.post('/keypress/Info', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Info" );
    if(btns.Info.requesttype == "POST")
    {
        webHooks.trigger('Info', JSON.parse(btns.Info.query), JSON.parse(btns.Info.header));
        res.end();
    }
    else if(btns.Info.requesttype == "GET")
    {
        request(btns.Info.url, function (error, response, body)
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
        res.end();
    }
})

app.post('/keypress/Backspace', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Backspace" );
    if(btns.Backspace.requesttype == "POST")
    {
        webHooks.trigger('Backspace', JSON.parse(btns.Backspace.query), JSON.parse(btns.Backspace.header));
        res.end();
    }
    else if(btns.Backspace.requesttype == "GET")
    {
        request(btns.Backspace.url, function (error, response, body)
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
        res.end();
    }
})

app.post('/keypress/Search', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Search" );
    if(btns.Search.requesttype == "POST")
    {
        webHooks.trigger('Search', JSON.parse(btns.Search.query), JSON.parse(btns.Search.header));
        res.end();
    }
    else if(btns.Search.requesttype == "GET")
    {
        request(btns.Search.url, function (error, response, body)
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
        res.end();
    }
})

app.post('/keypress/Enter', function (req, res)
{
    colorout.Log("debug", "(HarmonySpan) got Enter" );
    if(btns.Enter.requesttype == "POST")
    {
        webHooks.trigger('Enter', JSON.parse(btns.Enter.query), JSON.parse(btns.Enter.header));
        res.end();
    }
    else if(btns.Enter.requesttype == "GET")
    {
        request(btns.Enter.url, function (error, response, body)
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
        res.end();
    }
})

var webserver = app.listen(8060, function ()
{
    var host = webserver.address().address
    var port = webserver.address().port
})