const seleniumServer = require('selenium-server')
const chromedriver = require('chromedriver')
const geckodriver = require('geckodriver')

module.exports = {
  "src_folders" : ["./tests/e2e"],
  "output_folder" : "./tests/reports",
  "custom_commands_path": [
    "./node_modules/nightwatch-custom-commands-assertions/js/commands",
    "./tests/commands"
  ],
  "custom_assertions_path": [
    "./node_modules/nightwatch-custom-commands-assertions/js/assertions"
  ],
  "selenium" : {
    "start_process" : true,
    "server_path" : seleniumServer.path,
    "log_path" : "",
    "port" : 4444,
    "cli_args" : {
      "webdriver.chrome.driver" : chromedriver.path,
      "webdriver.gecko.driver" : geckodriver.path
    }
  },

  "test_settings" : {
    "default" : {
      "launch_url" : "http://127.0.0.1",
      "selenium_port"  : 4444,
      "selenium_host"  : "127.0.0.1",
      "silent": true,
      "end_session_on_fail": false,
      "skip_testcases_on_fail": false,
      "exclude" : [
        "./tests/e2e/utils.js"
      ],
      "desiredCapabilities": {
        "browserName": "firefox",
        "javascriptEnabled": true,
        "acceptSslCerts": true,
        "marionette": true
      }
    },
    "firefox": {
      "desiredCapabilities": {
        "browserName": "firefox",
        "javascriptEnabled": true,
        "acceptSslCerts": true,
        "marionette": true
      }
    },
    "chrome": {
      "desiredCapabilities": {
        "browserName": "chrome",
        "javascriptEnabled": true,
        "acceptSslCerts": true,
        "marionette": true
      }
    }
  }
}
