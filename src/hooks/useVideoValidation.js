import { useState, useEffect, useCallback } from 'react';

const CACHE_KEY = 'youtube_video_validation_cache';
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get cached validation results from localStorage
 */
function getCache() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return {};

    const parsed = JSON.parse(cached);
    const now = Date.now();

    // Clean expired entries
    const cleaned = {};
    for (const [url, entry] of Object.entries(parsed)) {
      if (now - entry.timestamp < CACHE_EXPIRY_MS) {
        cleaned[url] = entry;
      }
    }

    return cleaned;
  } catch {
    return {};
  }
}

/**
 * Save validation result to cache
 */
function saveToCache(url, isValid) {
  try {
    const cache = getCache();
    cache[url] = {
      isValid,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // localStorage might be full or disabled
  }
}

/**
 * Extract video ID from YouTube URL
 */
function extractVideoId(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

/**
 * Check if a YouTube video is available using oEmbed API
 */
async function checkVideoAvailability(url) {
  const cache = getCache();

  // Return cached result if available
  if (cache[url]) {
    return cache[url].isValid;
  }

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const response = await fetch(oembedUrl, { method: 'HEAD' });

    const isValid = response.ok;
    saveToCache(url, isValid);

    if (!isValid) {
      const videoId = extractVideoId(url);
      console.warn(`[Broken Video] ${url} (ID: ${videoId}) - Status: ${response.status}`);
    }

    return isValid;
  } catch (error) {
    // Network error - assume video might be valid to avoid false negatives
    console.warn(`[Video Check Error] ${url}:`, error.message);
    return true;
  }
}

/**
 * Hook to validate and filter YouTube videos
 * @param {Array} videos - Array of video objects with 'url' property
 * @returns {Object} - { validVideos, isValidating, brokenVideos }
 */
export function useVideoValidation(videos) {
  const [validVideos, setValidVideos] = useState([]);
  const [brokenVideos, setBrokenVideos] = useState([]);
  const [isValidating, setIsValidating] = useState(false);

  const validateVideos = useCallback(async (videoList) => {
    if (!videoList || videoList.length === 0) {
      setValidVideos([]);
      setBrokenVideos([]);
      setIsValidating(false);
      return;
    }

    setIsValidating(true);

    const results = await Promise.all(
      videoList.map(async (video) => {
        const isValid = await checkVideoAvailability(video.url);
        return { video, isValid };
      })
    );

    const valid = results.filter(r => r.isValid).map(r => r.video);
    const broken = results.filter(r => !r.isValid).map(r => r.video);

    if (broken.length > 0) {
      console.group('Broken Videos Found');
      broken.forEach(v => {
        console.log(`- ${v.title} (${v.channel}): ${v.url}`);
      });
      console.groupEnd();
    }

    setValidVideos(valid);
    setBrokenVideos(broken);
    setIsValidating(false);
  }, []);

  useEffect(() => {
    validateVideos(videos);
  }, [videos, validateVideos]);

  return { validVideos, isValidating, brokenVideos };
}

/**
 * Clear the video validation cache
 */
export function clearVideoCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
    console.log('Video validation cache cleared');
  } catch {
    // Ignore errors
  }
}
