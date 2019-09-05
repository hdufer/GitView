import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import RepoListProvider from './Contexts/Context'

ReactDOM.render(<RepoListProvider>
                    <App />
                </RepoListProvider>,
                document.getElementById('root'));

serviceWorker.register();
