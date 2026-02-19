import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Lecture } from '../../../types';
import { useAppContext } from '../../../context/AppContext';

interface DocViewerProps {
    playerData: Lecture | null;
}

const DocViewer: React.FC<DocViewerProps> = ({ playerData }) => {
    const { backendUrl } = useAppContext();
    const [htmlContent, setHtmlContent] = useState<string>('');

    useEffect(() => {
        const fetchHtml = async () => {
            if (playerData?.resourceType === 'html-file' && playerData.lectureUrl) {
                try {
                    // Fetch content via backend proxy to avoid CORS issues
                    const { data } = await axios.get(`${backendUrl}/api/course/content?url=${encodeURIComponent(playerData.lectureUrl)}`);
                    if (data.success) {
                        setHtmlContent(data.content);
                    } else {
                        console.error("Failed to load HTML file:", data.message);
                        setHtmlContent("<h1>Failed to load content</h1>");
                    }
                } catch (error) {
                    console.error("Failed to load HTML file", error);
                    setHtmlContent("<h1>Failed to load content</h1>");
                }
            } else {
                setHtmlContent('');
            }
        }
        fetchHtml();
    }, [playerData, backendUrl]);

    if (!playerData) return null;

    if (playerData.resourceType === 'html-file') {
        return htmlContent ? (
            <iframe
                srcDoc={htmlContent}
                className="w-full h-full bg-white border-0"
                title="Lecture Content"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
        ) : (
            <div className="flex items-center justify-center h-full">
                <p>Loading HTML content...</p>
            </div>
        );
    }

    if (playerData.resourceType === 'pdf' || playerData.resourceType === 'ppt') {
        return (
            <div className="flex flex-col h-full gap-4">
                <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(playerData.lectureUrl)}&embedded=true`}
                    className="w-full flex-1 bg-gray-100 min-h-[500px]"
                    title="Document Viewer"
                />
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-between">
                    <div>
                        <p className="text-sm text-blue-800 font-medium">Issue viewing the file?</p>
                        <p className="text-xs text-blue-600">The browser cannot preview some large files (like &gt;20MB PDF/PPT).</p>
                    </div>
                    <a
                        href={playerData.lectureUrl}
                        download
                        target="_parent"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded inline-flex items-center gap-2 transition-colors cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Download Document
                    </a>
                </div>
            </div>
        );
    }

    return null;
};

export default DocViewer;
