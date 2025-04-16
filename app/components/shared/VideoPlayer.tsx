import { useEffect, useState } from "react";
import * as ReactPlayerImport from "react-player";

const ReactPlayer = ReactPlayerImport.default;

interface VideoPlayerProps {
  url: string;
}

export default function VideoPlayer({ url }: VideoPlayerProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return <ReactPlayer url={url} controls width="100%" height="100%" />;
}
