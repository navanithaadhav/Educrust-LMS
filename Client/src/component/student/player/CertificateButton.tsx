import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Certificate from '../Certificate';

import { Course, UserData } from '../../../types';
import { X, Download, Award } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

interface CertificateButtonProps {
    courseData: Course | null;
    userData: UserData | null;
    isCourseCompleted: boolean;
}

const CertificateButton: React.FC<CertificateButtonProps> = ({
    courseData,
    userData,
    isCourseCompleted
}) => {

    const [showModal, setShowModal] = useState(false);
    const [certificateStatus, setCertificateStatus] = useState<'none' | 'requested' | 'approved' | 'downloaded'>('none');
    const { requestCertificate, markCertificateDownloaded, getCourseProgress } = useAppContext();

    useEffect(() => {
        const fetchProgress = async () => {
            if (isCourseCompleted && courseData) {
                const progress = await getCourseProgress(courseData._id);
                if (progress && progress.certificateStatus) {
                    setCertificateStatus(progress.certificateStatus);
                }
            }
        };
        fetchProgress();
    }, [isCourseCompleted, courseData, showModal]);

    const handleRequestCertificate = async () => {
        if (!courseData) return;
        const success = await requestCertificate(courseData._id);
        if (success) {
            setCertificateStatus('requested');
        }
    };

    const handleDownloadCertificate = async () => {
        if (certificateStatus === 'downloaded') {
            toast.error("You have already downloaded this certificate.");
            return;
        }

        try {
            const element = document.getElementById("real-certificate");

            if (!element) {
                toast.error("Certificate not found");
                return;
            }

            await document.fonts.ready; // wait fonts

            const canvas = await html2canvas(element, {
                scale: 3,
                useCORS: true,
                backgroundColor: "#0a192f",
                logging: false
            });

            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "px",
                format: [1000, 700]
            });

            pdf.addImage(imgData, "PNG", 0, 0, 1000, 700);
            pdf.save("certificate.pdf");

            // Mark as downloaded in the backend
            if (courseData) {
                const success = await markCertificateDownloaded(courseData._id);
                if (success) {
                    setCertificateStatus('downloaded');
                }
            }

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            {isCourseCompleted && (
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-amber-700 transition-all shadow-md font-medium text-sm"
                >
                    <Award size={16} />
                    View Cert.
                </button>
            )}

            {showModal && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[99999] p-4">
                    <div className="bg-white rounded-2xl w-full max-w-6xl shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh]">

                        {/* Header */}
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                                    <Award size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Your Certificate
                                    </h2>
                                    <p className="text-xs text-gray-500">
                                        Congratulations on completing the course!
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {certificateStatus === 'none' && (
                                    <button
                                        onClick={handleRequestCertificate}
                                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                                    >
                                        <Award size={16} />
                                        Request Certificate
                                    </button>
                                )}

                                {certificateStatus === 'requested' && (
                                    <button
                                        disabled
                                        className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed font-medium text-sm"
                                    >
                                        Requested
                                    </button>
                                )}

                                {certificateStatus === 'approved' && (
                                    <button
                                        onClick={handleDownloadCertificate}
                                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium text-sm"
                                    >
                                        <Download size={16} />
                                        Download
                                    </button>
                                )}

                                {certificateStatus === 'downloaded' && (
                                    <button
                                        disabled
                                        className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed font-medium text-sm"
                                    >
                                        Downloaded
                                    </button>
                                )}

                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-full transition"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Certificate Preview */}
                        <div className="flex-1 overflow-auto p-6 bg-gray-100 flex items-center justify-center">

                            <Certificate
                                studentName={userData?.name || "Student Name"}
                                courseName={courseData?.courseTitle || "Course Title"}
                                date={new Date().toLocaleDateString()}
                                dataRef={null as any} // no longer needed
                            />

                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-100 text-center bg-gray-50">
                            <p className="text-sm text-gray-500">
                                Certificate of Completion provided by Educrust LMS
                            </p>
                        </div>

                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default CertificateButton;