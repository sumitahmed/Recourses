import fs from 'fs';
const pdfParse = require('pdf-parse');

async function readPDF() {
    const filePath = 'C:\\Users\\sksum\\OneDrive\\Documents\\Placement Prep\\Recourses\\backend_dev_checklist.pdf';
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    console.log(data.text); 
}
readPDF();
