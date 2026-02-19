export interface FunctionRating {
    rating: number;
}

export interface Lecture {
    lectureId?: string;
    lectureTitle: string;
    lectureDuration: number | string;
    lectureUrl: string;
    isPreviewFree: boolean;
    lectureOrder?: number;
    notes?: string;
    lectureContent?: string;
    resourceType?: 'video' | 'pdf' | 'ppt' | 'html-file' | 'quiz'; // Add this line
    questions?: {
        questionId: string;
        question: string;
        options: string[];
        correctAnswer: string;
    }[];
    fileSize?: number; // Add this line
}

export interface Chapter {
    chapterId: string;
    chapterOrder: number;
    chapterTitle: string;
    chapterContent: Lecture[];
}

export interface Course {
    _id: string;
    courseTitle: string;
    courseDescription: string;
    coursePrice: number;
    isPublished: boolean;
    courseCategory?: string;
    discount: number;
    courseContent: Chapter[];
    courseThumbnail: string;
    courseRatings: FunctionRating[];
    educator: string;
    enrolledStudents?: UserData[];
    createdAt: string | Date;
}

export interface Testimonial {
    name: string;
    role: string;
    image: string;
    rating: number;
    feedback: string;
}

export interface UserData {
    _id?: string;
    name?: string;
    email?: string;
    imageUrl?: string;
    role?: string;
    enrolledCourses?: Course[];
    isAccountVerified?: boolean;
}
