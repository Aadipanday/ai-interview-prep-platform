import multer from "multer"


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024, // 3 MB max
        files: 1
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "application/pdf") {
            return cb(new Error("Only PDF files are allowed!"), false);
        }
        cb(null, true);
    }
});

export default upload