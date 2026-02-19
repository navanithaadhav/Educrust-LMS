import React from 'react';
import YouTube from 'react-youtube';
import { Lecture } from '../../../types';

interface VideoPlayerProps {
    playerData: Lecture | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ playerData }) => {
    // Helper to extract YouTube ID
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (!playerData || (playerData.resourceType && playerData.resourceType !== 'video')) return null;

    if (!playerData.lectureUrl) return <div className="w-full h-full bg-black flex items-center justify-center text-white">Video unavailable</div>;

    const youtubeId = getYouTubeId(playerData.lectureUrl);

    return (
        <>
            {youtubeId ? (
                <YouTube
                    videoId={youtubeId}
                    opts={{ width: '100%', height: '100%', playerVars: { autoplay: 0 } }}
                    className="w-full h-full"
                    iframeClassName="w-full h-full"
                />
            ) : (
                <video
                    controls
                    src={playerData.lectureUrl}
                    className="w-full h-full bg-black"
                />
            )}
        </>
    );
};

export default VideoPlayer;
