import { google } from 'googleapis';

import {
  getGoogleAPIKey,
  incrementCurrentKey,
  QUERY,
  TIME_DELTA,
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

    this.publishedAfter = new Date(Date.now() - TIME_DELTA).toISOString();
    console.log(this.publishedAfter);
  }

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

  async saveVideos(videos) {
    try {
      const promises = videos.map((video) => this.saveVideo(video));
      await Promise.all(promises);
    } catch (error) {
      l.error(`[SAVE VIDEOS] : ${error}`);
    }
  }

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
      if (items[0]) this.publishedAfter = items[0].publishedAt;
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
