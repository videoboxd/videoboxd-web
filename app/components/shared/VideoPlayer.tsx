import ReactPlayer from "react-player";

interface VideoPlayerProps {
  url: string;
}

export default function VideoPlayer({ url }: VideoPlayerProps) {
  return <ReactPlayer url={url} controls width="100%" height="100%" />;
}
