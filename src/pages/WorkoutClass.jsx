import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/shared';
import workoutData from '../data/workoutVideos.json';
import { useVideoValidation } from '../hooks/useVideoValidation';

function WorkoutClass() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);

  const { workoutTypes, durations, videos } = workoutData;

  // Get filtered videos based on type and duration
  const filteredVideos = useMemo(() => {
    if (!selectedType || !selectedDuration) return [];
    return videos[selectedType]?.[selectedDuration] || [];
  }, [selectedType, selectedDuration, videos]);

  // Validate videos - only runs when filteredVideos changes
  const { validVideos, isValidating, brokenVideos } = useVideoValidation(filteredVideos);

  const handleVideoClick = (url) => {
    window.open(url, '_blank');
  };

  const clearFilters = () => {
    setSelectedType(null);
    setSelectedDuration(null);
  };

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#FBFAF2' }}>
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-warm-700 font-medium hover:bg-white transition-colors"
      >
        Back to Room
      </button>

      <div className="max-w-4xl mx-auto pt-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2" style={{ color: '#ff91af' }}>
            Workout Class
          </h1>
          <p className="text-warm-600">
            Find the perfect workout for you and your partner
          </p>
        </div>

        {/* Workout Type Filter */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3" style={{ color: '#ff91af' }}>
            Workout Type
          </h2>
          <div className="flex flex-wrap gap-2">
            {workoutTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type === selectedType ? null : type)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedType === type
                    ? 'text-white shadow-md'
                    : 'text-warm-700 hover:shadow-sm'
                }`}
                style={{
                  backgroundColor: selectedType === type ? '#ff91af' : '#ffecf2',
                  border: `2px solid ${selectedType === type ? '#ff91af' : '#fbcce7'}`,
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Duration Filter */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3" style={{ color: '#ff91af' }}>
            Duration
          </h2>
          <div className="flex flex-wrap gap-2">
            {durations.map((duration) => (
              <button
                key={duration}
                onClick={() => setSelectedDuration(duration === selectedDuration ? null : duration)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedDuration === duration
                    ? 'text-white shadow-md'
                    : 'text-warm-700 hover:shadow-sm'
                }`}
                style={{
                  backgroundColor: selectedDuration === duration ? '#ff91af' : '#ffecf2',
                  border: `2px solid ${selectedDuration === duration ? '#ff91af' : '#fbcce7'}`,
                }}
              >
                {duration}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {(selectedType || selectedDuration) && (
          <div className="mb-6">
            <button
              onClick={clearFilters}
              className="text-sm underline hover:no-underline"
              style={{ color: '#ff91af' }}
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Results */}
        <div className="mb-8">
          {!selectedType && !selectedDuration ? (
            <div
              className="text-center py-12 rounded-2xl"
              style={{ backgroundColor: '#ffecf2', border: '1px solid #fbcce7' }}
            >
              <svg
                className="w-16 h-16 mx-auto mb-4 opacity-50"
                style={{ color: '#ff91af' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-warm-600 text-lg">
                Select a workout type and duration to see videos
              </p>
            </div>
          ) : !selectedType ? (
            <div
              className="text-center py-8 rounded-2xl"
              style={{ backgroundColor: '#ffecf2', border: '1px solid #fbcce7' }}
            >
              <p className="text-warm-600">Please select a workout type</p>
            </div>
          ) : !selectedDuration ? (
            <div
              className="text-center py-8 rounded-2xl"
              style={{ backgroundColor: '#ffecf2', border: '1px solid #fbcce7' }}
            >
              <p className="text-warm-600">Please select a duration</p>
            </div>
          ) : isValidating ? (
            <div
              className="text-center py-12 rounded-2xl"
              style={{ backgroundColor: '#ffecf2', border: '1px solid #fbcce7' }}
            >
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-pink-300 border-t-pink-500 mb-4"></div>
              <p className="text-warm-600">Checking video availability...</p>
            </div>
          ) : validVideos.length === 0 ? (
            <div
              className="text-center py-8 rounded-2xl"
              style={{ backgroundColor: '#ffecf2', border: '1px solid #fbcce7' }}
            >
              <svg
                className="w-12 h-12 mx-auto mb-3 opacity-50"
                style={{ color: '#ff91af' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <p className="text-warm-600 mb-2">
                {filteredVideos.length > 0
                  ? 'No available videos found. The videos for this selection may have been removed.'
                  : 'No videos match your filters. Try adjusting the tag filters.'}
              </p>
              {brokenVideos.length > 0 && (
                <p className="text-warm-500 text-sm">
                  ({brokenVideos.length} video{brokenVideos.length > 1 ? 's' : ''} unavailable - check console for details)
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold" style={{ color: '#ff91af' }}>
                  {selectedType} - {selectedDuration}
                </h2>
                {brokenVideos.length > 0 && (
                  <span className="text-xs text-warm-500">
                    {brokenVideos.length} unavailable video{brokenVideos.length > 1 ? 's' : ''} hidden
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {validVideos.map((video, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleVideoClick(video.url)}
                    className="p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.01]"
                    style={{
                      backgroundColor: '#ffecf2',
                      border: '1px solid #fbcce7',
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* YouTube icon */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: '#ff91af' }}
                      >
                        <svg
                          className="w-6 h-6 text-white"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      </div>

                      {/* Video info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-warm-800 mb-1">
                          {video.title}
                        </h3>
                        <p className="text-sm text-warm-600 mb-2">
                          {video.channel}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {video.tags?.map((tag, tagIdx) => (
                            <span
                              key={tagIdx}
                              className="text-xs px-2 py-1 rounded-full"
                              style={{
                                backgroundColor: tag === 'high intensity' ? '#ffe4e9' : '#e8f5e9',
                                color: tag === 'high intensity' ? '#d32f2f' : '#388e3c',
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0 self-center">
                        <svg
                          className="w-5 h-5 text-warm-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Tip section */}
        <div
          className="p-6 rounded-2xl"
          style={{ backgroundColor: '#ffecf2', border: '1px solid #fbcce7' }}
        >
          <h3 className="font-semibold mb-2" style={{ color: '#ff91af' }}>
            Workout Together!
          </h3>
          <p className="text-warm-600 text-sm">
            Cast the video to your TV or share your screen for a fun couples workout session.
            Remember to warm up before high intensity workouts and cool down after!
          </p>
        </div>
      </div>
    </div>
  );
}

export default WorkoutClass;
