"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openVsCode = void 0;
var child_process_1 = require("child_process");
var openVsCode = function (path) {
    return new Promise(function (resolve, reject) {
        console.log("code " + path);
        child_process_1.exec("code " + path, function (err) {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    });
};
exports.openVsCode = openVsCode;
//# sourceMappingURL=system.js.map