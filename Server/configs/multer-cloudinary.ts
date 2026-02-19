import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Ensure cloudinary is configured (it should be called in server startup, but reinforcing here or importing established instance)
// Importing from our config which exports the configured instance (or just re-config here safely)
import { cloudinary as cloudinaryInstance } from './cloudinary.js';

const storage = new CloudinaryStorage({
    cloudinary: cloudinaryInstance,
    params: async (req, file) => {
        const { courseId } = req.body;
        // Determine resource type based on mime type
        let resourceType = 'auto';
        if (file.mimetype.startsWith('image/')) {
            resourceType = 'image';
        } else if (file.mimetype.startsWith('video/')) {
            resourceType = 'video';
        } else {
            resourceType = 'raw';
        }

        const validResourceTypes = ['image', 'video', 'raw', 'auto'];
        if (!validResourceTypes.includes(resourceType)) {
            resourceType = 'raw';
        }

        return {
            folder: `course-platform/${courseId ? courseId : 'temp'}/lectures`,
            resource_type: resourceType,
        };
    },
});

const uploadCloudinary = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

export default uploadCloudinary;
