const express = require('express');
const app = express();
const port = 3000;


app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('register', { username: 'terryk' });
});

app.listen(port, () => {
    console.log(`Servier is listening on port ${port}`)
})