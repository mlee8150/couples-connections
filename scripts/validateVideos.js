// Script to validate all YouTube video URLs in workoutVideos.json
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '../src/data/workoutVideos.json');

async function checkVideo(url) {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const response = await fetch(oembedUrl, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

async function validateAllVideos() {
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const brokenVideos = [];
  const validVideos = [];

  console.log('Checking all videos...\n');

  for (const [type, durations] of Object.entries(data.videos)) {
    for (const [duration, videos] of Object.entries(durations)) {
      for (const video of videos) {
        const isValid = await checkVideo(video.url);
        const status = isValid ? '✓' : '✗';
        console.log(`${status} [${type}/${duration}] ${video.title}`);

        if (!isValid) {
          brokenVideos.push({
            type,
            duration,
            ...video
          });
        } else {
          validVideos.push({
            type,
            duration,
            ...video
          });
        }
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\nTotal: ${validVideos.length + brokenVideos.length} videos`);
  console.log(`Valid: ${validVideos.length}`);
  console.log(`Broken: ${brokenVideos.length}`);

  if (brokenVideos.length > 0) {
    console.log('\n--- BROKEN VIDEOS ---\n');
    brokenVideos.forEach(v => {
      console.log(`Type: ${v.type}`);
      console.log(`Duration: ${v.duration}`);
      console.log(`Title: ${v.title}`);
      console.log(`Channel: ${v.channel}`);
      console.log(`URL: ${v.url}`);
      console.log(`Tags: ${v.tags?.join(', ') || 'none'}`);
      console.log('---');
    });
  }

  return { brokenVideos, validVideos };
}

validateAllVideos();
