import 'reflect-metadata';
import 'dotenv/config';
import { Container } from './ioc/inversify.config';


const container = new Container();
const app = container.getApp();

app.initialize();
app.listen();
