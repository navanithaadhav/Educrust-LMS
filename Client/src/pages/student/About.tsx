import { assets } from "../../assets/assets"


const About = () => {
    return (
        <div className='md:px-8 lg:px-14 px-8 py-10 w-full min-h-screen '>

            {/* Header Section */}
            <div className='flex flex-col md:flex-row items-center gap-10 mb-20'>
                <div className='flex-1'>
                    <h1 className='text-4xl font-bold text-gray-800 mb-4'>About <span className='text-blue-600'>EduCrest</span></h1>
                    <p className='text-gray-600 text-lg leading-relaxed mb-6'>
                        EduCrest is a premier online/offline learning platform dedicated to democratizing education.
                        We believe that quality education should be accessible to everyone, everywhere.
                        Our mission is to bridge the gap between learners and experts, providing a seamless,
                        interactive, and engaging learning experience.
                    </p>
                    <div className='flex gap-10'>
                        <div className='text-center'>
                            <h3 className='text-3xl font-bold text-gray-800'>10k+</h3>
                            <p className='text-gray-500'>Students</p>
                        </div>
                        <div className='text-center'>
                            <h3 className='text-3xl font-bold text-gray-800'>500+</h3>
                            <p className='text-gray-500'>Courses</p>
                        </div>
                        <div className='text-center'>
                            <h3 className='text-3xl font-bold text-gray-800'>100+</h3>
                            <p className='text-gray-500'>Instructors</p>
                        </div>
                    </div>
                </div>
                <div className='flex-1 relative'>
                    <img src={assets.about_img} className='w-full rounded-xl shadow-lg z-10 relative' alt="About Us" loading="lazy" decoding="async" width="512" height="341" />
                    <div className='absolute -bottom-5 -right-5 w-full h-full border-4 border-blue-600 rounded-xl -z-0 hidden md:block'></div>
                </div>
            </div>

            {/* Vision Section */}
            <div className='mb-24 text-center max-w-3xl mx-auto'>
                <h2 className='text-3xl font-bold text-gray-800 mb-6'>Our Vision</h2>
                <p className='text-gray-600 text-lg'>
                    To empower individuals to unlock their full potential through lifelong learning.
                    We envision a world where knowledge is shared freely and barriers to education are dismantled.
                </p>
            </div>

            {/* Why Choose Us */}
            <div className='mb-24'>
                <h2 className='text-3xl font-bold text-gray-800 mb-10 text-center'>Why Choose EduCrest?</h2>
                <div className='grid md:grid-cols-3 gap-8'>
                    <div className='bg-slate-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100'>
                        <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                        </div>
                        <h3 className='text-xl font-semibold mb-2'>Expert Instructors</h3>
                        <p className='text-gray-600'>Learn from industry experts and experienced educators who are passionate about teaching.</p>
                    </div>
                    <div className='bg-slate-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100'>
                        <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4'>
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h3 className='text-xl font-semibold mb-2'>Flexible Learning</h3>
                        <p className='text-gray-600'>Study at your own pace, anytime, anywhere. Our platform fits your schedule.</p>
                    </div>
                    <div className='bg-slate-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100'>
                        <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4'>
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <h3 className='text-xl font-semibold mb-2'>Interactive Content</h3>
                        <p className='text-gray-600'>Engage with quizzes, assignments, and community discussions to reinforce your learning.</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default About
