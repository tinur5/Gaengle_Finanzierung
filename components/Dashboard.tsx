'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface CostItem {
  Pos: number;
  Beschreibung: string;
  Total: number;
  Wetli: number;
  Graf: number;
  Bürzle: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

const Dashboard = () => {
  const [costPositions, setCostPositions] = useState<CostItem[]>([]);
  const [kaufpreis, setKaufpreis] = useState(6566232);
  const [eigenkapital, setEigenkapital] = useState(2500000);
  const [zinssatz, setZinssatz] = useState(1.5);
  const [amortisationJahre, setAmortisationJahre] = useState(25);
  
  // Nebenkosten pro Partei (monatlich)
  const [nebenKostenWetli, setNebenKostenWetli] = useState(150);
  const [nebenKostenGraf, setNebenKostenGraf] = useState(150);
  const [nebenKostenBürzle, setNebenKostenBürzle] = useState(200);

  // Lade Daten beim Mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/financingData');
        const data = await response.json();
        
        if (Array.isArray(data)) {
          // Transformiere die Daten
          const transformed = data.map((item: any, idx: number) => ({
            Pos: item.Pos || idx + 1,
            Beschreibung: item.Beschreibung || item.description || 'Position ' + (idx + 1),
            Total: parseFloat(item.Total || item.total || 0),
            Wetli: parseFloat(item.Wetli || item.wetli || 0),
            Graf: parseFloat(item.Graf || item.graf || 0),
            Bürzle: parseFloat(item.Bürzle || item.burzle || item.bürzle || 0),
          }));
          
          setCostPositions(transformed);
        } else {
          console.error('Ungültige Datenformat:', data);
          setCostPositions([]);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Finanzierungsdaten:', error);
        setCostPositions([]);
      }
    };

    loadData();
  }, []);

  // Berechne Totals pro Partei
  const totalWetli = costPositions.reduce((sum, item) => sum + item.Wetli, 0);
  const totalGraf = costPositions.reduce((sum, item) => sum + item.Graf, 0);
  const totalBürzle = costPositions.reduce((sum, item) => sum + item.Bürzle, 0);
  const totalCost = kaufpreis;

  // Hypothek berechnen
  const hypoCHF = kaufpreis - eigenkapital;
  const monatlicheHypothek = hypoCHF > 0 ? (hypoCHF / amortisationJahre) / 12 + (hypoCHF * (zinssatz / 100)) / 12 : 0;

  // Monatliche Kosten pro Partei
  const monatlichWetli = (monatlicheHypothek * (totalWetli / totalCost)) + nebenKostenWetli;
  const monatlichGraf = (monatlicheHypothek * (totalGraf / totalCost)) + nebenKostenGraf;
  const monatlichBürzle = (monatlicheHypothek * (totalBürzle / totalCost)) + nebenKostenBürzle;

  // 50-Jahres-Prognose generieren
  const generateCostForecast = () => {
    const data = [];
    const jaehrlicheAmortisation = hypoCHF > 0 ? hypoCHF / amortisationJahre : 0;
    
    for (let jahr = 0; jahr <= 50; jahr++) {
      // Nach 'amortisationJahre' Jahren ist die Hypothek abbezahlt
      const restHypothek = jahr >= amortisationJahre ? 0 : Math.max(0, hypoCHF - jaehrlicheAmortisation * jahr);
      const zinsJahr = restHypothek * (zinssatz / 100);
      const amortisationJahr = jahr >= amortisationJahre ? 0 : jaehrlicheAmortisation;
      const hypothekJahr = zinsJahr + amortisationJahr;
      
      const monatlichWetliJahr = (hypothekJahr / 12 * (totalWetli / totalCost)) + nebenKostenWetli;
      const monatlichGrafJahr = (hypothekJahr / 12 * (totalGraf / totalCost)) + nebenKostenGraf;
      const monatlichBürzleJahr = (hypothekJahr / 12 * (totalBürzle / totalCost)) + nebenKostenBürzle;
      
      data.push({
        jahr,
        wetli: Math.round(monatlichWetliJahr * 100) / 100,
        graf: Math.round(monatlichGrafJahr * 100) / 100,
        bürzle: Math.round(monatlichBürzleJahr * 100) / 100,
        total: Math.round((monatlichWetliJahr + monatlichGrafJahr + monatlichBürzleJahr) * 100) / 100,
      });
    }
    return data;
  };

  const costForecast = generateCostForecast();

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const pieData = [
    { name: 'Wetli', value: totalWetli },
    { name: 'Graf', value: totalGraf },
    { name: 'Bürzle', value: totalBürzle },
  ];

  if (costPositions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-900 mb-4">Laden der Daten...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Titel */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gängle Finanzierung</h1>
          <p className="text-gray-900">Finanzierungsrechner für 3er-Stockwerkeigentum</p>
        </div>

        {/* SECTION 1: Immobilienwert-Übersicht */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12 border-2 border-gray-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Immobilienwert-Übersicht</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="bg-blue-50 rounded-lg p-4 mb-4 border-2 border-blue-400">
                <p className="text-xs font-bold text-gray-900">Wetli</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalWetli)}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 mb-4 border-2 border-green-400">
                <p className="text-xs font-bold text-gray-900">Graf</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalGraf)}</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-400">
                <p className="text-xs font-bold text-gray-900">Bürzle</p>
                <p className="text-2xl font-bold text-amber-600">{formatCurrency(totalBürzle)}</p>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-amber-50 rounded-lg p-6 border-2 border-gray-400">
            <p className="text-sm font-bold text-gray-900 mb-1">Gesamtimmobilienwert</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalCost)}</p>
          </div>
        </div>

        {/* SECTION 2: Kostenaufstellung */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12 border-2 border-gray-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Kostenaufstellung ({costPositions.length} Positionen)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-200 border-b-2 border-gray-400">
                  <th className="text-left p-3 font-bold text-gray-900">Pos.</th>
                  <th className="text-left p-3 font-bold text-gray-900">Beschreibung</th>
                  <th className="text-right p-3 font-bold text-gray-900">Total</th>
                  <th className="text-right p-3 font-bold text-gray-900 bg-blue-100">Wetli</th>
                  <th className="text-right p-3 font-bold text-gray-900 bg-green-100">Graf</th>
                  <th className="text-right p-3 font-bold text-gray-900 bg-amber-100">Bürzle</th>
                </tr>
              </thead>
              <tbody>
                {costPositions.map((item, index) => (
                  <tr key={item.Pos} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-3 font-bold text-gray-900">{item.Pos}</td>
                    <td className="p-3 text-gray-900 font-medium">{item.Beschreibung}</td>
                    <td className="text-right p-3 font-semibold text-gray-900">{formatCurrency(item.Total)}</td>
                    <td className="text-right p-3 text-blue-600 font-semibold bg-blue-50">{formatCurrency(item.Wetli)}</td>
                    <td className="text-right p-3 text-green-600 font-semibold bg-green-50">{formatCurrency(item.Graf)}</td>
                    <td className="text-right p-3 text-amber-600 font-semibold bg-amber-50">{formatCurrency(item.Bürzle)}</td>
                  </tr>
                ))}
                <tr className="bg-gray-300 font-bold border-t-2 border-gray-400">
                  <td colSpan={2} className="p-3 text-gray-900">TOTAL</td>
                  <td className="text-right p-3 text-gray-900">{formatCurrency(totalCost)}</td>
                  <td className="text-right p-3 text-gray-900 bg-blue-100">{formatCurrency(totalWetli)}</td>
                  <td className="text-right p-3 text-gray-900 bg-green-100">{formatCurrency(totalGraf)}</td>
                  <td className="text-right p-3 text-gray-900 bg-amber-100">{formatCurrency(totalBürzle)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 3: Finanzierungs-Parameter */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12 border-2 border-gray-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Finanzierungs-Parameter</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Kaufpreis (CHF)</label>
              <input
                type="number"
                value={kaufpreis}
                onChange={(e) => setKaufpreis(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Eigenkapital (CHF)</label>
              <input
                type="number"
                value={eigenkapital}
                onChange={(e) => setEigenkapital(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Zinssatz (%)</label>
              <input
                type="number"
                step="0.1"
                value={zinssatz}
                onChange={(e) => setZinssatz(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Amortisationsjahre</label>
              <input
                type="number"
                value={amortisationJahre}
                onChange={(e) => setAmortisationJahre(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Berechnete Werte */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-400">
              <p className="text-xs font-bold text-gray-900">Hypothek</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(hypoCHF)}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-400">
              <p className="text-xs font-bold text-gray-900">Eigenkapitalquote</p>
              <p className="text-2xl font-bold text-green-600">{((eigenkapital / kaufpreis) * 100).toFixed(1)}%</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-400">
              <p className="text-xs font-bold text-gray-900">Monatliche Hypothek</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(monatlicheHypothek)}</p>
            </div>
          </div>

          {/* Nebenkosten pro Partei */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-6 border-2 border-gray-400">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Nebenkosten (monatlich pro Partei)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Wetli (CHF/Monat)</label>
                <input
                  type="number"
                  value={nebenKostenWetli}
                  onChange={(e) => setNebenKostenWetli(Number(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-blue-400 bg-blue-50 text-gray-900 font-semibold rounded-lg focus:border-blue-600 focus:outline-none"
                />
                <p className="text-xs text-gray-900 mt-2">Jährlich: {formatCurrency(nebenKostenWetli * 12)}</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Graf (CHF/Monat)</label>
                <input
                  type="number"
                  value={nebenKostenGraf}
                  onChange={(e) => setNebenKostenGraf(Number(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-green-400 bg-green-50 text-gray-900 font-semibold rounded-lg focus:border-green-600 focus:outline-none"
                />
                <p className="text-xs text-gray-900 mt-2">Jährlich: {formatCurrency(nebenKostenGraf * 12)}</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Bürzle (CHF/Monat)</label>
                <input
                  type="number"
                  value={nebenKostenBürzle}
                  onChange={(e) => setNebenKostenBürzle(Number(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-amber-400 bg-amber-50 text-gray-900 font-semibold rounded-lg focus:border-amber-600 focus:outline-none"
                />
                <p className="text-xs text-gray-900 mt-2">Jährlich: {formatCurrency(nebenKostenBürzle * 12)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: Jährliche Kosten und Monatliche Kosten */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12 border-2 border-gray-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Kostenübersicht (monatlich)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-400">
              <h3 className="text-sm font-bold text-blue-600 mb-3">WETLI</h3>
              <div className="mb-4">
                <p className="text-xs text-gray-900">Hypothek anteil:</p>
                <p className="text-lg font-bold text-blue-600">{formatCurrency((monatlicheHypothek * (totalWetli / totalCost)))}</p>
              </div>
              <div className="mb-4 pb-4 border-b-2 border-blue-300">
                <p className="text-xs text-gray-900">Nebenkosten:</p>
                <p className="text-lg font-bold text-blue-600">{formatCurrency(nebenKostenWetli)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-900 mb-1">Total monatlich:</p>
                <p className="text-2xl font-bold text-blue-700">{formatCurrency(monatlichWetli)}</p>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-400">
              <h3 className="text-sm font-bold text-green-600 mb-3">GRAF</h3>
              <div className="mb-4">
                <p className="text-xs text-gray-900">Hypothek anteil:</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency((monatlicheHypothek * (totalGraf / totalCost)))}</p>
              </div>
              <div className="mb-4 pb-4 border-b-2 border-green-300">
                <p className="text-xs text-gray-900">Nebenkosten:</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(nebenKostenGraf)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-900 mb-1">Total monatlich:</p>
                <p className="text-2xl font-bold text-green-700">{formatCurrency(monatlichGraf)}</p>
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-6 border-2 border-amber-400">
              <h3 className="text-sm font-bold text-amber-600 mb-3">BÜRZLE</h3>
              <div className="mb-4">
                <p className="text-xs text-gray-900">Hypothek anteil:</p>
                <p className="text-lg font-bold text-amber-600">{formatCurrency((monatlicheHypothek * (totalBürzle / totalCost)))}</p>
              </div>
              <div className="mb-4 pb-4 border-b-2 border-amber-300">
                <p className="text-xs text-gray-900">Nebenkosten:</p>
                <p className="text-lg font-bold text-amber-600">{formatCurrency(nebenKostenBürzle)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-900 mb-1">Total monatlich:</p>
                <p className="text-2xl font-bold text-amber-700">{formatCurrency(monatlichBürzle)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: 50-Jahre Kostenentwicklung */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12 border-2 border-gray-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Entwicklung der monatlichen Kosten (50 Jahre)</h2>
          
          {/* LineChart Grafik */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-300">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Kostentrend Grafik</h3>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart 
                data={costForecast} 
                margin={{ top: 20, right: 60, left: 80, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="jahr"
                  label={{ value: 'Jahre', position: 'bottom', offset: 20, fontSize: 12, fontWeight: 'bold' }}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  label={{ value: 'CHF/Monat', angle: -90, position: 'left', offset: 20, fontSize: 12, fontWeight: 'bold' }}
                  tick={{ fontSize: 11 }}
                  width={70}
                />
                <Tooltip
                  formatter={(value: any) => formatCurrency(Number(value))}
                  labelFormatter={(label: any) => `Jahr ${label}`}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '2px solid #333',
                    borderRadius: '8px',
                    padding: '10px',
                    fontSize: '12px',
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
                <Line
                  type="linear"
                  dataKey="wetli"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="Wetli"
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="linear"
                  dataKey="graf"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Graf"
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="linear"
                  dataKey="bürzle"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  name="Bürzle"
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Detaillierte Tabelle */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Monatliche Kosten nach Jahren</h3>
            <div className="overflow-y-auto max-h-96 border-2 border-gray-300 rounded-lg">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-300 border-b-2 border-gray-400">
                  <tr>
                    <th className="text-left p-3 font-bold text-gray-900">Jahr</th>
                    <th className="text-right p-3 font-bold text-gray-900 bg-blue-100">Wetli (CHF)</th>
                    <th className="text-right p-3 font-bold text-gray-900 bg-green-100">Graf (CHF)</th>
                    <th className="text-right p-3 font-bold text-gray-900 bg-amber-100">Bürzle (CHF)</th>
                    <th className="text-right p-3 font-bold text-gray-900 bg-gray-200">Total (CHF)</th>
                  </tr>
                </thead>
                <tbody>
                  {costForecast.map((item, index) => (
                    <tr key={item.jahr} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 font-bold text-gray-800">{item.jahr}</td>
                      <td className="text-right p-3 text-blue-600 font-semibold bg-blue-50">{formatCurrency(item.wetli)}</td>
                      <td className="text-right p-3 text-green-600 font-semibold bg-green-50">{formatCurrency(item.graf)}</td>
                      <td className="text-right p-3 text-amber-600 font-semibold bg-amber-50">{formatCurrency(item.bürzle)}</td>
                      <td className="text-right p-3 font-bold text-gray-800 bg-gray-100">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Erklärung */}
          <div className="bg-gradient-to-r from-blue-50 via-green-50 to-amber-50 rounded-lg p-6 border-2 border-gray-400">
            <h3 className="font-bold text-gray-800 mb-2">📊 Erklärung der Grafik und Tabelle:</h3>
            <ul className="text-sm text-gray-900 space-y-2 list-disc list-inside">
              <li><strong>Grafik:</strong> Zeigt visuell, wie die monatlichen Kosten pro Partei über 50 Jahre sinken</li>
              <li><strong>Sinkender Trend:</strong> Die Kosten fallen, weil die Hypothek durch Amortisation abgebaut wird</li>
              <li><strong>Nebenkosten-Basis:</strong> Die Mindestkosten sind die monatlichen Nebenkosten</li>
              <li><strong>Tabelle:</strong> Exakte monatliche Kosten für jedes einzelne Jahr (alle 51 Datenpunkte)</li>
              <li><strong>Scrollbar:</strong> Da 51 Jahre angezeigt werden, können Sie in der Tabelle scrollen</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-900 text-sm mt-12">
          <p>Gängle Finanzierung © 2024 - Alle Angaben ohne Gewähr</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
