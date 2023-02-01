const { GraphQLString } = require('graphql');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const { createJwtToken } = require('../util/auth');


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

        const token = createJwtToken(user);

        return token;
    }
}


const login = {
    type: GraphQLString,
    desciroption: "Log a user in with email and password",
    args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    },
    async resolve(parent, args){
        const user = await User.findOne({ email: args.email })
        
        const hashedPassword = user?.password || ""

        const correctPassword = await bcrypt.compare(args.password, hashedPassword)
        
        if (!user || !correctPassword){
            throw new Error("Invalid Credentials")
        }

        const token = createJwtToken(user);
        return token
    }
}

module.exports = {
    register,
    login
}