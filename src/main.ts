import { app } from './app';
import { initDb } from './db';

initDb();
app.listen(3000, () => console.log('http://localhost:3000'));
