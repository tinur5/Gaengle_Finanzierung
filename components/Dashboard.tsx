'use client';

import { useState, useEffect } from 'react';

interface CostItem {
  Pos?: string;
  Beschreibung?: string;
  Total?: number;
  Wetli?: number;
  Graf?: number;
  Bürzle?: number;
}

export default function Dashboard() {
  const [costData, setCostData] = useState<CostItem[]>([]);
  
  // Finanzierungs-Parameter
  const [kaufpreis, setKaufpreis] = useState(6500000); // CHF
  const [eigenkapital, setEigenkapital] = useState(20); // %
  const [zinssatz, setZinssatz] = useState(2.5); // %
  const [amortisationJahre, setAmortisationJahre] = useState(25); // Jahre
  const [maklergebuhr, setMaklergebuhr] = useState(2); // %
  
  // Berechnete Werte
  const eigenkapitalCHF = kaufpreis * (eigenkapital / 100);
  const hypoCHF = kaufpreis - eigenkapitalCHF;
  const maklerCHF = kaufpreis * (maklergebuhr / 100);
  
  // Monatliche Kosten
  const monatlicheZinsen = hypoCHF * (zinssatz / 100) / 12;
  const monatlicheAmortisation = hypoCHF / (amortisationJahre * 12);
  const monatlicheHypothek = monatlicheZinsen + monatlicheAmortisation;
  const jaehrlicheHypothek = monatlicheHypothek * 12;
  
  // Kostendaten laden
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/financingData');
        const data = await response.json();
        setCostData(data);
      } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
      }
    };
    loadData();
  }, []);

  // Gesamtkosten aus Excel-Daten
  const totalCost = costData.reduce((sum, item) => sum + (item.Total || 0), 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 bg-gradient-to-r from-blue-600 to-blue-800 p-8 rounded-lg text-white">
          <h1 className="text-4xl font-bold mb-2">Gängle Finanzierung</h1>
          <p className="text-blue-100 text-lg">3-Parteien Stockwerkeigentum - Finanzierungsübersicht</p>
          <p className="text-yellow-300 text-2xl font-bold mt-4">Gesamtkosten: {formatCurrency(totalCost)}</p>
        </div>

        {/* Finanzierungs-Parameter */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg shadow-lg p-8 mb-12 border-2 border-blue-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Finanzierungs-Parameter</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Kaufpreis */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kaufpreis (CHF)</label>
              <input
                type="number"
                value={kaufpreis}
                onChange={(e) => setKaufpreis(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">{formatCurrency(kaufpreis)}</p>
            </div>

            {/* Eigenkapital % */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Eigenkapital (%)</label>
              <input
                type="number"
                step="0.1"
                value={eigenkapital}
                onChange={(e) => setEigenkapital(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">{formatCurrency(eigenkapitalCHF)}</p>
            </div>

            {/* Zinssatz */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Zinssatz (%)</label>
              <input
                type="number"
                step="0.1"
                value={zinssatz}
                onChange={(e) => setZinssatz(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">CHF {monatlicheZinsen.toFixed(0)}/Monat</p>
            </div>

            {/* Amortisation Jahre */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Amortisation (Jahre)</label>
              <input
                type="number"
                value={amortisationJahre}
                onChange={(e) => setAmortisationJahre(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">CHF {monatlicheAmortisation.toFixed(0)}/Monat</p>
            </div>

            {/* Maklergebühr */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Makler (%)</label>
              <input
                type="number"
                step="0.1"
                value={maklergebuhr}
                onChange={(e) => setMaklergebuhr(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">{formatCurrency(maklerCHF)}</p>
            </div>
          </div>
        </div>

        {/* Finanzierungs-Übersicht */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6 border-l-4 border-blue-600">
            <p className="text-sm text-gray-600 mb-1">Eigenkapital</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(eigenkapitalCHF)}</p>
            <p className="text-xs text-gray-500 mt-2">{eigenkapital.toFixed(1)}% des Kaufpreises</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6 border-l-4 border-green-600">
            <p className="text-sm text-gray-600 mb-1">Hypothek</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(hypoCHF)}</p>
            <p className="text-xs text-gray-500 mt-2">{(100 - eigenkapital).toFixed(1)}% des Kaufpreises</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow p-6 border-l-4 border-purple-600">
            <p className="text-sm text-gray-600 mb-1">Monatliche Hypothek</p>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(monatlicheHypothek)}</p>
            <p className="text-xs text-gray-500 mt-2">Zinsen + Amortisation</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow p-6 border-l-4 border-orange-600">
            <p className="text-sm text-gray-600 mb-1">Jährliche Hypothek</p>
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(jaehrlicheHypothek)}</p>
            <p className="text-xs text-gray-500 mt-2">12 x monatliche Rate</p>
          </div>
        </div>

        {/* Parteien-Übersicht */}
        {costData.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { name: 'Wetli', color: '#3b82f6', share: 0.271 },
                { name: 'Graf', color: '#10b981', share: 0.271 },
                { name: 'Bürzle', color: '#f59e0b', share: 0.457 }
              ].map((party) => (
                <div key={party.name} className="bg-white rounded-lg shadow-lg p-6 border-l-4" style={{ borderLeftColor: party.color }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: party.color }} />
                    <h3 className="text-xl font-bold text-gray-800">{party.name}</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalCost * party.share)}</p>
                  <p className="text-sm text-gray-500 mt-2">{(party.share * 100).toFixed(1)}% der Gesamtkosten</p>
                  <p className="text-xs text-blue-600 font-bold mt-3">Hypothek-Anteil: {formatCurrency(hypoCHF * party.share)}</p>
                </div>
              ))}
            </div>

            {/* Kosten-Tabelle */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Detaillierte Kostenübersicht</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 font-bold text-gray-700">Pos</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-700">Beschreibung</th>
                      <th className="text-right py-3 px-4 font-bold text-gray-700">Total</th>
                      <th className="text-right py-3 px-4 font-bold text-blue-600">Wetli (27.1%)</th>
                      <th className="text-right py-3 px-4 font-bold text-green-600">Graf (27.1%)</th>
                      <th className="text-right py-3 px-4 font-bold text-amber-600">Bürzle (45.7%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costData.slice(0, 30).map((item, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="py-3 px-4 text-gray-600">{item.Pos}</td>
                        <td className="py-3 px-4 text-gray-800">{item.Beschreibung}</td>
                        <td className="text-right py-3 px-4 font-bold text-gray-900">{formatCurrency(item.Total || 0)}</td>
                        <td className="text-right py-3 px-4 text-blue-600">{formatCurrency((item.Wetli || 0))}</td>
                        <td className="text-right py-3 px-4 text-green-600">{formatCurrency((item.Graf || 0))}</td>
                        <td className="text-right py-3 px-4 text-amber-600">{formatCurrency((item.Bürzle || 0))}</td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-gray-200 bg-gray-100 font-bold">
                      <td className="py-3 px-4 text-gray-900" colSpan={2}>SUMME</td>
                      <td className="text-right py-3 px-4 text-gray-900">{formatCurrency(totalCost)}</td>
                      <td className="text-right py-3 px-4 text-blue-600">{formatCurrency(totalCost * 0.271)}</td>
                      <td className="text-right py-3 px-4 text-green-600">{formatCurrency(totalCost * 0.271)}</td>
                      <td className="text-right py-3 px-4 text-amber-600">{formatCurrency(totalCost * 0.457)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Loading State */}
        {costData.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500">Laden der Daten...</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Gängle Finanzierung © 2026</p>
        </div>
      </div>
    </div>
  );
}
