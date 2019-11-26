interface Options {
    limit?: number,
    skip?: number,
    url?: string,
    count?: number
}

interface PaginateOptions {
    limit?: any,
    skip?: any,
    req: any,
    is_secure?: boolean
}

interface DefaultOptions {
    defaultLimit?: number,
    defaultSkip?: number,
}

const getUrls = (opts: Options) => {
    let limit: any = opts.limit;
    let skip: any = opts.skip;
    let url: any = opts.url;
    let itemCount: any = opts.count;

    var parameters: any = getUrlParameters(url);

    url = Object.keys(parameters).length == 0 ? url += '?limit=&offset=' : url;
    if (('limit' in parameters) && !('offset' in parameters)) {
        url += '&offset=';
    } else if (!('limit' in parameters) && ('offset' in parameters)) {
        url += '&limit=';
    }
    url = parameters['limit'] ? url : url.replace('limit=', ('limit=' + limit));
    url = parameters['offset'] ? url : url.replace('offset=', ('offset=' + skip));

    let next_url = null,
        prev_url = null;

    let offset: any = limit + skip;

    if (offset < itemCount) {
        next_url = url.replace(('offset=' + skip), "offset=" + offset);
    }
    if (itemCount > 0 && skip > 0) {
        let offset = skip - limit;
        prev_url = url.replace(('offset=' + skip), "offset=" + (offset < 0 ? 0 : offset));
    }
    var result = {
        count: itemCount,
        next: next_url,
        previous: prev_url,
        results: []
    };
    return result;
}

const getUrlParameters: any = (url: string) => {
    var vars: any = {};
    var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
        return "";
    });
    return vars;
}

export function paginate(schema: any, opts: DefaultOptions) {
    let self: any = paginate;
    opts = Object.assign({}, (self.options || {}), opts);
    let defaultLimit = (opts ? (opts.defaultLimit ? opts.defaultLimit : 10) : 10);
    let defaultSkip = (opts ? (opts.defaultSkip ? opts.defaultSkip : 0) : 0)
    let result: any;
    schema.statics.aggregatePaginate = function (pipelines: Array<any>, options: PaginateOptions, callback: any) {
        return new Promise(async (resolve, reject) => {
            let paginateOpts: Options = {};
            if (options && options.req) {
                paginateOpts = {
                    url: options.req.protocol + `${options.is_secure ? 's' : ''}://` + options.req.get('host') + options.req.originalUrl,
                    limit: parseInt(options.limit || defaultLimit),
                    skip: parseInt(options.skip || defaultSkip),
                    count: 0
                }
            }
            let itemCount: any = 0;
            try {
                itemCount = await this.aggregate(pipelines).count('count');
            } catch (err) {
                if (callback) {
                    callback(err, null);
                }
                return reject(err);
            }
            if (itemCount && itemCount[0]) {
                itemCount = itemCount[0].count;
            } else {
                itemCount = 0;
            }
            if (paginateOpts && paginateOpts.url) {
                pipelines.push({ '$skip': paginateOpts.skip })
                pipelines.push({ '$limit': paginateOpts.limit })
            }
            paginateOpts.count = itemCount;
            result = getUrls(paginateOpts);
            if (itemCount == 0) {
                if (callback) {
                    callback(null, result);
                }
                return resolve(result);
            }
            this
                .aggregate(pipelines)
                .exec((err: any, querySet: Array<any>) => {
                    result.results = querySet;
                    if (callback) {
                        if (err) {
                            result = null;
                        }
                        callback(err, result);
                    }
                    if (err) return reject(err);
                    resolve(result);
                })
        })
    }

    class Paginate {
        static selectOpts: any = '';
        static populateOpts: any = '';
        static sortOpts: any = '';
        static findWithPaginate(query: any, options: PaginateOptions, callback: any) {
            let self: any = this;
            return new Promise(async (resolve, reject) => {
                let paginateOpts: Options = {};
                if (options && options.req) {
                    paginateOpts = {
                        url: options.req.protocol + `${options.is_secure ? 's' : ''}://` + options.req.get('host') + options.req.originalUrl,
                        limit: parseInt(options.limit || defaultLimit),
                        skip: parseInt(options.skip || defaultSkip),
                        count: 0
                    }
                }
                let itemCount = await self.countDocuments(query);
                paginateOpts.count = itemCount;
                result = getUrls(paginateOpts);

                self
                    .find(query)
                    .select(self.selectOpts)
                    .populate(self.populateOpts)
                    .sort(self.sortOpts)
                    .skip(paginateOpts.skip)
                    .limit(paginateOpts.limit)
                    .exec((err: any, querySet: Array<any>) => {
                        result.results = querySet;
                        if (callback) {
                            if (err) {
                                result = null;
                            }
                            callback(err, result);
                        }
                        if (err) return reject(err);
                        resolve(result);
                    });
            });
        }
        static paginateSelect(opts: any) {
            this.selectOpts = opts;
            return this;
        }
        static paginatePopulate(opts: any) {
            this.populateOpts = opts;
            return this;
        }
        static paginateSort(opts: any) {
            this.sortOpts = opts;
            return this;
        }
    }
    schema.loadClass(Paginate);
}
