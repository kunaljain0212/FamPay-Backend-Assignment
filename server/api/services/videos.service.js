import { PAGINATION_LIMIT } from '../../common/config';
import l from '../../common/logger';
import VideoModel from '../../models/videoModel';

class VideosService {
  async getVideos(page) {
    try {
      return await VideoModel.find()
        .sort('-publishedAt')
        .skip(page * PAGINATION_LIMIT)
        .limit(PAGINATION_LIMIT);
    } catch (error) {
      l.error(`[GET VIDEOS] : ${error}`);
    }
  }
}

export default new VideosService();
