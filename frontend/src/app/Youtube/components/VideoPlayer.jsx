import "../VideoPlayer.css";

export default function VideoPlayer({ videoId }) {
  return (
    <div className="videoplayer-container">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="video"
      />
    </div>
  );
}
