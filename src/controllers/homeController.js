const home = (req, res) => {
  res.render('index', {
    title: 'Helmet & CSRF',
  });
}

const trataPost = (req, res) => {
  console.log(req.body);
  res.send(req.body);
}

module.exports = {
  home,
  trataPost
}