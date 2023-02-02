module.exports = (req, res) => {

    res.cookie('jwtToken', '', { httpOnly: true });
    res.redirect('/auth/login');
}