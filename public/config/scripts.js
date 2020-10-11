var Button = Backbone.Model.extend({
    defaults: {
        id: -1,
        name: "",
        url: "",
        httpHeaders: {},
        postPayload: "",
        mqttTopic: "",
        mqttMessage: "",
        action: "",
        enabled: false
    }
});

var MqttConfig = Backbone.Model.extend({
    url: '/mqttconfig'
});

var ButtonCollection = Backbone.Collection.extend({
    model: Button,
    url: '/buttons'
});

var ButtonRowView = Backbone.View.extend({
    tagName: "tr",
    className: function() {
        return this.model.get("enabled") ? "active" : "inactive";
    },
    template: _.template(
        "<td><%= id %></td>" +
        "<td><%= name %></td>" +
        "<% if (action ==\"GET\") { %>" +
        "<td><code>[<strong><%= action %></strong>] <%= url %></code></td>\n" +
        "<td></td>\n" +
        "<% } %>" +
        "<% if (action == \"POST\") { %>" +
        "<td><code>[<strong><%= action %></strong>] <%= url %></code></td>\n" +
        "<td><%= postPayload %></td>\n" +
        "<% } %>" +
        "<% if (action == \"MQTT\") { %>" +
        "<td><code>[<strong><%= action %></strong>] <%= mqttTopic %></code></td>\n" +
        "<td><%= mqttMessage %></td>\n" +
        "<% } %>" +
        "<td><%= enabled ? \"yes\" : \"no\" %></td>\n" +
        "<td><a href=\"#button/<%= id %>\" class=\"edit btn btn-sm btn-primary\">edit</a></td>"
    ),
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});

var ButtonTableView = Backbone.View.extend({
    tagName: "div",
    initialize: function() {
        this.listenTo(this.model, "reset", this.render);
    },
    template: _.template(
        "<div class=\"alert alert-success\" role=\"alert\">\n" +
        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n" +
        "<span aria-hidden=\"true\">&times;</span>\n" +
        "</button>\n" +
        "<h4 class=\"alert-heading\">Welcome to <strong>HarmonySpan</strong></h4>\n" +
        "<p>This service mimics a <strong>Roku</strong> device in a <strong>Logitech Harmony</strong> setup.<br/>\n" +
        "Instead of controlling a Roku-device, you can assign <strong>custom actions</strong> to each of the functions available and then use a Harmony Remote to trigger those actions.</p>\n" +
        "<p>You can trigger remote actions by calling <strong>Webhooks</strong>, which helps integrating with services like <a href=\"https://ifttt.com/\">IFTTT</a>, <a href=\"https://conradconnect.com/en\">Conrad Connect</a>, <a href=\"https://zapier.com/\">Zapier</a>.\n" +
        "You can also send <strong>MQTT</strong>-messages with each button-press. This helps you integrate with Home-Automation services like <a href=\"https://nodered.org/\">Node-RED</a>. Lastly, you can run shell scripts.</p>" +
        "This tool helps you assign functions to actions." +
        "</div>\n" +
        "<div class=\"header\">" +
        "    <h2>Buttons Configuration</h2>\n" +
        "    <ul class=\"actions\"></ul>" +
        "</div>" +
        "<table class=\"table table-sm\" id=\"buttonTable\">" +
        "    <thead>\n" +
        "        <tr>\n" +
        "            <th>ID</th>\n" +
        "            <th>Function</th>\n" +
        "            <th>Action</th>\n" +
        "            <th>Payload / Message</th>\n" +
        "            <th>Enabled</th>\n" +
        "            <th></th>\n" +
        "        </tr>\n" +
        "    </thead>\n" +
        "    <tbody></tbody>\n" +
        "</table>"
    ),
    render: function() {
        this.$el.empty();
        this.$el.html(this.template());
        let tbody = this.$el.find("tbody");
        this.model.forEach((btn) => {
            var view = new ButtonRowView({ model: btn });
            tbody.append(view.render().$el);
        });
        return this;
    }
});

var ButtonConfigView = Backbone.View.extend({
    tagName: "div",
    initialize: function() {
        this.listenTo(this.model, "sync", this.handleSaved);
        this.mode = this.model.get("action");
    },
    template: _.template(
        "<div class=\"header\">" +
        "<h2>Button Configuration <em><%= name %></em></h2>\n" +
        "<ul class=\"actions\"></ul>\n" +
        "</div>\n" +
        "<form>\n" +
        "<div class=\"form-group\">\n" +
        "<label for=\"action\">Action</label>\n" +
        "<select class=\"select-action form-control\" id=\"action\">\n" +
        "<option value=\"GET\"<% if(mode == \"GET\") { %> selected<% } %>>Call Webhook with HTTP GET</option>\n" +
        "<option value=\"POST\"<% if(mode == \"POST\") { %> selected<% } %>>Call Webhook with HTTP POST</option>\n" +
        "<option value=\"MQTT\"<% if(mode == \"MQTT\") { %> selected<% } %>>Send MQTT Message</option>\n" +
        "</select>\n" +
        "</div>\n" +
        "<% if(mode==\"GET\" || mode==\"POST\") { %>" +
        "<div class=\"form-group\">\n" +
        "<label for=\"url\" required>URL</label>\n" +
        "<input type=\"url\" class=\"form-control\" id=\"url\" value=\"<%= url %>\" required>\n" +
        "</div>\n" +
        "<% if(mode == \"POST\") { %>" +
        "<div class=\"form-group\">\n" +
        "<label for=\"postPayload\">Payload</label>\n" +
        "<textarea class=\"form-control\" id=\"postPayload\" required><%= postPayload %></textarea>\n" +
        "</div>\n" +
        "<% } %>" +
        "<div class=\"form-group\">\n" +
        "<label for=\"httpHeaders\">HTTP-Headers</label>\n" +
        "<textarea class=\"form-control\" id=\"httpHeaders\" placeholder=\"Content-Type=application/json\"><%= Object.keys(httpHeaders).map((key) => key + \"=\" + httpHeaders[key]).join(\"\\n\") %></textarea>\n" +
        "</div>\n" +
        "<% } else if (mode == \"MQTT\") { %>" +
        "<div class=\"form-group\">\n" +
        "<label for=\"mqttTopic\">MQTT Topic</label>\n" +
        "<input type=\"text\" class=\"form-control\" id=\"mqttTopic\" value=\"<%= mqttTopic %>\" placeholder=\"E.g. harmony\" requird>\n" +
        "</div>\n" +
        "<div class=\"form-group\">\n" +
        "<label for=\"mqttTopic\">MQTT Message</label>\n" +
        "<textarea class=\"form-control\" id=\"mqttMessage\" required><%= mqttMessage %></textarea>\n" +
        "</div>\n" +
        "<% } %>" +
        "<div class=\"form-group form-check\">\n" +
        "    <input type=\"checkbox\" class=\"form-check-input\" id=\"enabled\"<% if(enabled) { %> checked<% } %>>\n" +
        "    <label class=\"form-check-label\" for=\"enabled\">Enabled</label>\n" +
        "</div>\n" +
        "<button type=\"submit\" class=\"btn btn-primary\">Apply</button>\n" +
        "</form>"
    ),
    events: {
        "change .select-action": "handleChangeAction",
        "submit form": "handleSubmit"
    },
    handleChangeAction: function() {
        let value = this.$el.find("#action").val();
        if (value !== this.mode) {
            this.mode = value;
            this.render();
        }
    },
    handleSubmit: function(event) {
        event.preventDefault();
        let action = this.$el.find("#action").val().trim();
        let id = this.model.get("id");
        let name = this.model.get("name");
        let enabled = this.$el.find("#enabled").prop('checked');
        if (action == "GET" || action == "POST") {
            let headersString = this.$el.find("#httpHeaders").val().trim();
            let headers = {};
            if (headersString != "") {
                let lines = headersString.split("\n");
                let obj = {};
                let i;
                for (i = 0; i < lines.length; i++) {
                    let tokens = lines[i].split("=");
                    obj[tokens[0]] = tokens[1];
                }
                headers = obj;
            }
            this.model.clear();
            this.model.set({
                id: id,
                name: name,
                action: action,
                url: this.$el.find("#url").val().trim(),
                httpHeaders: headers,
                enabled: enabled
            });
            if (action == "POST") {
                this.model.set("postPayload", this.$el.find("#postPayload").val().trim());
            }
        } else if (action == "MQTT") {
            this.model.clear();
            this.model.set({
                id: id,
                name: name,
                action: action,
                mqttTopic: this.$el.find("#mqttTopic").val().trim(),
                mqttMessage : this.$el.find("#mqttMessage").val().trim(),
                enabled: enabled
            });
        }
        this.model.save();
    },
    handleSaved: function() {
        this.remove();
        router.navigate("index", { trigger: true, replace: true });
    },
    render: function() {
        let attributes = this.model.attributes;
        attributes["mode"] = this.mode;
        this.$el.html(this.template(attributes));
        return this;
    }
});

var MqttConfigView = Backbone.View.extend({
    tagName: "div",
    model: MqttConfig,
    template: _.template(
        "<div class=\"header\">" +
        "<h2>MQTT Configuration</h2>\n" +
        "</div>\n" +
        "<form>\n" +
        "<div class=\"form-group\">\n" +
        "<label for=\"serverUrl\">Server-URL</label>\n" +
        "<input type=\"text\" class=\"form-control\" id=\"serverUrl\" value=\"<%= serverUrl %>\" required pattern=\"mqtt://[a-z.-:0-9]{1,240}\">\n" +
        "</div>\n" +
        "<div class=\"form-group\">\n" +
        "<label for=\"serverUsername\">Username</label>\n" +
        "<input type=\"text\" class=\"form-control\" id=\"serverUsername\" value=\"<%= serverUsername %>\" required>\n" +
        "</div>\n" +
        "<div class=\"form-group\">\n" +
        "<label for=\"serverPassword\">Password</label>\n" +
        "<input type=\"text\" class=\"form-control\" id=\"serverPassword\" value=\"<%= serverPassword %>\" required>\n" +
        "</div>\n" +
        "<div class=\"form-group form-check\">\n" +
        "    <input type=\"checkbox\" class=\"form-check-input\" id=\"mqttEnabled\"<% if(enabled) { %> checked<% } %>>\n" +
        "    <label class=\"form-check-label\" for=\"mqttEnabled\">Enabled</label>\n" +
        "</div>\n" +
        "<button type=\"submit\" class=\"btn btn-primary\">Apply</button>\n" +
        "</form>"
    ),
    events: {
        "submit form": "handleSubmit"
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    },
    handleSubmit: function(event) {
        event.preventDefault();
        this.model.set({
            serverUrl: this.$el.find("#serverUrl").val(),
            serverUsername: this.$el.find("#serverUsername").val(),
            serverPassword: this.$el.find("#serverPassword").val(),
            enabled: this.$el.find("#mqttEnabled").prop('checked')
        });
        this.listenToOnce(this.model, "sync", this.handleSave);
        navbar.startSpinning();
        this.model.save();
    },
    handleSave: function() {
        navbar.stopSpinning();
        router.navigate("index", { trigger: true, replace: true });
    }
});

var buttons = new ButtonCollection();

var buttonsTableView = new ButtonTableView({
    model: buttons
});

var router;

var mqttConfig = new MqttConfig();

let container = $("#container");

var NavbarView = Backbone.View.extend({
    tagName: "nav",
    className: "navbar navbar-expand-md navbar-dark fixed-top bg-dark",
    section: "buttons",
    template: _.template(
        "<a class=\"navbar-brand\" href=\"#\">HarmonySpan</a>\n" +
        "<button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbarCollapse\"\n" +
        "    aria-controls=\"navbarCollapse\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\n" +
        "    <span class=\"navbar-toggler-icon\"></span>\n" +
        "</button>\n" +
        "<div class=\"collapse navbar-collapse\" id=\"navbarCollapse\">\n" +
        "    <ul class=\"navbar-nav mr-auto\">\n" +
        "        <li class=\"nav-item<% if(section == \"buttons\") { %> active<% } %>\">\n" +
        "            <a class=\"nav-link\" href=\"#index\">Buttons <span class=\"sr-only\">(current)</span></a>\n" +
        "        </li>\n" +
        "        <li class=\"nav-item<% if(section ==\"mqtt\") { %> active<% } %>\">\n" +
        "            <a href=\"#mqtt\" class=\"nav-link\">MQTT-Config</a>\n" +
        "        </li>\n" +
        "    </ul>\n" +
        "<div class=\"spinner-border text-light\" role=\"status\">\n" +
        "    <span class=\"sr-only\">Loading...</span>\n" +
        "</div>\n" +
        "</div>"
    ),
    render: function() {
        this.$el.html(this.template({ section: this.section }));
        this.spinner = this.$el.find("div.spinner-border");
        this.stopSpinning();
        return this;
    },
    changeSection: function(section) {
        this.section = section;
        this.render();
    },
    startSpinning: function() {
        this.spinner.show();
    },
    stopSpinning: function() {
        this.spinner.hide();
    }
});

var ButtonsRouter = Backbone.Router.extend({
    routes: {
        "": "redirectToIndex",
        "index": "showIndex",
        "button/:id": "showButtonConfig",
        "mqtt": "showMqttConfig"
    },

    redirectToIndex: function() {
        this.navigate("index", { trigger: true, replace: true });
    },

    showIndex: function() {
        buttons.fetch({ 
            success: function(collection, response, options) {
                container.empty();
                container.append(buttonsTableView.render().$el);
                navbar.changeSection("buttons");
            }
         });
    },

    showButtonConfig(id) {
        if (buttons.length > 0) {
            var btn = buttons.get(parseInt(id));
            var v = new ButtonConfigView({
                model: btn
            });
            container.empty();
            container.append(v.render().$el);
            navbar.changeSection("buttons");
        } else {
            this.navigate("index", { trigger: true, replace: true });
        }
    },

    showMqttConfig() {
        navbar.startSpinning();
        let mqttConfigView = new MqttConfigView({
            model: mqttConfig
        });
        mqttConfig.fetch({ 
            success: function(model, response, options) {
                container.html(mqttConfigView.render().$el);
                navbar.changeSection("mqtt");
            }
         });
    }
});

var navbar = new NavbarView();

window.addEventListener('load', () => {
    router = new ButtonsRouter();
    Backbone.history.start();
    $("body").append(navbar.render().$el);
});
