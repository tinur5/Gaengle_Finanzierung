'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  // Beispiel-Daten aus der Kalkulationsdatei
  const costData = [
    { category: 'Grundstück', total: 17150, wetli: 4654, graf: 4654, burzle: 7842 },
    { category: 'Vorbereitung', total: 27969, wetli: 7590, graf: 7590, burzle: 12788 },
    { category: 'Rohbau 1', total: 1654000, wetli: 448865, graf: 448865, burzle: 756270 },
    { category: 'Rohbau 2', total: 623826, wetli: 169295, graf: 169295, burzle: 285236 },
    { category: 'Elektro', total: 251021, wetli: 68122, graf: 68122, burzle: 114776 },
    { category: 'Heizung', total: 96000, wetli: 26053, graf: 26053, burzle: 43895 },
    { category: 'Sanitär', total: 254876, wetli: 69169, graf: 69169, burzle: 116539 },
    { category: 'Ausbauten', total: 390000, wetli: 105788, graf: 105788, burzle: 178424 },
  ];

  const totalCost = costData.reduce((sum, item) => sum + item.total, 0);

  // Partei-Anteile für Pie Chart
  const partyTotals = [
    { name: 'Wetli', value: costData.reduce((sum, item) => sum + item.wetli, 0) },
    { name: 'Graf', value: costData.reduce((sum, item) => sum + item.graf, 0) },
    { name: 'Bürzle', value: costData.reduce((sum, item) => sum + item.burzle, 0) },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

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

        {/* Parteien-Übersicht */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {partyTotals.map((party, idx) => (
            <div key={party.name} className="bg-white rounded-lg shadow-lg p-6 border-l-4" style={{ borderLeftColor: COLORS[idx] }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                <h3 className="text-xl font-bold text-gray-800">{party.name}</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(party.value)}</p>
              <p className="text-sm text-gray-500 mt-2">
                {((party.value / totalCost) * 100).toFixed(1)}% der Gesamtkosten
              </p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Kostenverteilung nach Kategorie</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Bar dataKey="wetli" fill="#3b82f6" name="Wetli" />
                <Bar dataKey="graf" fill="#10b981" name="Graf" />
                <Bar dataKey="burzle" fill="#f59e0b" name="Bürzle" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Kostenanteil nach Partei</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={partyTotals}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {partyTotals.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detaillierte Kostenübersicht */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Detaillierte Kostenübersicht</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-bold text-gray-700">Kostengruppe</th>
                  <th className="text-right py-3 px-4 font-bold text-gray-700">Total</th>
                  <th className="text-right py-3 px-4 font-bold text-blue-600">Wetli</th>
                  <th className="text-right py-3 px-4 font-bold text-green-600">Graf</th>
                  <th className="text-right py-3 px-4 font-bold text-amber-600">Bürzle</th>
                </tr>
              </thead>
              <tbody>
                {costData.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-3 px-4 text-gray-800">{item.category}</td>
                    <td className="text-right py-3 px-4 font-bold text-gray-900">{formatCurrency(item.total)}</td>
                    <td className="text-right py-3 px-4 text-blue-600">{formatCurrency(item.wetli)}</td>
                    <td className="text-right py-3 px-4 text-green-600">{formatCurrency(item.graf)}</td>
                    <td className="text-right py-3 px-4 text-amber-600">{formatCurrency(item.burzle)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-gray-200 bg-gray-100">
                  <td className="py-3 px-4 font-bold text-gray-900">TOTAL</td>
                  <td className="text-right py-3 px-4 font-bold text-gray-900">{formatCurrency(totalCost)}</td>
                  <td className="text-right py-3 px-4 font-bold text-blue-600">{formatCurrency(partyTotals[0].value)}</td>
                  <td className="text-right py-3 px-4 font-bold text-green-600">{formatCurrency(partyTotals[1].value)}</td>
                  <td className="text-right py-3 px-4 font-bold text-amber-600">{formatCurrency(partyTotals[2].value)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Gängle Finanzierung © 2026</p>
        </div>
      </div>
    </div>
  );
}
