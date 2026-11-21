import express from 'express';
import cors from 'cors';
import { moviesRoutes } from './modules/movies/movies.routes';
import globalErrorHandler from './middleware/globalErrorHandler';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({ message: 'Hello, World!' });
});

app.use('/api/v1',moviesRoutes);
app.use(globalErrorHandler);


export default app;