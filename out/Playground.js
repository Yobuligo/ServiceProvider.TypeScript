"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Service_1 = require("./Service");
var ServiceProvider_1 = require("./ServiceProvider");
var ServiceProviderTypes_1 = require("./ServiceProviderTypes");
var FactoryService = /** @class */ (function (_super) {
    __extends(FactoryService, _super);
    function FactoryService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return FactoryService;
}(Service_1.Service));
var Factory = /** @class */ (function () {
    function Factory() {
    }
    Factory.prototype.create = function (type) {
        return new type();
    };
    return Factory;
}());
var Person = /** @class */ (function () {
    function Person() {
        this.firstname = "";
        this.lastname = "";
    }
    return Person;
}());
ServiceProvider_1.SP.register(FactoryService, Factory, ServiceProviderTypes_1.ServiceInstanceType.MULTI_INSTANTIABLE);
var person = ServiceProvider_1.SP.fetch(FactoryService).create(Person);
console.log("" + person);
//# sourceMappingURL=Playground.js.map