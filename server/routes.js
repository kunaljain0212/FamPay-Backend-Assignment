import videosRouter from './api/controllers/videos/router';

export default function routes(app) {
  app.use('/api/v1/videos', videosRouter);
}
