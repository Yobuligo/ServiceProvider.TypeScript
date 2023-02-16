"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SP = void 0;
var ServiceProviderTypes_1 = require("./ServiceProviderTypes");
var ServiceProviderDefault = /** @class */ (function () {
    function ServiceProviderDefault() {
        this.serviceMetas = [];
    }
    ServiceProviderDefault.prototype.contains = function (serviceDefinition) {
        return this.findServiceMeta(serviceDefinition) !== undefined;
    };
    ServiceProviderDefault.prototype.containsNot = function (serviceDefinition) {
        return !this.contains(serviceDefinition);
    };
    ServiceProviderDefault.prototype.fetch = function (serviceDefinition) {
        var _a;
        return ((_a = this.fetchOrNull(serviceDefinition)) !== null && _a !== void 0 ? _a : this.raiseUnknownServiceException(serviceDefinition));
    };
    ServiceProviderDefault.prototype.fetchOrNull = function (serviceDefinition) {
        var serviceMeta = this.findServiceMeta(serviceDefinition);
        if (serviceMeta === undefined) {
            return;
        }
        switch (serviceMeta.serviceInstanceType) {
            case ServiceProviderTypes_1.ServiceInstanceType.SINGLE_INSTANTIABLE: {
                return this.fetchSingleInstantiableService(serviceMeta);
            }
            case ServiceProviderTypes_1.ServiceInstanceType.MULTI_INSTANTIABLE: {
                return this.createService(serviceMeta);
            }
            default: {
                throw new Error("Error while fetching service ".concat(serviceDefinition.name, ". ServiceInstanceType ").concat(serviceMeta.serviceInstanceType, " is unknown."));
            }
        }
    };
    ServiceProviderDefault.prototype.put = function (serviceDefinition, serviceInstance) {
        var serviceMeta = {
            serviceDefinition: serviceDefinition,
            serviceInstanceType: ServiceProviderTypes_1.ServiceInstanceType.SINGLE_INSTANTIABLE,
            serviceInstance: serviceInstance,
        };
        this.addServiceMeta(serviceMeta);
    };
    ServiceProviderDefault.prototype.remove = function (serviceDefinition) {
        var serviceMetaIndex = this.serviceMetas.findIndex(function (serviceMeta) {
            return serviceMeta.serviceDefinition === serviceDefinition;
        });
        if (serviceMetaIndex !== -1) {
            this.serviceMetas.splice(serviceMetaIndex, 1);
        }
    };
    ServiceProviderDefault.prototype.register = function (serviceDefinition, concreteServiceType, serviceInstanceType) {
        var resolvedServiceInstanceType = serviceInstanceType !== null && serviceInstanceType !== void 0 ? serviceInstanceType : ServiceProviderTypes_1.ServiceInstanceType.SINGLE_INSTANTIABLE;
        var serviceMeta = {
            serviceDefinition: serviceDefinition,
            concreteServiceType: concreteServiceType,
            serviceInstanceType: resolvedServiceInstanceType,
        };
        this.addServiceMeta(serviceMeta);
    };
    ServiceProviderDefault.prototype.findServiceMeta = function (serviceDefinition) {
        return this.serviceMetas.find(function (serviceMeta) {
            return serviceMeta.serviceDefinition === serviceDefinition;
        });
    };
    ServiceProviderDefault.prototype.addServiceMeta = function (serviceMeta) {
        if (this.contains(serviceMeta.serviceDefinition)) {
            this.remove(serviceMeta.serviceDefinition);
        }
        this.serviceMetas.push(serviceMeta);
    };
    ServiceProviderDefault.prototype.fetchSingleInstantiableService = function (serviceMeta) {
        if (serviceMeta.serviceInstance === undefined) {
            serviceMeta.serviceInstance = this.createService(serviceMeta);
        }
        return serviceMeta.serviceInstance;
    };
    ServiceProviderDefault.prototype.createService = function (serviceMeta) {
        if (serviceMeta.concreteServiceType === undefined) {
            return undefined;
        }
        return new serviceMeta.concreteServiceType();
    };
    ServiceProviderDefault.prototype.raiseUnknownServiceException = function (serviceDefinition) {
        throw new Error("Error while fetching service '".concat(serviceDefinition.name, "'. Service is unknown. Register the service or put it to the service provider."));
    };
    return ServiceProviderDefault;
}());
exports.SP = new ServiceProviderDefault();
//# sourceMappingURL=ServiceProvider.js.map