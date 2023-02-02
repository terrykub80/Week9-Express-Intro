const { GraphQLString, GraphQLID } = require('graphql');
const { User, Quiz } = require('../models');
const bcrypt = require('bcrypt');
const { createJwtToken } = require('../util/auth');


const register = {
    type: GraphQLString,
    description: 'Register a new user',
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
    description: "Log a user in with email and password",
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
};

const createQuiz = {
    type: GraphQLString,
    description: "Creates a new quiz with questions",
    args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        userId: { type: GraphQLID },
    },
    async resolve(parent, args){
        // Generate a slug for our quiz based on the title
        let slugify = args.title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-')
        /*
        Add a random integer to the end of the slug, check that the slug does not already exist
        if it does, generate a new slug number
        */
        let fullSlug;
        let existingQuiz;
        do{
            let slugId = Math.floor(Math.random() * 10000);
            fullSlug = `${slugify} -${slugId}`;

            existingQuiz = await Quiz.findOne({ slug: fullSlug });
        } while(existingQuiz);

        const quiz = new Quiz({
            title: args.title,
            slug: fullSlug,
            description: args.description,
            userId: args.userId
        })

        quiz.save();

        return quiz.slug
    }
};

module.exports = {
    register,
    login,
    createQuiz
}