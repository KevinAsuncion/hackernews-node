async function feed(parent, args, context, info) {
//construct the where object based on filter args
  const where = args.filter
    ? {
        OR: [
          { url_contains: args.filter },
          { description_contains: args.filter }
        ]
      }
    : {};

  //query the db for links based on arguments
  const queriedLinks = await context.db.query.links(
    { where, skip: args.skip, first: args.first, orderBy: args.orderBy },
    `{ id }`
  );

  //construct a query to return the total count in db
  const countSelectionSet = `
    {
      aggregate {
        count
      }
    }
  `;
  //query the db to retrieve the total number of Link elements
  const linksConnection = await context.db.query.linksConnection(
    {},
    countSelectionSet
  );

  return {
    count: linksConnection.aggregate.count,
    linkIds: queriedLinks.map(link => link.id)
  };
}


module.exports = {
  feed
};
