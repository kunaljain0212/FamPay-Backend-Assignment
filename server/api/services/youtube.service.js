import { google } from 'googleapis';

import {
  getGoogleAPIKey,
  incrementCurrentKey,
  QUERY,
  TIME_DELTA,
} from '../../common/config';
import l from '../../common/logger';

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

  async fetchLatestVideos() {
    try {
      l.info('Fetching Latest Videos');

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
