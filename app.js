const express = require('express');
const postRoutes = require('./routes/postRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use('/', postRoutes);

app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    statusCode: 404,
    message: 'The page you are looking for does not exist or may have been moved.',
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500
      ? 'Something went wrong on the server. Please try again in a moment.'
      : err.message;

  res.status(statusCode).render('error', {
    title: statusCode === 404 ? 'Page Not Found' : 'Something Went Wrong',
    statusCode,
    message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
