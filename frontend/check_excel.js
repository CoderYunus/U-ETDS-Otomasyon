const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = 'C:\\Users\\Tutucu\\Downloads\\excelyolcusablon5 (1) (1).xlsx';
if (!fs.existsSync(filePath)) {
    console.log("File not found!");
    process.exit(1);
}

const workbook = XLSX.readFile(filePath);
console.log("Sheet names:");
console.log(workbook.SheetNames);

const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

console.log("\nHeaders (Row 1):");
if (data.length > 0) {
    console.log(JSON.stringify(data[0]));
}

console.log("\nRow 2:");
if (data.length > 1) {
    console.log(JSON.stringify(data[1]));
}
