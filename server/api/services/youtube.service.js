import { google } from 'googleapis';

import {
  getGoogleAPIKey,
  incrementCurrentKey,
  QUERY,
} from '../../common/config';
import l from '../../common/logger';
import VideoModel from '../../models/videoModel';

class YouTubeService {
  constructor() {
    this.youtube = google.youtube({
      version: 'v3',
      auth: getGoogleAPIKey(),
    });

    l.info('Youtube Loaded!');

    this.publishedAfter = new Date(
      new Date().setUTCHours(0, 0, 0, 0)
    ).toISOString();
  }

  /**
   * Saves a video to the database
   * @param {object} video - A Video object fetched from the Youtube API
   */
  async saveVideo(video) {
    const {
      id,
      snippet: { title, description, publishedAt, thumbnails },
    } = video;
    try {
      await VideoModel.create({
        _id: id.videoId,
        title,
        description,
        publishedAt,
        thumbnails: {
          default: thumbnails.default.url,
          high: thumbnails.high.url,
        },
      });
    } catch (error) {
      l.error(`[SAVE VIDEO] : ${error}`);
    }
  }

  /**
   * Saves a list of videos to the database
   * @param {Array<object>} videos - An array of videos fetched from the Youtube API
   */
  async saveVideos(videos) {
    try {
      const promises = videos.map((video) => this.saveVideo(video));
      await Promise.all(promises);
    } catch (error) {
      l.error(`[SAVE VIDEOS] : ${error}`);
    }
  }

  /**
   * Polls the Youtube API to search for the latest videos
   */
  async fetchLatestVideos() {
    try {
      const {
        data: { items },
      } = await this.youtube.search.list({
        part: 'id,snippet',
        order: 'date',
        publishedAfter: this.publishedAfter,
        q: QUERY,
        type: 'video',
      });

      // Change publishedAfter to the latest video's published time
      // to ensure videos aren't repeated.
      if (items[0]) {
        this.publishedAfter = items[0].publishedAt;
        this.saveVideos(items);
      }
    } catch (error) {
      // Use the next API Key if the current one exceeded the quota.
      if (error.message.includes('exceeded')) {
        incrementCurrentKey();
        console.log(getGoogleAPIKey());
        this.youtube = google.youtube({
          version: 'v3',
          auth: getGoogleAPIKey(),
        });
      }
      l.error(`[FETCH LATEST VIDEOS] : ${error}`);
    }
  }
}

export default new YouTubeService();
