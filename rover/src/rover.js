
                    // import React from 'react'
                    // import { createStore } from 'redux'
                    // import { Provider } from 'react-redux'
                    //
                    // import rootReducer from './client/root'
                    //
                    // import App from './client/App'
                    // import { StaticRouter } from 'react-router-redux'

const Koa = require('koa');

//
// Configure
//
const app = module.exports = new Koa();

                                  // // This is fired every time the server side receives a request
                                  // app.use(handleRender)
                                  //
                                  // function handleRender(ctx) {
                                  //   // Create a new Redux store instance
                                  //   const store = createStore(rootReducer)
                                  //
                                  //   // Render the component to a string
                                  //   const html = renderToString(
                                  //     <Provider store={store}>
                                  //       <StaticRouter>
                                  //       <div>
                                  //         <App />
                                  //       </div>
                                  //       </StaticRouter>
                                  //     </Provider>,
                                  //   )
                                  //
                                  //   // Grab the initial state from our Redux store
                                  //   const preloadedState = store.getState()
                                  //
                                  //   // Send the rendered page back to the client
                                  //   res.send(renderFullPage(html, preloadedState))
                                  // }
                                  // // TODO HARDCODED
                                  // function renderFullPage(html, preloadedState) {
                                  //   return `
                                  //   <!DOCTYPE html>
                                  //   <html lang="en">
                                  //     <head>
                                  //       <meta charset="utf-8">
                                  //       <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                                  //       <meta name="theme-color" content="#000000">
                                  //       <link rel="manifest" href="%PUBLIC_URL%/manifest.json">
                                  //       <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
                                  //
                                  //       <title>Rover</title>
                                  //       <link href="/static/css/main.29266132.css" rel="stylesheet">
                                  //     </head>
                                  //     <body>
                                  //       <div id="root">${html}</div>
                                  //       <script>
                                  //         window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
                                  //       </script>
                                  //       <script type="text/javascript" src="/static/js/main.d1ba7f4a.js">
                                  //     </body>
                                  //   </html>
                                  //     `
                                  // }

const serve = require('koa-static');
app.use(serve('./build'));

// TODO this is not working?
const compress = require('koa-compress');
app.use(compress());

// http logger
const { file, dev } = require('./server/logger');
if (process.env.NODE_ENV !== 'production') {
  app.use(dev);
} else {
  app.use(file);
}

// database
const db = require('./server/db');

// router
const router = require('./server/routes/router')(db);

//
// Start
//
app.use(router.routes());
app.listen(3030);
console.log('app listening on 3030');

//
// Cleanup and exit
//
const nodeCleanup = require('node-cleanup');
nodeCleanup(function (exitCode, signal) {
  db.close().then(() => {
    console.log('db connection closed');
  });
});
