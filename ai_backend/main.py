import os
from datetime import datetime
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any

from schemas.ai_schemas import (
    AIOverviewResponse,
    GlobalStats,
    ProductDemand,
    TrendPoint,
    RestockOrderRequest
)
from services.ml_service import analyze_products, calculate_trends
from services.insights_service import generate_insights

# Charger les variables d'environnement
load_dotenv()

PORT = int(os.getenv("PORT", 8001))
HOST = os.getenv("HOST", "127.0.0.1")
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"
).split(",")

app = FastAPI(
    title="Green Energy - AI Demand & Stock Analytics API",
    description="Backend FastAPI fournissant les prédictions IA pour le dashboard d'administration.",
    version="1.0.0",
)

# Configuration CORS pour autoriser le frontend Vue 3
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Health"])
def root():
    return {
        "service": "Green Energy AI Analytics API",
        "status": "online",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "docs": "/docs"
    }

@app.get("/api/ai/overview", response_model=AIOverviewResponse, tags=["AI Dashboard"])
def get_ai_overview():
    """
    Fournit l'ensemble des données nécessaires au composant Aianalysispanel.vue :
    - KPIs statistiques globaux
    - Recommandations de réapprovisionnement urgentes
    - Tableau complet des prédictions par produit
    - Top 3 des produits les plus demandés
    - Graphique d'évolution réelle vs prédictions
    - Bullet points de l'assistant IA
    """
    products = analyze_products()
    trends = calculate_trends()
    insights = generate_insights(products)

    # Calcul des KPIs
    total_products = len(products)
    high_risk_count = sum(1 for p in products if p["risk"] == "high")
    avg_demand = round(sum(p["demand"] for p in products) / total_products) if total_products > 0 else 0

    # Produits triés par demande décroissante
    top_products = sorted(products, key=lambda x: x["demand"], reverse=True)[:3]
    recommendations = [p for p in products if p["risk"] != "low"]

    current_time = datetime.now().strftime("%H:%M")

    return {
        "last_analysis": current_time,
        "stats": {
            "total": total_products,
            "high": high_risk_count,
            "avgDemand": avg_demand
        },
        "recommendations": recommendations,
        "products": products,
        "topProducts": top_products,
        "trends": trends,
        "assistant_insights": insights,
        "assistant_time": f"Généré aujourd'hui à {current_time}"
    }

@app.get("/api/ai/products", response_model=List[ProductDemand], tags=["AI Dashboard"])
def get_all_predicted_products():
    """Retourne la liste complète des prédictions pour tous les produits."""
    return analyze_products()

@app.get("/api/ai/products/{product_id}", response_model=ProductDemand, tags=["AI Dashboard"])
def get_single_product_prediction(product_id: int):
    """Retourne le détail de prédiction et de risque pour un produit spécifique."""
    products = analyze_products()
    product = next((p for p in products if p["id"] == product_id), None)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Produit avec l'ID {product_id} non trouvé"
        )
    return product

@app.get("/api/ai/trends", response_model=List[TrendPoint], tags=["AI Dashboard"])
def get_demand_trends():
    """Retourne les points du graphique de tendance (historique + prédictions)."""
    return calculate_trends()

@app.post("/api/ai/restock-order", tags=["Actions"])
def create_restock_order(order: RestockOrderRequest):
    """Simule la création d'un bon de commande suite à une recommandation IA."""
    products = analyze_products()
    product = next((p for p in products if p["id"] == order.product_id), None)
    product_name = product["name"] if product else f"Produit #{order.product_id}"

    return {
        "success": True,
        "message": f"Bon de commande créé avec succès pour {order.units} unités de '{product_name}'.",
        "order_id": f"CMD-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "status": "pending_approval"
    }

if __name__ == "__main__":
    import uvicorn
    print(f"🚀 Starting Green Energy AI Backend on http://{HOST}:{PORT}")
    print(f"📚 Interactive Swagger docs at http://{HOST}:{PORT}/docs")
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
