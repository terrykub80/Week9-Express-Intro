const QuizDashboardRouter = require('express').Router();


QuizDashboardRouter.route('/create')
    // .get((req, res) => {
    //     res.render('editor')
    // })
    .get(require('./editor'));




module.exports = QuizDashboardRouter;