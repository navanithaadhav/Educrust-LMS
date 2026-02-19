
import React from 'react';
import { assets } from '../../assets/assets';

interface CertificateProps {
    studentName: string;
    courseName: string;
    date: string;
    signature?: string;
    dataRef: React.RefObject<HTMLDivElement>;
}

const Certificate: React.FC<CertificateProps> = ({ studentName, courseName, date, dataRef }) => {
    return (
        <div
            ref={dataRef}
            className="mx-auto shadow-2xl"
            style={{
                width: '1000px',
                height: '700px',
                backgroundColor: '#0a192f', // Deep Navy Blue
                color: 'white',
                fontFamily: "'Outfit', sans-serif",
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '48px'
            }}
        >

            {/* Background Gradients (Simulating the glow) */}
            <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '500px', height: '500px', backgroundColor: '#d946ef', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.2, pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '500px', height: '500px', backgroundColor: '#3b82f6', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.2, pointerEvents: 'none' }}></div>

            {/* Header / Logo area */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={assets.logo_black} alt="Logo" style={{ height: '48px', filter: 'invert(1) brightness(100)' }} />
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', letterSpacing: '0.05em', fontFamily: "'Outfit', sans-serif" }}>Educrust</span>
                </div>
            </div>

            {/* Main Title Content */}
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', zIndex: 10 }}>
                <h1 style={{ fontSize: '72px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', color: '#ffffff', lineHeight: 1 }}>Certificate</h1>
                <p style={{ fontSize: '18px', letterSpacing: '0.3em', fontWeight: '300', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '48px' }}>of Achievement</p>

                <p style={{ fontSize: '14px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '24px' }}>This is to acknowledge that</p>

                {/* Student Name with Gradient Pill */}
                <div style={{ position: 'relative', marginBottom: '32px', display: 'inline-block' }}>
                    {/* Gradient Background */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to right, #d946ef, #4f46e5)',
                        borderRadius: '9999px', filter: 'blur(10px)', opacity: 0.75
                    }}></div>

                    {/* Name Container */}
                    <div style={{
                        position: 'relative',
                        background: 'linear-gradient(to right, #c026d3, #4338ca)',
                        padding: '16px 60px',
                        borderRadius: '9999px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                    }}>
                        <h2 style={{ fontSize: '30px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'white', margin: 0, whiteSpace: 'nowrap' }}>{studentName}</h2>
                    </div>
                </div>

                <p style={{ color: '#e5e7eb', marginBottom: '8px', fontSize: '16px' }}>has successfully completed the</p>
                <h3 style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffffff', marginBottom: '16px', maxWidth: '800px', lineHeight: 1.3 }}>"{courseName}"</h3>
                <p style={{ color: '#9ca3af', marginTop: '16px', fontSize: '14px', lineHeight: 1.6 }}>
                    presented by Educrust LMS
                    <br />
                    on {date}
                </p>
            </div>

            {/* Footer / Signatures */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 10, paddingLeft: '40px', paddingRight: '40px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '200px', borderTop: '1px solid #6b7280', marginBottom: '8px' }}></div>
                    <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#e5e7eb', margin: 0 }}>Lena Ray Morales</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Head of Department</p>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '0' }}>
                    <div style={{ width: '64px', height: '64px', backgroundColor: '#fbbf24', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#78350f', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" style={{ width: '32px', height: '32px' }}>
                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                    </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '200px', borderTop: '1px solid #6b7280', marginBottom: '8px' }}></div>
                    <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#e5e7eb', margin: 0 }}>Taylor Wood</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Company CEO</p>
                </div>
            </div>
        </div>
    );
};

export default Certificate;
