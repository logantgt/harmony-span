const colors = require("colors/safe")

module.exports.Log = async (status, message) =>
{
  switch(status.toLowerCase())
  {
    case "regular":
      console.log("[ ] " + message);
      break;
    case "debug":
      console.log("[" + colors.magenta("~") + "] " + message);
      break;
    case "success":
      console.log("[" + colors.green(">") + "] " + message);
      break;
    case "info":
      console.log("[" + colors.blue("i") + "] " + message);
      break;
    case "warning":
      console.log("[" + colors.yellow("!") + "] " + message);
      break;
    case "error":
      console.log("[" + colors.red("X") + "] " + message);
      break;
  }
}

// for any of you that know me personally, yes, this is a waterbot module