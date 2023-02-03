// Import built-in graphQL types
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLInputObjectType, GraphQLList } = require('graphql');
const { User, Quiz, Question } = require('../models');
const { find } = require('../models/user.model');


const UserType = new GraphQLObjectType(
    {
        name: 'User',
        description: 'User Type',
        fields: () => ({
            id: { type: GraphQLID },
            username: { type: GraphQLString },
            email: { type: GraphQLString },
            quizzes: {
                type: new GraphQLList(QuizType),
                resolve(parent, args){
                    return Quiz.find( { userId: parent.id })
                }
            }
        })
    }
);


const QuizType = new GraphQLObjectType(
    {
        name: 'Quiz',
        description: 'Quiz Type',
        fields: () => ({
            id: { type: GraphQLID },
            slug: { type: GraphQLString },
            title: { type: GraphQLString },
            description: { type: GraphQLString },
            userId: { type: GraphQLID },
            user: {
                type: UserType,
                resolve(parent, args){
                    return User.findById(parent.userId)
                }
            },
            questions: {
                type: new GraphQLList(QuestionType),
                resolve(parent, args){
                    return Question.find( { quizId: parent.id })
                }
            }
        })
    }
);


// Create a Question Type (INPUT) for mutation of creating a quiz
const QuestionInputType = new GraphQLInputObjectType(
    {
    name: 'QuestionInputType',
    description: 'Question Input Type',
    fields: () => ({
        title: { type: GraphQLString },
        order: { type: GraphQLInt },
        correctAnswer: { type: GraphQLString },
    })
    }
);

// Create a Question Type for queris
const QuestionType = new GraphQLObjectType(
    {
        name: 'Question',
        description: 'Question Type',
        fields: () => ({
            id: { type: GraphQLID },
            title: { type: GraphQLString },
            correctAnswer: { type: GraphQLString },
            order: { type: GraphQLInt },
            quizId: { type: GraphQLID },
            quiz: { 
                type: QuizType,
                resolve(parent, args){
                    return Quiz.findById(parent.quizId)
                }
             },

        })
    }
)

// Create an Answer Input Type for submitting a quiz
const AnswerInputType = new GraphQLInputObjectType(
    {
        name: 'AnswerInput',
        description: 'Answer Input Type',
        fields: () => ({
            questionId: { type: GraphQLID },
            answer: { type: GraphQLString }
        })
    }
);


module.exports = {
    UserType,
    QuizType,
    QuestionInputType,
    AnswerInputType
};
