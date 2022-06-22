import { PAGINATION_LIMIT } from '../../common/config';
import l from '../../common/logger';
import VideoModel from '../../models/videoModel';

class VideosService {
  /**
   * Fetches paginated videos filtered by the search query
   * @param {number} page - Number of page used for pagination starting from 0
   * @param {string} searchText - A query string used to filter through the videos
   * @returns
   */
  async getVideos(page, searchText) {
    const query = {};
    if (searchText) query['$text'] = { $search: searchText };
    try {
      return await VideoModel.find(query)
        .sort('-publishedAt')
        .skip(page * PAGINATION_LIMIT)
        .limit(PAGINATION_LIMIT);
    } catch (error) {
      l.error(`[GET VIDEOS] : ${error}`);
    }
  }
}

export default new VideosService();
