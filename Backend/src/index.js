import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './registerServiceWorker';
require('dotenv').config();

console.log(process.env);

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();