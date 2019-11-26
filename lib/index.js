"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
Object.defineProperty(exports, "__esModule", { value: true });
var getUrls = function (opts) {
    var limit = opts.limit;
    var skip = opts.skip;
    var url = opts.url;
    var itemCount = opts.count;
    var parameters = getUrlParameters(url);
    url = Object.keys(parameters).length == 0 ? url += '?limit=&offset=' : url;
    if (('limit' in parameters) && !('offset' in parameters)) {
        url += '&offset=';
    }
    else if (!('limit' in parameters) && ('offset' in parameters)) {
        url += '&limit=';
    }
    url = parameters['limit'] ? url : url.replace('limit=', ('limit=' + limit));
    url = parameters['offset'] ? url : url.replace('offset=', ('offset=' + skip));
    var next_url = null, prev_url = null;
    var offset = limit + skip;
    if (offset < itemCount) {
        next_url = url.replace(('offset=' + skip), "offset=" + offset);
    }
    if (itemCount > 0 && skip > 0) {
        var offset_1 = skip - limit;
        prev_url = url.replace(('offset=' + skip), "offset=" + (offset_1 < 0 ? 0 : offset_1));
    }
    var result = {
        count: itemCount,
        next: next_url,
        previous: prev_url,
        results: []
    };
    return result;
};
var getUrlParameters = function (url) {
    var vars = {};
    var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
        return "";
    });
    return vars;
};
function paginate(schema, opts) {
    var self = paginate;
    opts = Object.assign({}, (self.options || {}), opts);
    var defaultLimit = (opts ? (opts.defaultLimit ? opts.defaultLimit : 10) : 10);
    var defaultSkip = (opts ? (opts.defaultSkip ? opts.defaultSkip : 0) : 0);
    var result;
    schema.statics.aggregatePaginate = function (pipelines, options, callback) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var paginateOpts, itemCount, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        paginateOpts = {};
                        if (options && options.req) {
                            paginateOpts = {
                                url: options.req.protocol + ((options.is_secure ? 's' : '') + "://") + options.req.get('host') + options.req.originalUrl,
                                limit: parseInt(options.limit || defaultLimit),
                                skip: parseInt(options.skip || defaultSkip),
                                count: 0
                            };
                        }
                        itemCount = 0;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.aggregate(pipelines).count('count')];
                    case 2:
                        itemCount = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        if (callback) {
                            callback(err_1, null);
                        }
                        return [2 /*return*/, reject(err_1)];
                    case 4:
                        if (itemCount && itemCount[0]) {
                            itemCount = itemCount[0].count;
                        }
                        else {
                            itemCount = 0;
                        }
                        if (paginateOpts && paginateOpts.url) {
                            pipelines.push({ '$skip': paginateOpts.skip });
                            pipelines.push({ '$limit': paginateOpts.limit });
                        }
                        paginateOpts.count = itemCount;
                        result = getUrls(paginateOpts);
                        if (itemCount == 0) {
                            if (callback) {
                                callback(null, result);
                            }
                            return [2 /*return*/, resolve(result)];
                        }
                        this
                            .aggregate(pipelines)
                            .exec(function (err, querySet) {
                            result.results = querySet;
                            if (callback) {
                                if (err) {
                                    result = null;
                                }
                                callback(err, result);
                            }
                            if (err)
                                return reject(err);
                            resolve(result);
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    var Paginate = /** @class */ (function () {
        function Paginate() {
        }
        Paginate.findWithPaginate = function (query, options, callback) {
            var _this = this;
            var self = this;
            return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                var paginateOpts, itemCount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            paginateOpts = {};
                            if (options && options.req) {
                                paginateOpts = {
                                    url: options.req.protocol + ((options.is_secure ? 's' : '') + "://") + options.req.get('host') + options.req.originalUrl,
                                    limit: parseInt(options.limit || defaultLimit),
                                    skip: parseInt(options.skip || defaultSkip),
                                    count: 0
                                };
                            }
                            return [4 /*yield*/, self.countDocuments(query)];
                        case 1:
                            itemCount = _a.sent();
                            paginateOpts.count = itemCount;
                            result = getUrls(paginateOpts);
                            self
                                .find(query)
                                .select(self.selectOpts)
                                .populate(self.populateOpts)
                                .sort(self.sortOpts)
                                .skip(paginateOpts.skip)
                                .limit(paginateOpts.limit)
                                .exec(function (err, querySet) {
                                result.results = querySet;
                                if (callback) {
                                    if (err) {
                                        result = null;
                                    }
                                    callback(err, result);
                                }
                                if (err)
                                    return reject(err);
                                resolve(result);
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        Paginate.paginateSelect = function (opts) {
            this.selectOpts = opts;
            return this;
        };
        Paginate.paginatePopulate = function (opts) {
            this.populateOpts = opts;
            return this;
        };
        Paginate.paginateSort = function (opts) {
            this.sortOpts = opts;
            return this;
        };
        Paginate.selectOpts = '';
        Paginate.populateOpts = '';
        Paginate.sortOpts = '';
        return Paginate;
    }());
    schema.loadClass(Paginate);
}
exports.paginate = paginate;
//# sourceMappingURL=index.js.map