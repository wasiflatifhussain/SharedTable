import express from "express";
import multer from "multer";
import { jwtCheck, jwtParse } from "../middleware/auth";
import MyAdvertisementController from "../controllers/MyAdvertisementController";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024, // Limit file size to 20MB
    },
});

// Route to create a new advertisement
router.post("/add-advertisements",
    upload.single("imageFile"), 
    jwtCheck,
    jwtParse,
    MyAdvertisementController.createAdvertisement
);

export default router;
