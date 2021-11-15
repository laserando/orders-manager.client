"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.OrdersListPage = void 0;
var core_1 = require("@angular/core");
var storage_modal_component_1 = require("src/app/components/modal/storage-modal.component");
var OrdersListPage = /** @class */ (function () {
    function OrdersListPage(orderService, ionToastService, authService, ordersService, rolesService, tagsService, modalCtrl, clientService, router, notesService, menu) {
        this.orderService = orderService;
        this.ionToastService = ionToastService;
        this.authService = authService;
        this.ordersService = ordersService;
        this.rolesService = rolesService;
        this.tagsService = tagsService;
        this.modalCtrl = modalCtrl;
        this.clientService = clientService;
        this.router = router;
        this.notesService = notesService;
        this.menu = menu;
        this.orders = [];
        this.logs = [];
        this.roles = [];
        this.tags = [];
        this.clients = [];
    }
    OrdersListPage.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.role = this.authService.getParseOfUserObject();
                if (this.authService.getUser().role.id == 1) {
                    this.filter = { isArchived: false, isPreventive: false };
                }
                else if (this.authService.getUser().role.id != 1) {
                    this.filter = { role: this.authService.getUser().role.id, isArchived: false, isPreventive: false };
                }
                return [2 /*return*/];
            });
        });
    };
    OrdersListPage.prototype.ionViewWillEnter = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.clientService.find()];
                    case 1:
                        _a.clients = __spreadArrays.apply(void 0, [(_e.sent()).map(function (c) {
                                c.fullname = c.name + ' ' + c.surname;
                                return c;
                            })]);
                        _b = this;
                        return [4 /*yield*/, this.tagsService.find()];
                    case 2:
                        _b.tags = _e.sent();
                        _c = this;
                        return [4 /*yield*/, this.rolesService.find()];
                    case 3:
                        _c.roles = _e.sent();
                        _d = this;
                        return [4 /*yield*/, this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC')];
                    case 4:
                        _d.orders = _e.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OrdersListPage.prototype.deleteOrder = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!confirm("sei sicuro di voler eliminare l'ordine?")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.orderService.deleteOrder(index)];
                    case 1:
                        _b.sent();
                        this.ionToastService.alertMessage("delete");
                        _b.label = 2;
                    case 2:
                        _a = this;
                        return [4 /*yield*/, this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC')];
                    case 3:
                        _a.orders = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OrdersListPage.prototype.search = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.orderService.find(this.filter, this.term, 0, 20)];
                    case 1:
                        _a.orders = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OrdersListPage.prototype.searchByClient = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var clients;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.term = event.text;
                        return [4 /*yield*/, this.clientService.find(null, this.term, 0, 20, 'surname:ASC')];
                    case 1:
                        clients = (_a.sent()).map(function (c) {
                            c.fullname = c.name + ' ' + c.surname;
                            return c;
                        });
                        this.clients = __spreadArrays(clients);
                        return [2 /*return*/];
                }
            });
        });
    };
    OrdersListPage.prototype.getMoreClients = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var clients;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.clientService.find(null, this.term, this.clients.length, 20, 'surname:ASC')];
                    case 1:
                        clients = (_b.sent()).map(function (c) {
                            c.fullname = c.name + ' ' + c.surname;
                            return c;
                        });
                        (_a = this.clients).push.apply(_a, clients);
                        event.component.endInfiniteScroll();
                        if (!clients.length) {
                            event.component.disableInfiniteScroll();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    OrdersListPage.prototype.cleanClient = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(event == 'clean')) return [3 /*break*/, 2];
                        delete this.filter.client;
                        this.client = null;
                        _a = this;
                        return [4 /*yield*/, this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC')];
                    case 1:
                        _a.orders = _c.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        this.filter.client = event.value.id;
                        _b = this;
                        return [4 /*yield*/, this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC')];
                    case 3:
                        _b.orders = _c.sent();
                        _c.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OrdersListPage.prototype.getNextPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var orders;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.orderService.find(this.filter, this.term, this.orders.length)];
                    case 1:
                        orders = _b.sent();
                        (_a = this.orders).push.apply(_a, orders);
                        return [2 /*return*/];
                }
            });
        });
    };
    OrdersListPage.prototype.completeOrder = function (order) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!confirm("sei sicuro di voler completare l'ordine?")) return [3 /*break*/, 3];
                        order.isCompleted = true;
                        order.role.id = 1;
                        order.role.name = "amministrazione";
                        return [4 /*yield*/, this.ordersService.updateOrder(order, order.id, order.client)];
                    case 1:
                        _b.sent();
                        _a = this;
                        return [4 /*yield*/, this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC')];
                    case 2:
                        _a.orders = _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrdersListPage.prototype.removeCompletion = function (order) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!confirm("sei sicuro di voler TOGLIERE il COMPLETAMENTO dell'ordine?")) return [3 /*break*/, 3];
                        order.isCompleted = false;
                        return [4 /*yield*/, this.ordersService.updateOrder(order, order.id, order.client)];
                    case 1:
                        _b.sent();
                        _a = this;
                        return [4 /*yield*/, this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC')];
                    case 2:
                        _a.orders = _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrdersListPage.prototype.addGraphic = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!confirm("VUOI CAMBIARE IL LINK DELLA GRAFICA ?")) return [3 /*break*/, 2];
                        client.graphicLink = prompt("inserisci link grafica");
                        if (!client.graphicLink) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.clientService.updateCustomer(client)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        _a = this;
                        return [4 /*yield*/, this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC')];
                    case 3:
                        _a.orders = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OrdersListPage.prototype.changeState = function (order) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!confirm("SEI SICURO DI VOLER CAMBIARE L'ASSEGNAZIONE?")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.orderService.updateOrder(order, order.id, order.client)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        _a = this;
                        return [4 /*yield*/, this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC')];
                    case 3:
                        _a.orders = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OrdersListPage.prototype.storeOrder = function (order) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!confirm("SEI SICURO DI VOLER ARCHIVIARE L'ORDINE?")) return [3 /*break*/, 2];
                        order.isArchived = true;
                        return [4 /*yield*/, this.ordersService.updateOrder(order, order.id, order.client)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        _a = this;
                        return [4 /*yield*/, this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC')];
                    case 3:
                        _a.orders = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OrdersListPage.prototype.restoreOrder = function (order) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!confirm("SEI SICURO DI VOLER RIPRISTINARE L'ORDINE?")) return [3 /*break*/, 2];
                        order.isArchived = false;
                        return [4 /*yield*/, this.ordersService.updateOrder(order, order.id, order.client)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        _a = this;
                        return [4 /*yield*/, this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC')];
                    case 3:
                        _a.orders = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OrdersListPage.prototype.onFilterChange = function (filter) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (filter.tags && filter.tags.length) {
                            this.filter.tags_contains = filter.tags;
                        }
                        else {
                            delete this.filter.tags_contains;
                        }
                        if (filter.roles && filter.roles.length) {
                            this.filter.role_in = filter.roles;
                        }
                        else {
                            delete this.filter.role_in;
                        }
                        if (filter.deliveryDate.from) {
                            this.filter.deliveryDate_gte = filter.deliveryDate.from;
                        }
                        else {
                            delete this.filter.deliveryDate_gte;
                        }
                        if (filter.deliveryDate.to) {
                            this.filter.deliveryDate_lte = filter.deliveryDate.to;
                        }
                        else {
                            delete this.filter.deliveryDate_lte;
                        }
                        if (filter.isArchived && filter.isArchived.length) {
                            if (filter.isArchived.find(function (ia) { return ia == 'isArchived'; }) && filter.isArchived.find(function (ia) { return ia == 'notArchived'; })) {
                                delete this.filter.isArchived;
                            }
                            else {
                                if (filter.isArchived.find(function (ia) { return ia == 'isArchived'; })) {
                                    this.filter.isArchived = true;
                                }
                                if (filter.isArchived.find(function (ia) { return ia == 'notArchived'; })) {
                                    this.filter.isArchived = false;
                                }
                            }
                        }
                        else {
                            this.filter.isArchived = false;
                        }
                        if (filter.isArchived) {
                            if (filter.isArchived.find(function (ia) { return ia == 'complete'; })) {
                                this.filter.isCompleted = true;
                            }
                            else {
                                delete this.filter.isCompleted;
                            }
                        }
                        _a = this;
                        return [4 /*yield*/, this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC')];
                    case 1:
                        _a.orders = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OrdersListPage.prototype.openModal = function (order) {
        return __awaiter(this, void 0, void 0, function () {
            var modal, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.modalCtrl.create({
                            component: storage_modal_component_1.StorageModalComponent,
                            componentProps: { order: order, storageForNote: true }
                        })];
                    case 1:
                        modal = _b.sent();
                        return [4 /*yield*/, modal.present()];
                    case 2:
                        _b.sent();
                        _a = this;
                        return [4 /*yield*/, this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC')];
                    case 3:
                        _a.orders = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OrdersListPage.prototype.updateList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC')];
                    case 1:
                        _a.orders = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OrdersListPage.prototype.select = function (event, order) {
        switch (event.detail.value) {
            case "seeTags":
                this.router.navigate(["/dashboard/orders_/" + order.id]);
                break;
            case "goToChangeOrder":
                this.router.navigate(["/dashboard/orders/" + order.id]);
                break;
            case "deleteOrder":
                this.deleteOrder(order.id);
                break;
            case "completeOrder":
                this.completeOrder(order);
                break;
            case "storeOrder":
                this.storeOrder(order);
                break;
            case "restoreOrder":
                this.restoreOrder(order);
                break;
            case "removeCompletion":
                this.removeCompletion(order);
                break;
            case "changeInPreventive":
                this.changeInPreventive(order);
                break;
        }
    };
    OrdersListPage.prototype.seePreview = function (order) {
        this.router.navigate(["/dashboard/preview/" + order.id]);
    };
    OrdersListPage.prototype.changeInPreventive = function (order) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!confirm("Sei sicuro di voler spostare l'ordine nella lista preventivi?")) return [3 /*break*/, 3];
                        order.isPreventive = true;
                        return [4 /*yield*/, this.orderService.updateOrder(order, order.id, order.client)];
                    case 1:
                        _b.sent();
                        _a = this;
                        return [4 /*yield*/, this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC')];
                    case 2:
                        _a.orders = _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrdersListPage.prototype.compareWith = function (currentValue, compareValue) {
        if (Array.isArray(compareValue)) {
            return (compareValue || []).map(function (cv) { return cv.id; }).indexOf(currentValue.id) > -1;
        }
        return compareValue.id == currentValue.id;
    };
    OrdersListPage.prototype.updateTags = function (order) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.orderService.updateOrder(order, order.id, order.client)];
                    case 1:
                        _b.sent();
                        _a = this;
                        return [4 /*yield*/, this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC')];
                    case 2:
                        _a.orders = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OrdersListPage = __decorate([
        core_1.Component({
            selector: 'app-orders-list',
            templateUrl: './orders-list.page.html',
            styleUrls: ['./orders-list.page.scss']
        })
    ], OrdersListPage);
    return OrdersListPage;
}());
exports.OrdersListPage = OrdersListPage;
