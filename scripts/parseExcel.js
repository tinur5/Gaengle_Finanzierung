const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Excel-Datei lesen
const excelFile = path.join(__dirname, '../public/Kalkulation_Basis_KV_Progonse.xlsx');
const workbook = XLSX.readFile(excelFile);

// Alle Sheets ausgeben
console.log('Available sheets:', workbook.SheetNames);

// Erste Sheet lesen
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log('Data preview (first 20 rows):');
console.log(JSON.stringify(data.slice(0, 20), null, 2));

// Ausgabe als JSON-Datei speichern
const outputPath = path.join(__dirname, '../lib/financingData.json');
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
console.log(`✓ Data exported to ${outputPath}`);
