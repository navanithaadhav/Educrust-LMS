import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Lecture } from '../../../types';
import { useAppContext } from '../../../context/AppContext';
import { Info, DownloadCloud } from 'lucide-react';

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
            <div className="flex flex-col h-full gap-4 p-4 box-border">
                <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(playerData.lectureUrl)}&embedded=true`}
                    className="w-full flex-1 bg-gray-50 min-h-0 rounded-2xl border border-gray-200/60 shadow-inner"
                    title="Document Viewer"
                />
                <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:shadow-md ring-1 ring-black/5 shrink-0">
                    <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0 shadow-inner ring-1 ring-blue-100/50">
                            <Info size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-[15px] text-slate-800 font-semibold mb-1">Issue viewing this document?</p>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-lg">
                                Some browsers have limitations when previewing very large files (e.g., &gt;20MB presentations or dense PDFs).
                            </p>
                        </div>
                    </div>
                    <a
                        href={playerData.lectureUrl}
                        download
                        target="_parent"
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold py-2.5 px-6 rounded-xl inline-flex items-center justify-center gap-2.5 transition-all shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 cursor-pointer"
                    >
                        <DownloadCloud size={19} strokeWidth={2.5} />
                        Download Document
                    </a>
                </div>
            </div>
        );
    }

    return null;
};

export default DocViewer;
