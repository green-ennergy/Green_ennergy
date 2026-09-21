from pydantic import BaseModel, Field
from typing import List, Optional


class ProductDemand(BaseModel):
    id: int
    name: str
    icon_type: str  # 'sun', 'battery', 'plug', 'zap'
    stock: int
    avgSales: int
    demand: int  # % Score (e.g. 92)
    risk: str  # 'high' | 'medium' | 'low'
    restock: int  # Recommandation d'achat
    expectedSales: int
    confidence: int  # Score de confiance (ex: 94%)
    deadline: str  # Ex: "25 août"
    reasons: List[str]  # Justifications de l'IA


class TrendPoint(BaseModel):
    month: str  # Ex: "Jan", "Fév", ...
    reel: Optional[float] = None
    prevu: Optional[float] = None


class GlobalStats(BaseModel):
    total: int
    high: int
    avgDemand: int


class AIOverviewResponse(BaseModel):
    last_analysis: str
    stats: GlobalStats
    recommendations: List[ProductDemand]
    products: List[ProductDemand]
    topProducts: List[ProductDemand]
    trends: List[TrendPoint]
    assistant_insights: List[str]
    assistant_time: str


class CatalogProductInput(BaseModel):
    id: int
    name: str
    stock: int = 0
    sales: int = 0
    rfq_demand: int = 0
    icon_type: str = "zap"
    category: Optional[str] = None


class AnalyzeRequest(BaseModel):
    products: List[CatalogProductInput] = Field(default_factory=list)


class RestockOrderRequest(BaseModel):
    product_id: int
    units: int
    notes: Optional[str] = None
    product_name: Optional[str] = None
