import express from "express";
import {authenticate} from "../middleware/auth";
import path from "path";
import fs from "node:fs";

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new Error("User not found");
    }
    if (req.files == null) {
        res.status(400).send("Files is null");
        return
    }

    if (!req.files.upload) {
        res.status(400).send("No file uploaded");
        return
    }

    if (Array.isArray(req.files.upload)) {
        res.status(400).send("Only one file can be uploaded");
        return
    }

    const upload = req.files.upload;
    const uploadFolder = path.join(__dirname, "../../images/", user.id)

    // Check if the folder exists, if not, create it
    if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, {recursive: true});
    }

    const extension = path.extname(upload.name);
    const uploadPath = `${uploadFolder}/${Date.now().toString()}${extension}`;
    const url = `/images/${user.id}/${path.basename(uploadPath)}`;

    upload.mv(uploadPath, (err) => {
        if (err) {
            res.status(500).send(err);
            return
        }

        res.status(200).json({url: url})
    })

});

router.get('/:filename', authenticate, (req, res) => {
    const user = req.user;
    if (!user) {
        throw new Error("User not found");
    }
    const uploadFolder = path.join(__dirname, "../../images/", user.id)
    const fileName = req.params.filename;
    const filePath = path.join(uploadFolder, fileName);

    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).json({
                status: 404,
                success: false,
                message: 'File not found',
            });
        }
    });
});

export default router;