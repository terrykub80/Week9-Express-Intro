const axios = require('axios');

module.exports = async (req, res) => {
    console.log(req.body);
    // First check to make sure the password and confirmPass are the same
    if (req.body.password != req.body.confirmPass){
        res.send({error: 'Your passwords do not match'})
    } else {
        // // Get the data from the request body
        // const { username, email, password } = req.body
        // // Has the password before creating user
        // const passwordHash = await bcrypt.hash(password, 10);
        // const user = new User({ username, email, password: passwordHash });
        // user.save();
        // res.send(`New User Created - ${user.username}`);
        try {
            const mutation = `
            mutation ($email: String!, $username: String!, $password: String!){
                register(email: $email, username: $username, password: $password)
            }
            `
            const { data } = await axios.post(process.env.GRAPHQL_ENDPOINT, 
                    {
                        query: mutation, 
                        variables: {
                            email: req.body.email,
                            username: req.body.username,
                            password: req.body.password,
                        }
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )

            const jwtToken = data.data.register
            console.log(jwtToken);
            res.cookie('jwtToken', jwtToken, { httpOnly: true })

            res.redirect('/')
        }catch(err){
            console.log(err)
            res.redirect('/auth/register')
        }
    }
};