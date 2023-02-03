const axios = require('axios')

module.exports = (req, res) => {
    try{
        const qyery = `
            query($id: ID!){
                submission(id:$id){
                    id
                    quiz{
                        title
                    }
                    score
                }
            }
        `

        const { data } = await axios.post(
            process.env.GRAPHQL_endpoint,
            {
                qyery,
                variables: {
                    id: req.params.id
                }
            },
            {
                headers: {
                    'COntent-Type': 'application/json'
                }
            }
        );
        

        let submission = data.data.submission
        res.render('results', { submission })

    } catch(err){
        console.log(err)
    }
}