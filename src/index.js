import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';

const root = ReactDOM.createRoot(document.getElementById('root'));
const qc = new QueryClient();
root.render(
    <QueryClientProvider client={qc}>
        <App />
    </QueryClientProvider>
);