import VideosService from '../../services/videos.service';

export class Controller {
  async getVideos(req, res) {
    try {
      const { page, searchText } = req.query;

      const videos = await VideosService.getVideos(page ?? 0, searchText);

      res.status(200).json({
        videos,
        message: 'Videos fetched successfully!',
      });
    } catch (error) {
      res.status(error.status || 500).json({
        message: error.message || 'Some error has occurred!',
      });
    }
  }
}
export default new Controller();
