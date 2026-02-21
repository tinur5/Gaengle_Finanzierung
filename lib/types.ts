// Strukturierte Daten für die 3 Parteien
export interface Party {
  name: string;
  area: number; // m²
  share: number; // Prozentanteil
  color: string;
}

export interface CostItem {
  position: number;
  description: string;
  total: number;
  wetli: number;
  graf: number;
  burzle: number;
}

export interface FinancingData {
  parties: Party[];
  costs: CostItem[];
  totalCost: number;
}

// Parteien definieren
export const parties: Party[] = [
  {
    name: 'Wetli',
    area: 165,
    share: 0.2714,
    color: '#3b82f6', // Blue
  },
  {
    name: 'Graf',
    area: 165,
    share: 0.2714,
    color: '#10b981', // Green
  },
  {
    name: 'Bürzle',
    area: 278,
    share: 0.4572,
    color: '#f59e0b', // Amber
  },
];

// Beispiel-Kosten für Visualisierung
export const costCategories = [
  'Grundstück',
  'Vorbereitung',
  'Rohbau',
  'Elektro',
  'Heizung',
  'Sanitär',
  'Ausbauten',
  'Sonstiges',
];
