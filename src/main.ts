import { app } from './app';
import { initDb } from './db';

initDb();
app.listen(51789, '127.0.0.1', () => console.log('http://localhost:51789'));
