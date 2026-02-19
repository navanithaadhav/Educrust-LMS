import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'react-toastify';
import Certificate from '../Certificate';
import { Course, UserData } from '../../../types';

interface CertificateButtonProps {
    courseData: Course | null;
    userData: UserData | null;
    isCourseCompleted: boolean;
}

const CertificateButton: React.FC<CertificateButtonProps> = ({ courseData, userData, isCourseCompleted }) => {
    const certificateRef = useRef<HTMLDivElement>(null);

    const downloadCertificate = async () => {
        try {
            const input = certificateRef.current;
            if (input) {
                const canvas = await html2canvas(input, {
                    useCORS: true,
                    logging: true,
                    scale: 2,
                } as any);
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape, mm, A4
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();

                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`certificate_${courseData?.courseTitle || 'completion'}.pdf`);
                toast.success("Certificate downloaded successfully!");
            } else {
                toast.error("Certificate generation failed: Element not found.");
            }
        } catch (error) {
            console.error("Certificate generation error:", error);
            toast.error(`Failed to generate certificate: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    return (
        <>
            {isCourseCompleted && (
                <button onClick={downloadCertificate} className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition">
                    Cert.
                </button>
            )}

            {/* Hidden Certificate Component for Rendering */}
            <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', width: '1000px', height: '700px', overflow: 'hidden' }}>
                <Certificate
                    dataRef={certificateRef as React.RefObject<HTMLDivElement>}
                    studentName={userData?.name || "Student Name"}
                    courseName={courseData?.courseTitle || "Course Title"}
                    date={new Date().toLocaleDateString()}
                />
            </div>
        </>
    );
};

export default CertificateButton;
