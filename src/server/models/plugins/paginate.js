/*
 * refs:
 *   - plugin: <http://mongoosejs.com/docs/plugins.html>
 *   - pagination: <http://stackoverflow.com/questions/5539955/how-to-paginate-with-mongoose-in-node-js>
 *
 * example usage:
 *   ```
 *   import paginatePlugin from './plugins/paginate';
 *   YourSchema.plugin(paginatePlugin);
 *   ```
 *
 *   ```
 *   someListController(req, res) {
 *     YourSchema.paginate({page: req.query.page}, (err, page) => {
 *       YourSchema
 *         .find({})
 *         .limit(page.limit)
 *         .skip(page.skip)
 *         .exec((err, yourEntries) => {
 *           res.json({
 *             yourEntries: yourEntries,
 *             page: page,
 *           });
 *         });
 *     });
 *   }
 *   ```
 */

function getOptions(customOpts) {
  let opts = {};

  opts.condition = customOpts.condition         || {};
  opts.perPage = Number(customOpts.perPage)     || 20;
  opts.firstPage = Number(customOpts.firstPage) || 1;
  opts.page = Number(customOpts.page)           || 1;

  return opts;
}

export function recordCountToPageObject(count, customOpts) {
  let opts = getOptions(customOpts);

  let totalPage = Math.max(Math.ceil(count / opts.perPage), 1);
  let lastPage = opts.firstPage + totalPage - 1;

  if (opts.page < opts.firstPage) {
    opts.page = opts.firstPage;
  } else if (lastPage < opts.page) {
    opts.page = lastPage;
  }

  return {
    skip: opts.perPage * (opts.page - opts.firstPage),
    limit: opts.perPage,
    first: opts.firstPage,
    current: opts.page,
    last: lastPage,
    total: totalPage,
  };
};

export function recordsOfPage({ records, page, sort }) {
  if (sort) {
    return records
      .sort(sort)
      .slice(page.skip, page.skip + page.limit);
  }
  return records
    .slice(page.skip, page.skip + page.limit);
};

export default (schema, options) => {
  schema.statics.paginate = function paginate(customOpts, cb) {
    let opts = getOptions(customOpts);

    this
      .count(opts.condition)
      .exec((err, count) => {
        let page = recordCountToPageObject(count, opts);

        cb(err, page);
      });
  };
};
