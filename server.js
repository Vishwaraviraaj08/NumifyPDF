// server.js

const express = require('express');
const next = require('next');
const multer = require('multer');
const { PDFDocument, rgb } = require('pdf-lib');
const cors = require('cors');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();
server.use(cors());
server.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

server.post('/api/addPageNumbers', upload.single('pdf'), async (req, res) => {
    try {
        const pdfBuffer = req.file.buffer;
        const startPage = parseInt(req.body.startPage) || 1;
        const arr = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];
        const pdfDoc = await PDFDocument.load(pdfBuffer);

        for (let i = 2; i < startPage - 1; i++) {
            const page = pdfDoc.getPage(i);
            const pageNumberText = arr[i - 2];
            const { width, height } = page.getSize();
            const fontSize = 12;

            page.drawText(pageNumberText, {
                x: width / 2,
                y: 25,
                size: fontSize,
                color: rgb(0, 0, 0),
            });
        }

        for (let i = 0; i < pdfDoc.getPageCount() - startPage + 1; i++) {
            const page = pdfDoc.getPage(i + startPage - 1);
            const pageNumberText = `${i + 1}`;
            const { width, height } = page.getSize();
            const fontSize = 12;

            page.drawText(pageNumberText, {
                x: width / 2,
                y: 25,
                size: fontSize,
                color: rgb(0, 0, 0),
            });
        }

        const modifiedPdfBytes = await pdfDoc.save();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=output.pdf');
        res.send(Buffer.from(modifiedPdfBytes));
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Error adding page numbers to PDF.');
    }
});

app.prepare().then(() => {
    server.all('*', (req, res) => handle(req, res));

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
    });
});
