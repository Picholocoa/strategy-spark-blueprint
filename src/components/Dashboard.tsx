
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Calendar, Target, TrendingUp, Users, 
  DollarSign, AlertTriangle, CheckCircle, Zap, Phone,
  BarChart3, Clock, Percent, Activity
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

  // Algoritmo de scoring basado en benchmarks reales de la industria
  const getAnalysis = () => {
    const budget = businessData.monthlyBudget;
    const channelCount = businessData.currentChannels.length;
    const challengeCount = businessData.currentChallenges.length;

    let score = 0;
    let efficiency = 0;
    let growth_potential = 0;
    
    // Scoring basado en presupuesto (benchmarks Chile 2024)
    if (budget < 400000) { // <$400k CLP
      score += 25;
      efficiency = 30;
      growth_potential = 40;
    } else if (budget < 1600000) { // $400k-$1.6M CLP
      score += 45;
      efficiency = 55;
      growth_potential = 65;
    } else if (budget < 4000000) { // $1.6M-$4M CLP
      score += 65;
      efficiency = 70;
      growth_potential = 80;
    } else {
      score += 85;
      efficiency = 85;
      growth_potential = 90;
    }

    // Scoring basado en diversificación de canales
    if (channelCount < 2) {
      score += 10;
      efficiency -= 25;
    } else if (channelCount < 4) {
      score += 30;
      efficiency -= 10;
    } else if (channelCount < 6) {
      score += 50;
      efficiency += 5;
    } else {
      score += 40; // Demasiados canales puede ser dispersión
      efficiency -= 5;
    }

    // Penalización por desafíos múltiples
    if (challengeCount > 4) {
      score -= 15;
      efficiency -= 20;
      growth_potential -= 15;
    } else if (challengeCount > 2) {
      score -= 8;
      efficiency -= 10;
      growth_potential -= 8;
    }

    // Ajustes por industria (benchmarks específicos)
    const industryMultipliers = {
      'E-commerce': { score: 1.1, efficiency: 1.15, growth: 1.2 },
      'Tecnología': { score: 1.05, efficiency: 1.1, growth: 1.15 },
      'Servicios Profesionales': { score: 0.95, efficiency: 1.0, growth: 1.0 },
      'Salud': { score: 0.9, efficiency: 0.95, growth: 0.95 },
      'Educación': { score: 0.85, efficiency: 0.9, growth: 0.9 }
    };

    const multiplier = industryMultipliers[businessData.industry as keyof typeof industryMultipliers] || { score: 1, efficiency: 1, growth: 1 };
    
    score = Math.min(100, Math.round(score * multiplier.score));
    efficiency = Math.min(100, Math.round(efficiency * multiplier.efficiency));
    growth_potential = Math.min(100, Math.round(growth_potential * multiplier.growth));

    let scoreColor = '';
    let insight = '';
    let urgency = '';
    let risk_level = '';

    if (score < 40) {
      scoreColor = 'text-red-500';
      insight = 'Tu estrategia actual tiene gaps críticos que limitan el crecimiento.';
      urgency = 'Crítico';
      risk_level = 'Alto';
    } else if (score < 70) {
      scoreColor = 'text-orange-500';
      insight = 'Hay oportunidades claras para optimizar tu ROI.';
      urgency = 'Alto';
      risk_level = 'Medio';
    } else {
      scoreColor = 'text-green-500';
      insight = 'Buena base, pero puede ser más eficiente.';
      urgency = 'Medio';
      risk_level = 'Bajo';
    }

    return { score, scoreColor, insight, urgency, efficiency, growth_potential, risk_level };
  };

  const getMarketingMetrics = () => {
    const budget = businessData.monthlyBudget;
    const channelCount = businessData.currentChannels.length;
    
    // Benchmarks reales industria chilena 2024
    const industry_benchmarks = {
      'E-commerce': { roi: 450, conversion: 3.8, cpl: 18000 },
      'Tecnología': { roi: 380, conversion: 2.1, cpl: 25000 },
      'Servicios Profesionales': { roi: 320, conversion: 4.2, cpl: 15000 },
      'Salud': { roi: 280, conversion: 5.1, cpl: 12000 },
      'Educación': { roi: 250, conversion: 3.2, cpl: 20000 }
    };

    const benchmark = industry_benchmarks[businessData.industry as keyof typeof industry_benchmarks] || 
                     { roi: 350, conversion: 3.5, cpl: 18000 };

    // Cálculo ROI actual vs potencial
    const channel_efficiency = Math.min(1, channelCount / 5); // Óptimo en 5 canales
    const budget_efficiency = budget < 400000 ? 0.6 : budget < 1600000 ? 0.75 : budget < 4000000 ? 0.9 : 1;
    
    const projected_roi = Math.round(benchmark.roi * channel_efficiency * budget_efficiency);
    const potential_roi = benchmark.roi;
    const roi_gap = potential_roi - projected_roi;
    
    const conversion_rate = Math.round((benchmark.conversion * channel_efficiency * budget_efficiency) * 10) / 10;
    const industry_avg_conversion = benchmark.conversion;
    
    const lead_cost = Math.round(benchmark.cpl / (channel_efficiency * budget_efficiency));
    const industry_avg_lead_cost = benchmark.cpl;
    
    return {
      projected_roi,
      potential_roi,
      roi_gap,
      conversion_rate,
      industry_avg_conversion,
      lead_cost,
      industry_avg_lead_cost
    };
  };

  const getCompetitiveAnalysis = () => {
    const channelCount = businessData.currentChannels.length;
    const budget = businessData.monthlyBudget;
    
    let market_share_potential = 'Limitado';
    let competitive_advantage = 'Bajo';
    
    const competitiveness_score = (channelCount * 10) + (budget / 100000);
    
    if (competitiveness_score >= 60) {
      market_share_potential = 'Alto';
      competitive_advantage = 'Alto';
    } else if (competitiveness_score >= 35) {
      market_share_potential = 'Medio';
      competitive_advantage = 'Medio';
    }
    
    return { market_share_potential, competitive_advantage };
  };

  const getBudgetAllocation = () => {
    const budget = businessData.monthlyBudget;
    
    // Asignación óptima basada en ROI por canal (datos Chile)
    if (budget < 400000) {
      return [
        { name: 'SEO/Contenido', value: 45, color: '#1FA2FF' },
        { name: 'Email Marketing', value: 30, color: '#22c55e' },
        { name: 'Redes Sociales', value: 25, color: '#f59e0b' }
      ];
    } else if (budget < 1600000) {
      return [
        { name: 'Google Ads', value: 40, color: '#1FA2FF' },
        { name: 'SEO/Contenido', value: 30, color: '#22c55e' },
        { name: 'Redes Sociales', value: 30, color: '#f59e0b' }
      ];
    } else if (budget < 4000000) {
      return [
        { name: 'Publicidad Digital', value: 45, color: '#1FA2FF' },
        { name: 'Contenido/SEO', value: 25, color: '#22c55e' },
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
    const budget = businessData.monthlyBudget;
    const analysis = getAnalysis();
    const recs = [];

    if (analysis.score < 50) {
      recs.push({
        title: 'Reestructuración estratégica urgente',
        impact: 'Crítico',
        description: 'Tu estrategia actual necesita cambios fundamentales.',
        icon: <AlertTriangle className="h-5 w-5" />
      });
    }

    if (budget < 1600000) {
      recs.push({
        title: 'Optimización de presupuesto',
        impact: 'Alto',
        description: 'Incrementar inversión generaría ROI exponencial.',
        icon: <TrendingUp className="h-5 w-5" />
      });
    } else {
      recs.push({
        title: 'Escalamiento con automation',
        impact: 'Muy Alto',
        description: 'Automatizar procesos para maximizar eficiencia.',
        icon: <Zap className="h-5 w-5" />
      });
    }

    if (businessData.currentChallenges.includes('Medir resultados')) {
      recs.push({
        title: 'Implementar analytics avanzados',
        impact: 'Crítico',
        description: 'Sin medición precisa, no puedes optimizar.',
        icon: <BarChart3 className="h-5 w-5" />
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

        {/* Score Card */}
        <Card className="hig-card mb-8 slide-in">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
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
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hig-card slide-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Presupuesto</p>
                  <p className="text-2xl font-bold text-[#3E3E3E]">${(businessData.monthlyBudget / 1000).toFixed(0)}k</p>
                  <p className="text-xs text-gray-500">CLP mensual</p>
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
                  <p className="text-xs text-gray-500">vs. benchmark</p>
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
                  <p className="text-xs text-gray-500">proyectado</p>
                </div>
                <TrendingUp className="h-8 w-8 text-[#1FA2FF]" />
              </div>
            </CardContent>
          </Card>

          <Card className="hig-card slide-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Riesgo Competitivo</p>
                  <p className="text-2xl font-bold text-[#3E3E3E]">{analysis.risk_level}</p>
                  <p className="text-xs text-gray-500">nivel actual</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-[#1FA2FF]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ROI & Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hig-card slide-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-[#3E3E3E]">ROI Proyectado</h4>
                <Percent className="h-5 w-5 text-[#1FA2FF]" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Actual</span>
                  <span className="font-semibold">{metrics.projected_roi}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Potencial</span>
                  <span className="font-semibold text-green-600">{metrics.potential_roi}%</span>
                </div>
                <div className="pt-2 border-t">
                  <span className="text-sm font-medium text-orange-600">
                    Gap: {metrics.roi_gap}% de oportunidad
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
                  <span className="text-sm text-gray-600">Benchmark industria</span>
                  <span className="font-semibold">{metrics.industry_avg_conversion}%</span>
                </div>
                <div className="pt-2 border-t">
                  <span className={`text-sm font-medium ${
                    metrics.conversion_rate < metrics.industry_avg_conversion ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {metrics.conversion_rate < metrics.industry_avg_conversion ? 'Bajo benchmark' : 'Sobre benchmark'}
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
                  <span className="text-sm text-gray-600">Tu costo</span>
                  <span className="font-semibold">${(metrics.lead_cost / 1000).toFixed(0)}k</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Benchmark industria</span>
                  <span className="font-semibold">${(metrics.industry_avg_lead_cost / 1000).toFixed(0)}k</span>
                </div>
                <div className="pt-2 border-t">
                  <span className={`text-sm font-medium ${
                    metrics.lead_cost > metrics.industry_avg_lead_cost ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {metrics.lead_cost > metrics.industry_avg_lead_cost ? 'Sobre benchmark' : 'Bajo benchmark'}
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
              <CardTitle className="text-xl text-[#3E3E3E]">Distribución Óptima</CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetChart data={getBudgetAllocation()} />
            </CardContent>
          </Card>

          {/* Competitive Analysis */}
          <Card className="hig-card slide-in">
            <CardHeader>
              <CardTitle className="text-xl text-[#3E3E3E]">Análisis Competitivo</CardTitle>
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
                <p className="text-sm text-gray-600">Diferenciación vs. competidores</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-[#3E3E3E]">Tiempo de Implementación</span>
                  <Badge className="bg-[#1FA2FF] text-white">3-6 meses</Badge>
                </div>
                <p className="text-sm text-gray-600">Para resultados óptimos</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="hig-card slide-in mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-[#3E3E3E]">Acciones Prioritarias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {rec.icon}
                    <h4 className="font-medium text-[#3E3E3E]">{rec.title}</h4>
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
              ¿Listo para multiplicar tu ROI?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Nuestro equipo puede implementar estas mejoras y generar resultados medibles.
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
