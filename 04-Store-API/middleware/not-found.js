const notFound = (req, res) => res.static(404).send('route does not exist');

module.exports = notFound