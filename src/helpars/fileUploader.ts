import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: async function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const storageDonation = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads/donations"));
  },
  filename: async function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const storageWaste = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads/antiWaste"));
  },
  filename: async function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const profileDonation = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads/profile"));
  },
  filename: async function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
const uploadDonation = multer({ storage: storageDonation });
const uploadWaste = multer({ storage: storageWaste });
const uploadprofile = multer({ storage: profileDonation });

const uploadprofileImage = uploadprofile.single("profileImage");
const uploadDonationImages = uploadDonation.fields([
  { name: "donationImages", maxCount: 10 },
]);

const uploadWasteImages = uploadWaste.fields([
  { name: "antiWasteImages", maxCount: 10 },
]);
const uploadPostImage = upload.single("postImage");

export const fileUploader = {
  upload,
  uploadDonationImages,
  uploadWasteImages,
  uploadprofileImage,
  uploadPostImage,
};
