from typing import List, Dict, Any

def generate_insights(products: List[Dict[str, Any]]) -> List[str]:
    """Génère les bullet points d'analyse pour le bloc Assistant IA."""
    insights = []

    # 1. Identifier les produits avec la plus forte demande
    high_demand_products = [p for p in products if p["demand"] >= 70]
    if high_demand_products:
        top_name = high_demand_products[0]["name"]
        insights.append(f"Forte demande anticipée sur {top_name} ({high_demand_products[0]['demand']}%)")

    # 2. Détecter les alertes de réapprovisionnement critique
    critical_stocks = [p for p in products if p["risk"] == "high"]
    if critical_stocks:
        count = len(critical_stocks)
        names = ", ".join([p["name"] for p in critical_stocks[:2]])
        insights.append(f"Risque élevé de rupture sur {names} ({count} produit{'s' if count > 1 else ''})")

    # 3. Évolution des batteries & onduleurs
    battery = next((p for p in products if "Batterie" in p["name"]), None)
    if battery and battery["risk"] != "low":
        insights.append("Ventes de batteries en croissance corrélée aux installations solaires")

    # 4. Détecter les produits stables ou en baisse
    low_demand = [p for p in products if p["risk"] == "low" and p["demand"] < 30]
    if low_demand:
        insights.append(f"Demande des {low_demand[0]['name'].lower()}s stable, aucun réapprovisionnement requis")
    else:
        insights.append("Surveillance continue des stocks et des flux de commande active")

    return insights[:4]
