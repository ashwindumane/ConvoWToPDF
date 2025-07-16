const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure upload storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only Word documents (.doc, .docx) are allowed!'));
    }
  }
});


const convertToPDF = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    exec(`libreoffice --headless --convert-to pdf --outdir ${path.dirname(outputPath)} ${inputPath}`, 
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Conversion error: ${error}`);
          reject(new Error('Failed to convert document'));
        } else {
          console.log(`Conversion successful: ${stdout}`);
          resolve(outputPath);
        }
      }
    );
  });
};

app.post("/convertFile", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const inputPath = req.file.path;
    const outputPath = path.join(
      path.dirname(inputPath),
      `${path.basename(inputPath, path.extname(inputPath))}.pdf`
    );

    await convertToPDF(inputPath, outputPath);

    if (!fs.existsSync(outputPath)) {
      throw new Error('Conversion failed - no output file produced');
    }

    res.download(outputPath, (err) => {
      if (err) {
        console.error('Download error:', err);
      }
      // Clean up files
      fs.unlink(inputPath, () => {});
      fs.unlink(outputPath, () => {});
    });

  } catch (error) {
    console.error("Conversion error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error converting file to PDF",
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});