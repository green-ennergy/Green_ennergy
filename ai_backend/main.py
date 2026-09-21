import os
from datetime import datetime
from typing import Any, Dict, List

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from schemas.ai_schemas import (
    AIOverviewResponse,
    AnalyzeRequest,
    ProductDemand,
    RestockOrderRequest,
    TrendPoint,
)
from services.insights_service import generate_insights
from services.ml_service import analyze_products, calculate_trends

load_dotenv()

PORT = int(os.getenv("PORT", 8001))
HOST = os.getenv("HOST", "127.0.0.1")
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://localhost:8000",
).split(",")

app = FastAPI(
    title="Green Energy - AI Demand & Stock Analytics API",
    description="Backend FastAPI fournissant les prédictions IA pour le dashboard d'administration.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def build_overview(products: List[Dict[str, Any]]) -> Dict[str, Any]:
    trends = calculate_trends(products)
    insights = generate_insights(products)

    total_products = len(products)
    high_risk_count = sum(1 for p in products if p["risk"] == "high")
    avg_demand = round(sum(p["demand"] for p in products) / total_products) if total_products else 0

    top_products = sorted(products, key=lambda x: x["demand"], reverse=True)[:3]
    recommendations = [p for p in products if p["risk"] != "low"]
    current_time = datetime.now().strftime("%H:%M")

    return {
        "last_analysis": current_time,
        "stats": {
            "total": total_products,
            "high": high_risk_count,
            "avgDemand": avg_demand,
        },
        "recommendations": recommendations,
        "products": products,
        "topProducts": top_products,
        "trends": trends,
        "assistant_insights": insights,
        "assistant_time": f"Généré aujourd'hui à {current_time}",
    }


@app.get("/", tags=["Health"])
def root():
    return {
        "service": "Green Energy AI Analytics API",
        "status": "online",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "docs": "/docs",
    }


@app.post("/api/ai/analyze", response_model=AIOverviewResponse, tags=["AI Dashboard"])
def analyze_catalog(payload: AnalyzeRequest):
    """Analyse un catalogue réel (envoyé par Laravel) et renvoie l'overview dashboard."""
    catalog = [p.model_dump() for p in payload.products]
    if not catalog:
        return build_overview([])
    products = analyze_products(catalog)
    return build_overview(products)


@app.get("/api/ai/overview", response_model=AIOverviewResponse, tags=["AI Dashboard"])
def get_ai_overview():
    """Empty without catalog — use POST /api/ai/analyze (Laravel sends live products)."""
    return build_overview([])


@app.get("/api/ai/products", response_model=List[ProductDemand], tags=["AI Dashboard"])
def get_all_predicted_products():
    return []


@app.get("/api/ai/products/{product_id}", response_model=ProductDemand, tags=["AI Dashboard"])
def get_single_product_prediction(product_id: int):
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Use POST /api/ai/analyze with the Laravel catalog.",
    )


@app.get("/api/ai/trends", response_model=List[TrendPoint], tags=["AI Dashboard"])
def get_demand_trends():
    return []


@app.post("/api/ai/restock-order", tags=["Actions"])
def create_restock_order(order: RestockOrderRequest):
    product_name = order.product_name or f"Produit #{order.product_id}"
    return {
        "success": True,
        "message": f"Bon de commande créé avec succès pour {order.units} unités de '{product_name}'.",
        "order_id": f"CMD-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "status": "pending_approval",
        "product_id": order.product_id,
        "units": order.units,
    }


if __name__ == "__main__":
    import uvicorn

    print(f"Starting Green Energy AI Backend on http://{HOST}:{PORT}")
    print(f"Interactive Swagger docs at http://{HOST}:{PORT}/docs")
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
