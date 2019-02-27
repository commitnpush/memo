import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import session from 'express-session';
import api from './routes';

const app = express();

/* mongodb connection */
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => console.log('Connected to mongodb server'));
mongoose.connect('mongodb://localhost/memo');

/*use session */
app.use(session({
  secret: "Memo$1$234",
  resave: false,
  saveUninitialized:true
}));



app.use(morgan('dev'));
app.use(bodyParser.json());


app.use('/api', api);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server Error");
});

app.listen(8080, () => console.log("Listening on port 8080!"));