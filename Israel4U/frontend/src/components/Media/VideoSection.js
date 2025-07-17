import React from 'react';

function VideoSection() {
  return (
    <div className="video-section">
      <h3>Community Video</h3>
      <video 
        width="100%" 
        height="300" 
        controls
        className="community-video"
      >
        <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default VideoSection; 