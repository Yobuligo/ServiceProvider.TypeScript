"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ServiceProviderTypes_1 = require("./ServiceProviderTypes");
var ServiceProviderDefault = /** @class */ (function () {
    function ServiceProviderDefault() {
        this.serviceDefinitions = [];
    }
    ServiceProviderDefault.prototype.contains = function (abstractServiceType) {
        return this.findServiceDefinition(abstractServiceType) !== undefined;
    };
    ServiceProviderDefault.prototype.fetch = function (abstractServiceType) {
        var service = this.fetchOrNull(abstractServiceType);
        if (service !== undefined) {
            return service;
        }
        throw new Error("Error while fetching service '" + abstractServiceType.name + "'. Service is unknown. Register the service or put it to the service provider.");
    };
    ServiceProviderDefault.prototype.fetchOrNull = function (abstractServiceType) {
        var serviceDefinition = this.findServiceDefinition(abstractServiceType);
        if (serviceDefinition === undefined) {
            return;
        }
        switch (serviceDefinition.serviceInstanceType) {
            case ServiceProviderTypes_1.ServiceInstanceType.SINGLE_INSTANTIABLE: {
                return this.fetchSingleInstantiableService(serviceDefinition);
            }
            case ServiceProviderTypes_1.ServiceInstanceType.MULTI_INSTANTIABLE: {
                return this.createService(serviceDefinition);
            }
            default: {
                throw new Error("Error while fetching service " + abstractServiceType.name + ". ServiceInstanceType " + serviceDefinition.serviceInstanceType + " is unknown.");
            }
        }
    };
    ServiceProviderDefault.prototype.put = function (abstractServiceType, service) {
        this.findServiceDefinition(abstractServiceType);
        var serviceDefinition = {
            abstractServiceType: abstractServiceType,
            serviceInstanceType: ServiceProviderTypes_1.ServiceInstanceType.SINGLE_INSTANTIABLE,
            service: service,
        };
        this.addServiceDefinition(serviceDefinition);
    };
    ServiceProviderDefault.prototype.remove = function (abstractServiceType) {
        var index = this.serviceDefinitions.findIndex(function (serviceDefinition) {
            return serviceDefinition.abstractServiceType === abstractServiceType;
        });
        if (index === -1) {
            return;
        }
        this.serviceDefinitions.splice(index, 1);
    };
    ServiceProviderDefault.prototype.register = function (abstractServiceType, concreteServiceType, serviceInstanceType) {
        var serviceDefinition = {
            abstractServiceType: abstractServiceType,
            concreteServiceType: concreteServiceType,
            serviceInstanceType: serviceInstanceType,
        };
        this.addServiceDefinition(serviceDefinition);
    };
    ServiceProviderDefault.prototype.findServiceDefinition = function (abstractServiceType) {
        return this.serviceDefinitions.find(function (serviceDefinition) {
            return serviceDefinition.abstractServiceType === abstractServiceType;
        });
    };
    ServiceProviderDefault.prototype.addServiceDefinition = function (serviceDefinition) {
        if (this.contains(serviceDefinition.abstractServiceType)) {
            this.remove(serviceDefinition.abstractServiceType);
        }
        this.serviceDefinitions.push(serviceDefinition);
    };
    ServiceProviderDefault.prototype.fetchSingleInstantiableService = function (serviceDefinition) {
        if (serviceDefinition.service === undefined) {
            serviceDefinition.service = this.createService(serviceDefinition);
        }
        return serviceDefinition.service;
    };
    ServiceProviderDefault.prototype.createService = function (serviceDefinition) {
        if (serviceDefinition.concreteServiceType === undefined) {
            return undefined;
        }
        return new serviceDefinition.concreteServiceType();
    };
    return ServiceProviderDefault;
}());
exports.SP = new ServiceProviderDefault();
//# sourceMappingURL=ServiceProvider.js.map