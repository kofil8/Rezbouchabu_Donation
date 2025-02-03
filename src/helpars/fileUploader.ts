import multer from "multer";
import path from "path";
// import prisma from '../shared/prisma';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, path.join( "/var/www/uploads"));
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: async function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadprofileImage = upload.single("profileImage");
const uploadDonationImages = upload.fields([
  { name: "donationImages", maxCount: 10 },
]);
const uploadPostImage = upload.single("postImage");

export const fileUploader = {
  upload,
  uploadDonationImages,
  uploadprofileImage,
  uploadPostImage,
};
