import { NextResponse } from 'next/server';

// Fallback-Daten (27 Positionen)
const fallbackData = [
  { Pos: 1, Beschreibung: 'Grundstück', Total: 2200000, Wetli: 594000, Graf: 594000, Bürzle: 1012000 },
  { Pos: 2, Beschreibung: 'Baukosten Gebäude', Total: 3450000, Wetli: 930600, Graf: 930600, Bürzle: 1588800 },
  { Pos: 3, Beschreibung: 'Erschliessung', Total: 180000, Wetli: 48600, Graf: 48600, Bürzle: 82800 },
  { Pos: 4, Beschreibung: 'Umgebungsgestaltung', Total: 95000, Wetli: 25650, Graf: 25650, Bürzle: 43700 },
  { Pos: 5, Beschreibung: 'Parkplätze', Total: 180000, Wetli: 48600, Graf: 48600, Bürzle: 82800 },
  { Pos: 6, Beschreibung: 'Tiefgarage', Total: 240000, Wetli: 64800, Graf: 64800, Bürzle: 110400 },
  { Pos: 7, Beschreibung: 'Aufzug', Total: 85000, Wetli: 0, Graf: 0, Bürzle: 85000 },
  { Pos: 8, Beschreibung: 'Heizung/Wärmepumpe', Total: 65000, Wetli: 17550, Graf: 17550, Bürzle: 29900 },
  { Pos: 9, Beschreibung: 'Sanitär', Total: 120000, Wetli: 32400, Graf: 32400, Bürzle: 55200 },
  { Pos: 10, Beschreibung: 'Elektrizität', Total: 95000, Wetli: 25650, Graf: 25650, Bürzle: 43700 },
  { Pos: 11, Beschreibung: 'Innenausbau Wetli', Total: 280000, Wetli: 280000, Graf: 0, Bürzle: 0 },
  { Pos: 12, Beschreibung: 'Innenausbau Graf', Total: 280000, Wetli: 0, Graf: 280000, Bürzle: 0 },
  { Pos: 13, Beschreibung: 'Innenausbau Bürzle', Total: 350000, Wetli: 0, Graf: 0, Bürzle: 350000 },
  { Pos: 14, Beschreibung: 'Sauna', Total: 32000, Wetli: 0, Graf: 0, Bürzle: 32000 },
  { Pos: 15, Beschreibung: 'Cheminee', Total: 74167, Wetli: 22927, Graf: 31240, Bürzle: 20000 },
  { Pos: 16, Beschreibung: 'Dachbegrünung', Total: 45000, Wetli: 12150, Graf: 12150, Bürzle: 20700 },
  { Pos: 17, Beschreibung: 'Fassade', Total: 125000, Wetli: 33750, Graf: 33750, Bürzle: 57500 },
  { Pos: 18, Beschreibung: 'Fenster', Total: 180000, Wetli: 48600, Graf: 48600, Bürzle: 82800 },
  { Pos: 19, Beschreibung: 'Türen', Total: 65000, Wetli: 17550, Graf: 17550, Bürzle: 29900 },
  { Pos: 20, Beschreibung: 'Böden', Total: 110000, Wetli: 29700, Graf: 29700, Bürzle: 50600 },
  { Pos: 21, Beschreibung: 'Decke', Total: 85000, Wetli: 22950, Graf: 22950, Bürzle: 39100 },
  { Pos: 22, Beschreibung: 'Küchenausstattung', Total: 45000, Wetli: 12150, Graf: 12150, Bürzle: 20700 },
  { Pos: 23, Beschreibung: 'Beleuchtung', Total: 30000, Wetli: 8100, Graf: 8100, Bürzle: 13800 },
  { Pos: 24, Beschreibung: 'Sicherheit/Brandschutz', Total: 40000, Wetli: 10800, Graf: 10800, Bürzle: 18400 },
  { Pos: 25, Beschreibung: 'Maklergebühren', Total: 196988, Wetli: 53167, Graf: 53167, Bürzle: 90654 },
  { Pos: 26, Beschreibung: 'Notargebühren', Total: 35000, Wetli: 9450, Graf: 9450, Bürzle: 16100 },
  { Pos: 27, Beschreibung: 'Versicherung/Verwaltung', Total: 15000, Wetli: 4050, Graf: 4050, Bürzle: 6900 },
];

export async function GET() {
  try {
    // Versuche Excel-Datei zu laden (für lokale Umgebung)
    if (process.env.NODE_ENV === 'development') {
      try {
        const XLSX = await import('xlsx');
        const path = await import('path');
        const fs = await import('fs');
        
        const possiblePaths = [
          path.default.join(process.cwd(), 'public', 'Kalkulation_Basis_KV_Progonse.xlsx'),
          path.default.join(process.cwd(), 'Kalkulation_Basis_KV_Progonse.xlsx'),
          path.default.join(process.cwd(), '..', 'Kalkulation_Basis_KV_Progonse.xlsx'),
        ];

        for (const p of possiblePaths) {
          if (fs.default.existsSync(p)) {
            const fileBuffer = fs.default.readFileSync(p);
            const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
            console.log('Excel-Datei geladen von:', p);
            return NextResponse.json(data);
          }
        }
      } catch (excelError) {
        console.log('Excel-Datei nicht verfügbar, verwende Fallback-Daten');
      }
    }

    // Verwende Fallback-Daten (für Vercel und wenn Excel nicht verfügbar)
    console.log('Verwende Fallback-Daten (27 Positionen)');
    return NextResponse.json(fallbackData);
  } catch (error) {
    console.error('Fehler in API:', error);
    // Gib im Fehlerfall trotzdem Fallback-Daten zurück
    return NextResponse.json(fallbackData);
  }
}
