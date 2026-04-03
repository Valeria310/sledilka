import { createServer } from 'http';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/front', express.static('./public/front', { index: 'index.html' }));

app.get('/', (req, res) => {
    res.redirect('front');
});

const httpServer = createServer(app);

// async function main() {
//     const api = await import('./api/index.js');
//     app.use('/api', api.default);
// }

// main();

export { app, httpServer };
