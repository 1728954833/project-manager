"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAddProject = exports.registerVersion = void 0;
var commander_1 = require("commander");
var program = new commander_1.Command();
var registerVersion = function () {
    program
        // eslint-disable-next-line global-require
        .version("togo " + require('../package.json').version)
        .usage('<command>');
};
exports.registerVersion = registerVersion;
var registerAddProject = function () {
    program
        .command('add <title>')
        .option('-p, --path', 'input your project absolute path')
        .description('add TODO item')
        .action(function (title, cmd) {
        console.log(title, cmd);
    });
};
exports.registerAddProject = registerAddProject;
//# sourceMappingURL=command.js.map