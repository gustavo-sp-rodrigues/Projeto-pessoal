const express = require('express');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// load environment variables: prefer .env, fallback to .env.dev if present
if (fs.existsSync(path.join(__dirname, '.env'))) {
  dotenv.config({ path: path.join(__dirname, '.env') });
} else if (fs.existsSync(path.join(__dirname, '.env.dev'))) {
  dotenv.config({ path: path.join(__dirname, '.env.dev') });
}

const app = express();
const PORT = process.env.APP_PORT || process.env.PORT || 3000;

// parse body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static folders
app.use(express.static(path.join(__dirname, 'public')));
app.use('/site', express.static(path.join(__dirname, 'site')));
// allow the site frontend to access public assets via /site/assets/banco_site
app.use('/site/assets/banco_site', express.static(path.join(__dirname, 'public', 'assets')));

// mount routers if they exist
try {
  const indexRouter = require('./src/routes/index');
  app.use('/', indexRouter);
} catch (err) {
  // ignore if not present
}

const tryMount = (routePath, mountPath) => {
  try {
    app.use(mountPath, require(routePath));
  } catch (err) {
    // ignore missing route files
  }
};

tryMount('./src/routes/usuarios', '/usuarios');
tryMount('./src/routes/medidas', '/medidas');
tryMount('./src/routes/comentarios', '/comentarios');
tryMount('./src/routes/avisos', '/avisos');
// replace aquarios route with a more generic 'locais' mount used by the Vôlei SP frontend
// tryMount('./src/routes/locais', '/locais');

// 404 handler
app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(PORT, () => {
  // banner similar ao original pedido: "WEB DATA VIZ" em destaque
  console.log('\n\n#############################################################');
  console.log('#                                                           #');
  console.log('#                      WEB   DATA   VIZ                      #');
  console.log('#                                                           #');
  console.log('#############################################################\n');
  console.log(`Server running on http://localhost:${PORT}`);
});
