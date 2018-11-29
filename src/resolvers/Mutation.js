const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

async function signup(parent, args, context, info) {
  //hash password
  const password = await bcrypt.hash(args.password, 10);
  // create user
  const user = await context.db.mutation.createUser(
    {
      data: { ...args, password }
    },
    `{ id }`
  );

  //get token
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // return token and user
  return {
    token,
    user
  };
}

async function login(parent, args, context, info) {
  // check if user exists if not throw error
  const user = await context.db.query.user(
    { where: { email: args.email } },
    ` { id password } `
  );
  if (!user) {
    throw new Error("No such user found");
  }

  // Check if password is valid if not throw error
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }
  //create token
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // return token and user
  return {
    token,
    user
  };
}

function post(parent, args, context, info) {

    //validate jwt
  const userId = getUserId(context);
  //create link
  return context.db.mutation.createLink(
    {
      data: {
        url: args.url,
        description: args.description,
        postedBy: { connect: { id: userId } }
      }
    },
    info
  );
}

async function vote(parent, args, context, info) {
  //validate incoming jwt
  const userId = getUserId(context);

  //check if vote exists on link throw error if already voted
  const linkExists = await context.db.exists.Vote({
    user: { id: userId },
    link: { id: args.linkId }
  });
  if (linkExists) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  //Create vote
  return context.db.mutation.createVote(
    {
      data: {
        user: { connect: { id: userId } },
        link: { connect: { id: args.linkId } }
      }
    },
    info
  );
}
module.exports = {
    post,
    signup,
    login,
    vote,
}

