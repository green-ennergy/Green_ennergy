export const products = [
  {
    id: 1, name: 'Panneau Solaire 450W', stock: 120, avgSales: 95,
    demand: 92, expected: 110, restock: 80, confidence: 94, risk: 'high',
    reasons: [
      'Ventes en hausse sur les 6 derniers mois.',
      'La saison estivale augmente la demande.',
      'Le stock actuel ne couvrira pas la demande du mois prochain.'
    ]
  },
  {
    id: 2, name: 'Batterie 10kWh', stock: 60, avgSales: 48,
    demand: 71, expected: 58, restock: 25, confidence: 87, risk: 'mid',
    reasons: [
      'Croissance régulière des commandes en pack batterie.',
      'Le délai fournisseur est de 3 semaines.',
      'Le stock couvre environ 18 jours de demande supplémentaire.'
    ]
  },
  {
    id: 3, name: 'Onduleur Hybride', stock: 150, avgSales: 40,
    demand: 48, expected: 45, restock: 0, confidence: 81, risk: 'low',
    reasons: [
      'Demande stable, aucun pic saisonnier détecté.',
      'Le stock actuel couvre plus de 3 mois de ventes.',
      'Aucun réapprovisionnement nécessaire pour le moment.'
    ]
  },
  {
    id: 4, name: 'Chargeur Solaire', stock: 90, avgSales: 12,
    demand: 10, expected: 9, restock: 0, confidence: 76, risk: 'low',
    reasons: [
      'La demande est en baisse depuis 3 mois.',
      'Le stock existant est largement suffisant.',
      'Envisager une promotion pour écouler le stock actuel.'
    ]
  }
]

export const riskLabel = { high: 'ÉLEVÉ', mid: 'MOYEN', low: 'FAIBLE' }
export const riskColor = { high: 'var(--red)', mid: 'var(--amber)', low: 'var(--green)' }

// Données du graphique de tendance : Jan-Juil réel, Août-Oct prédit
export const months = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct']
export const values = [22, 30, 38, 46, 55, 63, 70, 82, 90, 96]
export const predictedFrom = 7
