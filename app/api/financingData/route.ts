import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
  try {
    const excelPath = path.join(process.cwd(), '..', 'Kalkulation_Basis_KV_Progonse.xlsx');
    
    // Excel-Datei lesen
    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Fehler beim Laden der Excel-Datei:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Daten' },
      { status: 500 }
    );
  }
}
