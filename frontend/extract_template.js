const XLSX = require('xlsx');
const fs = require('fs');

const filePath = 'C:\\Users\\Tutucu\\Downloads\\excelyolcusablon5 (1) (1).xlsx';
if (!fs.existsSync(filePath)) {
    console.error("File not found!");
    process.exit(1);
}

const workbook = XLSX.readFile(filePath);

const cinsiyetSheet = workbook.Sheets['CİNSİYET'];
const cinsiyetData = XLSX.utils.sheet_to_json(cinsiyetSheet, { header: 1 });

const ulkeSheet = workbook.Sheets['ÜLKE KODLARI'];
const ulkeData = XLSX.utils.sheet_to_json(ulkeSheet, { header: 1 });

const tsContent = `// Automatically extracted from U-ETDS template

export const cinsiyetData = ${JSON.stringify(cinsiyetData, null, 2)};

export const ulkeKodlariData = ${JSON.stringify(ulkeData, null, 2)};
`;

fs.writeFileSync('utils/excelTemplateData.ts', tsContent);
console.log("Successfully extracted data to utils/excelTemplateData.ts");
