import { app } from './app';
import { initDb } from './db';

initDb();
app.listen(3000, '127.0.0.1', () => console.log('http://127.0.0.1:3000'));
