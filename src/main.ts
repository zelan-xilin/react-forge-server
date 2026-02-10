import { app } from './app';
import { initDb } from './db';

initDb();
app.listen(3000, '0.0.0.0', () => console.log('http://0.0.0.0:3000'));
