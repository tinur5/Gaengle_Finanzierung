import { NextResponse } from 'next/server';

// Fallback-Daten mit exakten Werten aus der Kalkulation
const fallbackData = [
  { Pos: 0, Beschreibung: 'Grundstück', Total: 17150, Wetli: 4654.194079, Graf: 4654.194079, Bürzle: 7841.611842 },
  { Pos: 1, Beschreibung: 'Vorbereitung', Total: 27969, Wetli: 7590.271382, Graf: 7590.271382, Bürzle: 12788.45724 },
  { Pos: 21, Beschreibung: 'Rohbau 1', Total: 1654000, Wetli: 448865.1316, Graf: 448865.1316, Bürzle: 756269.7368 },
  { Pos: 22, Beschreibung: 'Rohbau 2', Total: 623826, Wetli: 169294.8849, Graf: 169294.8849, Bürzle: 285236.2303 },
  { Pos: 23, Beschreibung: 'Elektro', Total: 251021, Wetli: 68122.47533, Graf: 68122.47533, Bürzle: 114776.0493 },
  { Pos: 24, Beschreibung: 'Heizung', Total: 96000, Wetli: 26052.63158, Graf: 26052.63158, Bürzle: 43894.73684 },
  { Pos: 25, Beschreibung: 'Sanitäranlagen', Total: 254876, Wetli: 69168.65132, Graf: 69168.65132, Bürzle: 116538.6974 },
  { Pos: 254, Beschreibung: 'Pool', Total: 90000, Wetli: 24424.34211, Graf: 24424.34211, Bürzle: 41151.31579 },
  { Pos: 258, Beschreibung: 'Küche', Total: 196415, Wetli: 45565, Graf: 45897, Bürzle: 104953 },
  { Pos: 259, Beschreibung: 'Sauna', Total: 56800, Wetli: 0, Graf: 0, Bürzle: 56800 },
  { Pos: 26, Beschreibung: 'Lift', Total: 37608, Wetli: 0, Graf: 0, Bürzle: 37608 },
  { Pos: 271, Beschreibung: 'Gipser', Total: 150000, Wetli: 40707.23684, Graf: 40707.23684, Bürzle: 68585.52632 },
  { Pos: 272, Beschreibung: 'Metallbau', Total: 44085, Wetli: 11963.85691, Graf: 11963.85691, Bürzle: 20157.28618 },
  { Pos: 2731, Beschreibung: 'Allg. Schreinerarbeiten', Total: 34317, Wetli: 23269, Graf: 1048, Bürzle: 10000 },
  { Pos: 2733, Beschreibung: 'Diverse Ausbauten', Total: 73490, Wetli: 21508, Graf: 36982, Bürzle: 15000 },
  { Pos: 275, Beschreibung: 'Schliessanlage', Total: 6000, Wetli: 1628.289474, Graf: 1628.289474, Bürzle: 2743.421053 },
  { Pos: 2810, Beschreibung: 'UB', Total: 56539, Wetli: 15343.64309, Graf: 15343.64309, Bürzle: 25851.71382 },
  { Pos: 2812, Beschreibung: 'Bodenbeläge', Total: 67968, Wetli: 15000, Graf: 18968, Bürzle: 34000 },
  { Pos: 2816, Beschreibung: 'Boden Treppe', Total: 36000, Wetli: 9769.736842, Graf: 9769.736842, Bürzle: 16460.52632 },
  { Pos: 2824, Beschreibung: 'Wand Platten', Total: 26000, Wetli: 8000, Graf: 8000, Bürzle: 10000 },
  { Pos: 284, Beschreibung: 'Cheminee', Total: 74167, Wetli: 22927, Graf: 31240, Bürzle: 20000 },
  { Pos: 2851, Beschreibung: 'Maler', Total: 60000, Wetli: 16282.89474, Graf: 16282.89474, Bürzle: 27434.21053 },
  { Pos: 287, Beschreibung: 'Baureinigung', Total: 15000, Wetli: 4070.723684, Graf: 4070.723684, Bürzle: 6858.552632 },
  { Pos: 29, Beschreibung: 'Honorare', Total: 733965, Wetli: 199184.5806, Graf: 199184.5806, Bürzle: 335595.8388 },
  { Pos: 4, Beschreibung: 'Umgebung', Total: 151036, Wetli: 40988.38816, Graf: 40988.38816, Bürzle: 69059.22368 },
  { Pos: 5, Beschreibung: 'Baunebenkosten', Total: 232000, Wetli: 62960.52632, Graf: 62960.52632, Bürzle: 106078.9474 },
  { Pos: 99, Beschreibung: 'Boden', Total: 1500000, Wetli: 407072.3684, Graf: 407072.3684, Bürzle: 685855.2632 },
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
