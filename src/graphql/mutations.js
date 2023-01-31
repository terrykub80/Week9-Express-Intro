const { GraphQLString } = require('graphql');
const { User } = require('../models');
const bcrypt = require('bcrypt');

const register = {
    type: GraphQLString,
    desciroption: 'Register a new user',
    args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
    },
    async resolve(parent, args){
        const checkUser = await User.findOne({ email: args.email })
        if (checkUser){
            throw new Error("user with this email address already exists")
        }

        const { username, email, password } = args;

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({ username, email, password: passwordHash });

        await user.save();

        return user.username
    }
}

module.exports = {
    register
}