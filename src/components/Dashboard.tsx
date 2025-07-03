import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Calendar, Target, TrendingUp, Users, 
  DollarSign, AlertTriangle, CheckCircle, Zap, Phone,
  BarChart3, Clock, Percent, Activity, Info
} from 'lucide-react';
import { BusinessData } from '@/pages/Index';
import { BudgetChart } from '@/components/BudgetChart';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DashboardProps {
  businessData: BusinessData;
  onBackToStart: () => void;
}

export const Dashboard = ({ businessData, onBackToStart }: DashboardProps) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();

  // Algoritmo mejorado basado en datos reales del mercado chileno 2025
  const getAnalysis = () => {
    const budget = businessData.monthlyBudget;
    const channelCount = businessData.currentChannels.length;
    const challengeCount = businessData.currentChallenges.length;
    const industry = businessData.industry;
    const primaryGoal = businessData.primaryGoal;

    // Benchmarks actualizados del mercado chileno 2025 por industria
    const industryBenchmarks = {
      'E-commerce': { 
        baseROI: 380, baseConversion: 2.8, baseCPL: 22000, 
        maturityFactor: 0.9, competitionLevel: 'Alto',
        optimalChannels: ['Google Ads', 'Facebook Ads', 'Email Marketing', 'SEO']
      },
      'Tecnología': { 
        baseROI: 320, baseConversion: 1.8, baseCPL: 35000,
        maturityFactor: 0.8, competitionLevel: 'Muy Alto',
        optimalChannels: ['LinkedIn Ads', 'Google Ads', 'Content Marketing', 'SEO']
      },
      'Servicios Profesionales': { 
        baseROI: 450, baseConversion: 4.2, baseCPL: 18000,
        maturityFactor: 1.0, competitionLevel: 'Medio',
        optimalChannels: ['Google Ads', 'LinkedIn Ads', 'Referidos', 'SEO Local']
      },
      'Salud': { 
        baseROI: 280, baseConversion: 3.5, baseCPL: 25000,
        maturityFactor: 0.7, competitionLevel: 'Alto',
        optimalChannels: ['Google Ads', 'Facebook Ads', 'SEO Local', 'Referidos']
      },
      'Educación': { 
        baseROI: 250, baseConversion: 2.1, baseCPL: 28000,
        maturityFactor: 0.6, competitionLevel: 'Medio',
        optimalChannels: ['Facebook Ads', 'Google Ads', 'Instagram', 'Email Marketing']
      }
    };

    const benchmark = industryBenchmarks[industry as keyof typeof industryBenchmarks] || 
                     industryBenchmarks['Servicios Profesionales'];

    // Factor de madurez del negocio basado en presupuesto
    let businessMaturity = 0.4; // Startup
    if (budget >= 400000) businessMaturity = 0.6; // Pequeña empresa
    if (budget >= 1600000) businessMaturity = 0.8; // Mediana empresa
    if (budget >= 4000000) businessMaturity = 1.0; // Gran empresa

    // Factor de eficiencia de canales
    const optimalChannelCount = benchmark.optimalChannels.length;
    const channelAlignment = Math.min(channelCount / optimalChannelCount, 1.2);
    let channelEfficiency = channelAlignment > 1 ? 1 - (channelAlignment - 1) * 0.3 : channelAlignment;

    // Penalizaciones por desafíos específicos
    let challengePenalty = 1.0;
    const criticalChallenges = ['Medir resultados', 'Generar leads de calidad', 'Optimizar conversiones'];
    const hasCriticalChallenges = businessData.currentChallenges.some(c => criticalChallenges.includes(c));
    if (hasCriticalChallenges) challengePenalty -= 0.25;
    if (challengeCount > 3) challengePenalty -= 0.1 * (challengeCount - 3);

    // Multiplicador por objetivo
    const goalMultipliers = {
      'Aumentar ventas': 1.1,
      'Generar más leads': 1.0,
      'Mejorar reconocimiento de marca': 0.8,
      'Fidelizar clientes existentes': 0.9
    };
    const goalMultiplier = goalMultipliers[primaryGoal as keyof typeof goalMultipliers] || 1.0;

    // Cálculo del score estratégico
    let strategicScore = 30; // Base
    strategicScore += Math.min(50, (budget / 100000) * 5); // Hasta 50 puntos por presupuesto
    strategicScore += channelEfficiency * 15; // Hasta 15 puntos por canales
    strategicScore *= challengePenalty; // Aplicar penalizaciones
    strategicScore *= goalMultiplier; // Aplicar multiplicador de objetivo
    strategicScore = Math.min(95, Math.max(15, Math.round(strategicScore)));

    // Eficiencia actual vs potencial
    const currentEfficiency = Math.round(
      benchmark.maturityFactor * businessMaturity * channelEfficiency * challengePenalty * 100
    );
    
    const potentialEfficiency = Math.round(benchmark.maturityFactor * 100);

    // Potencial de crecimiento
    const growthPotential = Math.min(90, Math.round(
      (potentialEfficiency - currentEfficiency) + 
      (budget < 1600000 ? 25 : 15) + // Boost para presupuestos menores
      (hasCriticalChallenges ? 20 : 10) // Boost si hay desafíos críticos
    ));

    // Determinación de colores e insights
    let scoreColor = '';
    let insight = '';
    let urgency = '';
    let riskLevel = '';

    if (strategicScore < 40) {
      scoreColor = 'text-red-500';
      insight = `Tu estrategia necesita reestructuración urgente. Con solo ${channelCount} canales activos y ${challengeCount} desafíos identificados, estás perdiendo oportunidades significativas.`;
      urgency = 'Crítico';
      riskLevel = 'Alto';
    } else if (strategicScore < 65) {
      scoreColor = 'text-orange-500';
      insight = `Hay oportunidades claras para optimizar. Tu eficiencia actual del ${currentEfficiency}% puede mejorar hasta ${potentialEfficiency}% con los ajustes correctos.`;
      urgency = 'Alto';
      riskLevel = 'Medio';
    } else {
      scoreColor = 'text-green-500';
      insight = `Buena base estratégica, pero aún puedes ser más eficiente. El sector ${industry} en Chile tiene un potencial del ${potentialEfficiency}%.`;
      urgency = 'Medio';
      riskLevel = 'Bajo';
    }

    return { 
      score: strategicScore, 
      scoreColor, 
      insight, 
      urgency, 
      efficiency: currentEfficiency, 
      growth_potential: growthPotential, 
      risk_level: riskLevel,
      benchmark,
      businessMaturity,
      channelEfficiency,
      challengePenalty
    };
  };

  const getMarketingMetrics = () => {
    const budget = businessData.monthlyBudget;
    const analysis = getAnalysis();
    const benchmark = analysis.benchmark;
    
    // ROI proyectado realista
    const efficiencyFactor = analysis.efficiency / 100;
    const projectedROI = Math.round(benchmark.baseROI * efficiencyFactor);
    const potentialROI = benchmark.baseROI;
    const roiGap = potentialROI - projectedROI;
    
    // Tasa de conversión ajustada
    const conversionRate = Math.round((benchmark.baseConversion * efficiencyFactor) * 10) / 10;
    const industryAvgConversion = benchmark.baseConversion;
    
    // Costo por lead ajustado por eficiencia
    const leadCost = Math.round(benchmark.baseCPL / Math.max(0.3, efficiencyFactor));
    const industryAvgLeadCost = benchmark.baseCPL;
    
    // Proyección mensual de leads basada en presupuesto
    const projectedLeads = Math.round(budget * 0.6 / leadCost); // 60% del presupuesto en adquisición
    const potentialLeads = Math.round(budget * 0.6 / industryAvgLeadCost);
    
    return {
      projected_roi: projectedROI,
      potential_roi: potentialROI,
      roi_gap: roiGap,
      conversion_rate: conversionRate,
      industry_avg_conversion: industryAvgConversion,
      lead_cost: leadCost,
      industry_avg_lead_cost: industryAvgLeadCost,
      projected_leads: projectedLeads,
      potential_leads: potentialLeads
    };
  };

  const getCompetitiveAnalysis = () => {
    const analysis = getAnalysis();
    const budget = businessData.monthlyBudget;
    
    // Análisis competitivo más sofisticado
    const competitivenessScore = (analysis.efficiency * 0.4) + (budget / 50000 * 0.3) + (analysis.score * 0.3);
    
    let marketSharePotential = 'Limitado';
    let competitiveAdvantage = 'Bajo';
    let timeToResults = '6-9 meses';
    
    if (competitivenessScore >= 70) {
      marketSharePotential = 'Alto';
      competitiveAdvantage = 'Alto';
      timeToResults = '2-4 meses';
    } else if (competitivenessScore >= 45) {
      marketSharePotential = 'Medio';
      competitiveAdvantage = 'Medio';
      timeToResults = '3-6 meses';
    }
    
    return { 
      market_share_potential: marketSharePotential, 
      competitive_advantage: competitiveAdvantage,
      time_to_results: timeToResults,
      competition_level: analysis.benchmark.competitionLevel
    };
  };

  const getBudgetAllocation = () => {
    const budget = businessData.monthlyBudget;
    const industry = businessData.industry;
    const primaryGoal = businessData.primaryGoal;
    
    // Asignación optimizada por industria y objetivo
    if (industry === 'E-commerce') {
      if (primaryGoal === 'Aumentar ventas') {
        return [
          { name: 'Google Ads', value: 45, color: '#1FA2FF' },
          { name: 'Facebook/Instagram Ads', value: 25, color: '#22c55e' },
          { name: 'Email Marketing', value: 20, color: '#f59e0b' },
          { name: 'SEO/Contenido', value: 10, color: '#8b5cf6' }
        ];
      }
    }
    
    if (industry === 'Servicios Profesionales') {
      return [
        { name: 'Google Ads', value: 40, color: '#1FA2FF' },
        { name: 'LinkedIn Ads', value: 25, color: '#22c55e' },
        { name: 'SEO Local', value: 20, color: '#f59e0b' },
        { name: 'Referidos/Networking', value: 15, color: '#8b5cf6' }
      ];
    }
    
    // Asignación por presupuesto como fallback
    if (budget < 400000) {
      return [
        { name: 'SEO/Contenido', value: 50, color: '#1FA2FF' },
        { name: 'Email Marketing', value: 30, color: '#22c55e' },
        { name: 'Redes Sociales', value: 20, color: '#f59e0b' }
      ];
    } else if (budget < 1600000) {
      return [
        { name: 'Google Ads', value: 45, color: '#1FA2FF' },
        { name: 'SEO/Contenido', value: 25, color: '#22c55e' },
        { name: 'Redes Sociales', value: 20, color: '#f59e0b' },
        { name: 'Email Marketing', value: 10, color: '#8b5cf6' }
      ];
    } else {
      return [
        { name: 'Publicidad Digital', value: 50, color: '#1FA2FF' },
        { name: 'Marketing Automation', value: 20, color: '#22c55e' },
        { name: 'Contenido/SEO', value: 15, color: '#f59e0b' },
        { name: 'Redes Sociales', value: 10, color: '#8b5cf6' },
        { name: 'Influencers', value: 5, color: '#ef4444' }
      ];
    }
  };

  const getRecommendations = () => {
    const analysis = getAnalysis();
    const metrics = getMarketingMetrics();
    const recs = [];

    // Recomendaciones personalizadas basadas en el análisis
    if (analysis.score < 50) {
      recs.push({
        title: 'Reestructuración estratégica urgente',
        impact: 'Crítico',
        description: `Con tu puntuación actual de ${analysis.score}/100, necesitas cambios fundamentales. Prioridad: optimizar canales de adquisición.`,
        icon: <AlertTriangle className="h-5 w-5" />,
        timeframe: '1-2 meses'
      });
    }

    if (businessData.currentChallenges.includes('Medir resultados')) {
      recs.push({
        title: 'Implementar sistema de medición',
        impact: 'Crítico',
        description: 'Sin métricas precisas es imposible optimizar. Instalar Google Analytics 4, Facebook Pixel y configurar conversiones.',
        icon: <BarChart3 className="h-5 w-5" />,
        timeframe: '2-3 semanas'
      });
    }

    if (metrics.roi_gap > 100) {
      recs.push({
        title: 'Optimización de ROI inmediata',
        impact: 'Alto',
        description: `Potencial de mejorar ROI en ${metrics.roi_gap}%. Enfocar en canales de mayor rendimiento para tu industria.`,
        icon: <TrendingUp className="h-5 w-5" />,
        timeframe: '1-3 meses'
      });
    }

    if (businessData.monthlyBudget < 800000 && businessData.primaryGoal === 'Aumentar ventas') {
      recs.push({
        title: 'Incrementar inversión estratégicamente',
        impact: 'Alto',
        description: 'Tu presupuesto actual limita el crecimiento. Considera aumentar gradualmente enfocándote en canales probados.',
        icon: <DollarSign className="h-5 w-5" />,
        timeframe: '2-4 meses'
      });
    }

    return recs.slice(0, 3);
  };

  const handleConsultationRequest = async () => {
    setIsRequesting(true);
    
    try {
      // Guardar en la base de datos
      const { error: dbError } = await supabase
        .from('consultation_requests')
        .insert({
          business_name: businessData.businessName,
          email: businessData.email
        });

      if (dbError) throw dbError;

      // Enviar email
      const response = await fetch('/functions/v1/send-consultation-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName: businessData.businessName,
          email: businessData.email
        })
      });

      if (!response.ok) throw new Error('Error sending email');

      setShowConfirmation(true);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Hubo un problema. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const analysis = getAnalysis();
  const metrics = getMarketingMetrics();
  const competitive = getCompetitiveAnalysis();
  const recommendations = getRecommendations();

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <Card className="hig-card max-w-md text-center">
          <CardContent className="p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-[#3E3E3E] mb-4">¡Solicitud Enviada!</h2>
            <p className="text-gray-600 mb-6">
              Te contactaremos pronto para agendar tu consultoría gratuita.
            </p>
            <Button 
              onClick={() => window.location.href = 'https://territorioux.cl'}
              className="hig-button-primary w-full"
            >
              Ir a TerritorioUX
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-semibold text-[#3E3E3E] mb-2">
                Análisis para {businessData.businessName}
              </h1>
              <p className="text-gray-600">Diagnóstico estratégico personalizado</p>
            </div>
            <Button variant="outline" onClick={onBackToStart} className="hig-button-secondary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Inicio
            </Button>
          </div>
        </div>

        {/* Score Card with explanation */}
        <Card className="hig-card mb-8 slide-in">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-[#3E3E3E] mb-2">Puntuación Estratégica</h3>
                <div className="flex items-center gap-4">
                  <span className={`text-4xl font-bold ${analysis.scoreColor}`}>
                    {analysis.score}/100
                  </span>
                  <Badge className={`${
                    analysis.urgency === 'Crítico' ? 'bg-red-100 text-red-700' :
                    analysis.urgency === 'Alto' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    Prioridad {analysis.urgency}
                  </Badge>
                </div>
                <p className="text-gray-600 mt-3">{analysis.insight}</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-orange-500" />
            </div>
            
            {/* Explanation of calculation */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-[#1FA2FF]" />
                <span className="text-sm font-medium text-[#3E3E3E]">Cómo calculamos tu puntuación</span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <p>• Presupuesto vs. benchmark industria: {Math.round((businessData.monthlyBudget / 100000) * 5)} pts</p>
                <p>• Eficiencia de canales actuales: {Math.round(analysis.channelEfficiency * 15)} pts</p>
                <p>• Penalización por desafíos: -{Math.round((1 - analysis.challengePenalty) * 100)}%</p>
                <p>• Benchmark industria {businessData.industry}: {analysis.benchmark.baseROI}% ROI promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics with better context */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hig-card slide-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Presupuesto Mensual</p>
                  <p className="text-2xl font-bold text-[#3E3E3E]">${(businessData.monthlyBudget / 1000).toFixed(0)}k</p>
                  <p className="text-xs text-gray-500">CLP • {businessData.industry}</p>
                </div>
                <DollarSign className="h-8 w-8 text-[#1FA2FF]" />
              </div>
            </CardContent>
          </Card>

          <Card className="hig-card slide-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Eficiencia Actual</p>
                  <p className="text-2xl font-bold text-[#3E3E3E]">{analysis.efficiency}%</p>
                  <p className="text-xs text-gray-500">vs. {Math.round(analysis.benchmark.maturityFactor * 100)}% óptimo</p>
                </div>
                <Activity className="h-8 w-8 text-[#1FA2FF]" />
              </div>
            </CardContent>
          </Card>

          <Card className="hig-card slide-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Potencial Crecimiento</p>
                  <p className="text-2xl font-bold text-[#3E3E3E]">{analysis.growth_potential}%</p>
                  <p className="text-xs text-gray-500">mejora proyectada</p>
                </div>
                <TrendingUp className="h-8 w-8 text-[#1FA2FF]" />
              </div>
            </CardContent>
          </Card>

          <Card className="hig-card slide-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Competencia</p>
                  <p className="text-2xl font-bold text-[#3E3E3E]">{competitive.competition_level}</p>
                  <p className="text-xs text-gray-500">nivel sector</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-[#1FA2FF]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ROI & Performance Metrics with explanations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hig-card slide-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-[#3E3E3E]">ROI Proyectado</h4>
                <Percent className="h-5 w-5 text-[#1FA2FF]" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tu ROI actual</span>
                  <span className="font-semibold">{metrics.projected_roi}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Potencial óptimo</span>
                  <span className="font-semibold text-green-600">{metrics.potential_roi}%</span>
                </div>
                <div className="pt-2 border-t">
                  <span className="text-sm font-medium text-orange-600">
                    Oportunidad: +{metrics.roi_gap}% ROI
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hig-card slide-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-[#3E3E3E]">Conversión</h4>
                <BarChart3 className="h-5 w-5 text-[#1FA2FF]" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tu tasa</span>
                  <span className="font-semibold">{metrics.conversion_rate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Promedio {businessData.industry}</span>
                  <span className="font-semibold">{metrics.industry_avg_conversion}%</span>
                </div>
                <div className="pt-2 border-t">
                  <span className={`text-sm font-medium ${
                    metrics.conversion_rate < metrics.industry_avg_conversion ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {metrics.conversion_rate < metrics.industry_avg_conversion ? 'Por debajo del promedio' : 'Sobre el promedio'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hig-card slide-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-[#3E3E3E]">Costo por Lead</h4>
                <DollarSign className="h-5 w-5 text-[#1FA2FF]" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tu CPL actual</span>
                  <span className="font-semibold">${(metrics.lead_cost / 1000).toFixed(0)}k</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Benchmark sector</span>
                  <span className="font-semibold">${(metrics.industry_avg_lead_cost / 1000).toFixed(0)}k</span>
                </div>
                <div className="pt-2 border-t">
                  <span className="text-sm text-gray-600">
                    Leads/mes proyectados: {metrics.projected_leads}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Budget Distribution */}
          <Card className="hig-card slide-in">
            <CardHeader>
              <CardTitle className="text-xl text-[#3E3E3E]">Distribución Óptima de Presupuesto</CardTitle>
              <p className="text-sm text-gray-600">Basado en tu industria y objetivo principal</p>
            </CardHeader>
            <CardContent>
              <BudgetChart data={getBudgetAllocation()} />
            </CardContent>
          </Card>

          {/* Competitive Analysis Enhanced */}
          <Card className="hig-card slide-in">
            <CardHeader>
              <CardTitle className="text-xl text-[#3E3E3E]">Análisis Competitivo</CardTitle>
              <p className="text-sm text-gray-600">Posición en el mercado {businessData.industry}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-[#3E3E3E]">Potencial de Mercado</span>
                  <Badge className={`${
                    competitive.market_share_potential === 'Alto' ? 'bg-green-100 text-green-700' :
                    competitive.market_share_potential === 'Medio' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {competitive.market_share_potential}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">Capacidad de capturar cuota de mercado</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-[#3E3E3E]">Ventaja Competitiva</span>
                  <Badge className={`${
                    competitive.competitive_advantage === 'Alto' ? 'bg-green-100 text-green-700' :
                    competitive.competitive_advantage === 'Medio' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {competitive.competitive_advantage}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">Diferenciación vs. competidores directos</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-[#3E3E3E]">Tiempo a Resultados</span>
                  <Badge className="bg-[#1FA2FF] text-white">{competitive.time_to_results}</Badge>
                </div>
                <p className="text-sm text-gray-600">Para ver mejoras significativas</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Recommendations */}
        <Card className="hig-card slide-in mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-[#3E3E3E]">Acciones Prioritarias Personalizadas</CardTitle>
            <p className="text-sm text-gray-600">Basadas en tu análisis específico</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {rec.icon}
                    <div>
                      <h4 className="font-medium text-[#3E3E3E]">{rec.title}</h4>
                      <span className="text-xs text-gray-500">Tiempo estimado: {rec.timeframe}</span>
                    </div>
                  </div>
                  <Badge className="bg-[#1FA2FF] text-white">{rec.impact}</Badge>
                </div>
                <p className="text-sm text-gray-600">{rec.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="hig-card slide-in">
          <CardContent className="p-8 text-center">
            <Phone className="h-12 w-12 mx-auto text-[#1FA2FF] mb-4" />
            <h2 className="text-2xl font-semibold text-[#3E3E3E] mb-4">
              ¿Listo para implementar estas mejoras?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Nuestro equipo puede implementar estas recomendaciones específicas y generar los resultados proyectados en tu análisis.
            </p>
            <Button 
              onClick={handleConsultationRequest}
              disabled={isRequesting}
              className="hig-button-primary text-lg px-8 py-4"
            >
              {isRequesting ? 'Enviando...' : 'Agendar Consultoría Gratuita'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
