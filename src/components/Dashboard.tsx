
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Calendar, Target, TrendingUp, Users, 
  DollarSign, AlertTriangle, CheckCircle, Zap, Phone,
  BarChart3, Clock, Percent, Activity, Info, HelpCircle,
  PlayCircle, CheckSquare, Timer
} from 'lucide-react';
import { BusinessData } from '@/pages/Index';
import { BudgetChart } from '@/components/BudgetChart';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DashboardProps {
  businessData: BusinessData;
  onBackToStart: () => void;
}

// Benchmarks actualizados del mercado chileno 2025
const industryBenchmarks = {
  'E-commerce': { 
    baseConversion: 2.8,
    avgTicket: 45000,
    customerLifetime: 8,
    competitionLevel: 'Alto'
  },
  'Servicios Profesionales': { 
    baseConversion: 4.2,
    avgTicket: 280000,
    customerLifetime: 18,
    competitionLevel: 'Medio'
  },
  'Tecnología': { 
    baseConversion: 1.8,
    avgTicket: 150000,
    customerLifetime: 24,
    competitionLevel: 'Muy Alto'
  },
  'Salud': { 
    baseConversion: 3.5,
    avgTicket: 65000,
    customerLifetime: 12,
    competitionLevel: 'Alto'
  },
  'Educación': { 
    baseConversion: 2.1,
    avgTicket: 120000,
    customerLifetime: 6,
    competitionLevel: 'Medio'
  }
};

export const Dashboard = ({ businessData, onBackToStart }: DashboardProps) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();

  // Algoritmo mejorado y transparente
  const getAnalysis = () => {
    const budget = businessData.monthlyBudget;
    const channelCount = businessData.currentChannels.length;
    const challengeCount = businessData.currentChallenges.length;
    const industry = businessData.industry;
    const primaryGoal = businessData.primaryGoal;

    // Si no hay presupuesto, usar lógica especial
    if (budget === 0) {
      return {
        score: 25,
        scoreColor: 'text-red-500',
        insight: 'Sin presupuesto definido, es difícil proyectar resultados específicos. Te recomendamos definir un rango de inversión para generar un análisis más preciso.',
        urgency: 'Crítico',
        efficiency: 20,
        growth_potential: 75,
        risk_level: 'Alto',
        hasBudget: false,
        explanation: 'Sin presupuesto no podemos calcular ROI ni métricas específicas. Necesitamos conocer tu inversión para proyectar resultados realistas.'
      };
    }

    const benchmark = industryBenchmarks[industry as keyof typeof industryBenchmarks] || 
                     industryBenchmarks['Servicios Profesionales'];

    // Factor de madurez digital basado en presupuesto
    let digitalMaturity = 0.3;
    if (budget >= 600000) digitalMaturity = 0.5;
    if (budget >= 1200000) digitalMaturity = 0.7;
    if (budget >= 2800000) digitalMaturity = 0.9;

    // Eficiencia de canales
    const optimalChannelsForIndustry = {
      'E-commerce': ['Google Ads', 'Facebook Ads', 'Instagram', 'Email Marketing'],
      'Servicios Profesionales': ['Google Ads', 'LinkedIn Ads', 'SEO', 'Referidos'],
      'Tecnología': ['LinkedIn Ads', 'Google Ads', 'SEO', 'Referidos'],
      'Salud': ['Google Ads', 'Facebook Ads', 'SEO', 'Referidos'],
      'Educación': ['Facebook Ads', 'Instagram', 'Google Ads', 'Email Marketing']
    };

    const optimalChannels = optimalChannelsForIndustry[industry as keyof typeof optimalChannelsForIndustry] || 
                           optimalChannelsForIndustry['Servicios Profesionales'];

    const currentOptimalChannels = businessData.currentChannels.filter(c => 
      optimalChannels.includes(c) && c !== 'Ninguno actualmente'
    );
    const channelEfficiency = Math.min(currentOptimalChannels.length / 2, 1);

    // Penalizaciones por desafíos
    let challengePenalty = 1.0;
    const criticalChallenges = ['Medir resultados', 'Generar leads de calidad'];
    const hasCriticalChallenges = businessData.currentChallenges.some(c => criticalChallenges.includes(c));
    if (hasCriticalChallenges) challengePenalty -= 0.2;
    if (challengeCount > 4) challengePenalty -= 0.1;

    // Score estratégico
    let strategicScore = 30;
    strategicScore += digitalMaturity * 25;
    strategicScore += channelEfficiency * 20;
    strategicScore += (primaryGoal === 'Aumentar ventas' ? 5 : 0);
    strategicScore *= challengePenalty;
    strategicScore = Math.min(85, Math.max(15, Math.round(strategicScore)));

    // Eficiencia actual
    const currentEfficiency = Math.round(digitalMaturity * channelEfficiency * challengePenalty * 100);
    
    // Potencial de crecimiento
    const maxPotential = 75;
    const growthPotential = Math.min(65, Math.round(maxPotential - currentEfficiency));

    // Colores e insights
    let scoreColor = '';
    let insight = '';
    let urgency = '';

    if (strategicScore < 40) {
      scoreColor = 'text-red-500';
      insight = `Tu estrategia necesita mejoras fundamentales. Con ${channelCount} canales y varios desafíos pendientes, hay oportunidades claras de crecimiento.`;
      urgency = 'Alto';
    } else if (strategicScore < 60) {
      scoreColor = 'text-orange-500';
      insight = `Tienes una base sólida pero hay espacio para optimizar. Tu eficiencia actual del ${currentEfficiency}% puede mejorar significativamente.`;
      urgency = 'Medio';
    } else {
      scoreColor = 'text-green-500';
      insight = `Buen desempeño general. Con algunas optimizaciones puedes alcanzar el ${currentEfficiency + growthPotential}% de eficiencia.`;
      urgency = 'Bajo';
    }

    return { 
      score: strategicScore, 
      scoreColor, 
      insight, 
      urgency, 
      efficiency: currentEfficiency, 
      growth_potential: growthPotential,
      risk_level: urgency === 'Alto' ? 'Alto' : 'Medio',
      benchmark,
      digitalMaturity,
      channelEfficiency,
      challengePenalty,
      hasBudget: true,
      explanation: `Basado en presupuesto ${(budget/1000).toFixed(0)}k, ${channelCount} canales activos, madurez digital ${Math.round(digitalMaturity*100)}%, y eficiencia de canales ${Math.round(channelEfficiency*100)}%.`
    };
  };

  const getMarketingMetrics = () => {
    const budget = businessData.monthlyBudget;
    const analysis = getAnalysis();
    
    if (!analysis.hasBudget) {
      return {
        projected_leads: 'N/A',
        lead_cost: 'N/A',
        conversion_rate: 'N/A',
        projected_revenue: 'N/A',
        roi_projection: 'N/A',
        explanation: 'Sin presupuesto definido no podemos calcular métricas específicas.'
      };
    }

    const benchmark = analysis.benchmark;
    const efficiencyFactor = analysis.efficiency / 100;
    
    // Cálculos más realistas
    const adSpendPortion = budget * 0.7;
    const avgCostPerClick = 450;
    const clicksPerMonth = Math.round(adSpendPortion / avgCostPerClick);
    
    const conversionRate = benchmark.baseConversion * efficiencyFactor;
    const projectedLeads = Math.round(clicksPerMonth * (conversionRate / 100));
    
    const leadCost = projectedLeads > 0 ? Math.round(adSpendPortion / projectedLeads) : 0;
    
    const closeRate = 0.15;
    const newCustomers = Math.round(projectedLeads * closeRate);
    const monthlyRevenue = newCustomers * benchmark.avgTicket;
    
    const roi = budget > 0 ? Math.round(((monthlyRevenue - budget) / budget) * 100) : 0;
    
    return {
      projected_leads: projectedLeads,
      lead_cost: leadCost,
      conversion_rate: Math.round(conversionRate * 10) / 10,
      projected_revenue: monthlyRevenue,
      roi_projection: roi,
      clicks_per_month: clicksPerMonth,
      close_rate: Math.round(closeRate * 100),
      explanation: `Basado en CPC $${avgCostPerClick}, conversión ${conversionRate.toFixed(1)}%, cierre ${Math.round(closeRate*100)}%, ticket ${Math.round(benchmark.avgTicket/1000)}k.`
    };
  };

  const getCompetitiveAnalysis = () => {
    const analysis = getAnalysis();
    const budget = businessData.monthlyBudget;
    
    if (!analysis.hasBudget) {
      return {
        market_share_potential: 'Indefinido',
        competitive_advantage: 'Indefinido',
        time_to_results: 'Indefinido',
        competition_level: 'N/A'
      };
    }
    
    const competitivenessScore = analysis.efficiency;
    
    let marketSharePotential = 'Limitado';
    let competitiveAdvantage = 'Bajo';
    let timeToResults = '6-12 meses';
    
    if (competitivenessScore >= 60 && budget >= 1200000) {
      marketSharePotential = 'Alto';
      competitiveAdvantage = 'Alto';
      timeToResults = '3-6 meses';
    } else if (competitivenessScore >= 40 && budget >= 600000) {
      marketSharePotential = 'Medio';
      competitiveAdvantage = 'Medio';
      timeToResults = '4-8 meses';
    }
    
    return { 
      market_share_potential: marketSharePotential, 
      competitive_advantage: competitiveAdvantage,
      time_to_results: timeToResults,
      competition_level: analysis.benchmark?.competitionLevel || 'Medio'
    };
  };

  const getBudgetAllocation = () => {
    const budget = businessData.monthlyBudget;
    const industry = businessData.industry;
    
    if (budget === 0) {
      return [
        { name: 'Definir presupuesto', value: 100, color: '#ef4444' }
      ];
    }
    
    // Asignación optimizada por industria y presupuesto
    if (industry === 'E-commerce') {
      if (budget >= 1200000) {
        return [
          { name: 'Google Ads', value: 40, color: '#1FA2FF' },
          { name: 'Facebook/Instagram', value: 30, color: '#22c55e' },
          { name: 'Email Marketing', value: 15, color: '#f59e0b' },
          { name: 'SEO/Contenido', value: 15, color: '#8b5cf6' }
        ];
      } else {
        return [
          { name: 'Facebook/Instagram', value: 50, color: '#22c55e' },
          { name: 'Google Ads', value: 30, color: '#1FA2FF' },
          { name: 'Email Marketing', value: 20, color: '#f59e0b' }
        ];
      }
    }
    
    if (industry === 'Servicios Profesionales') {
      return [
        { name: 'Google Ads', value: 45, color: '#1FA2FF' },
        { name: 'LinkedIn Ads', value: 25, color: '#22c55e' },
        { name: 'SEO Local', value: 20, color: '#f59e0b' },
        { name: 'Referidos', value: 10, color: '#8b5cf6' }
      ];
    }
    
    // Asignación conservadora para presupuestos pequeños
    if (budget < 600000) {
      return [
        { name: 'SEO/Contenido', value: 40, color: '#1FA2FF' },
        { name: 'Redes Sociales', value: 35, color: '#22c55e' },
        { name: 'Email Marketing', value: 25, color: '#f59e0b' }
      ];
    }
    
    // Fallback general
    return [
      { name: 'Publicidad Digital', value: 50, color: '#1FA2FF' },
      { name: 'Contenido/SEO', value: 25, color: '#22c55e' },
      { name: 'Email/Automation', value: 15, color: '#f59e0b' },
      { name: 'Otros canales', value: 10, color: '#8b5cf6' }
    ];
  };

  const getDetailedRecommendations = () => {
    const analysis = getAnalysis();
    const metrics = getMarketingMetrics();
    const budget = businessData.monthlyBudget;
    const recs = [];

    if (!analysis.hasBudget) {
      recs.push({
        title: 'Definir presupuesto de marketing',
        priority: 'Crítico',
        description: 'Sin presupuesto definido no podemos generar proyecciones específicas ni recomendaciones de canales.',
        actions: [
          'Analizar ingresos actuales y definir % para marketing (recomendado: 5-15%)',
          'Investigar costos promedio en tu industria',
          'Comenzar con presupuesto mínimo de $400.000 mensuales'
        ],
        timeframe: 'Esta semana',
        impact: 'Permite planificación estratégica real',
        icon: <DollarSign className="h-5 w-5" />
      });
      return recs;
    }

    // Recomendaciones específicas basadas en análisis
    if (businessData.currentChallenges.includes('Medir resultados')) {
      recs.push({
        title: 'Implementar sistema de medición completo',
        priority: 'Crítico',
        description: 'Sin medición adecuada, es imposible optimizar campañas y ROI.',
        actions: [
          'Configurar Google Analytics 4 con eventos de conversión',
          'Instalar Facebook Pixel y configurar seguimiento',
          'Crear dashboard en Google Data Studio',
          'Definir KPIs principales: CAC, LTV, ROAS'
        ],
        timeframe: '2-3 semanas',
        impact: 'Mejora ROI en 25-40% mediante optimización',
        icon: <BarChart3 className="h-5 w-5" />
      });
    }

    if (analysis.channelEfficiency < 0.5 || businessData.currentChannels.includes('Ninguno actualmente')) {
      const optimalChannels = {
        'E-commerce': 'Google Ads + Facebook/Instagram',
        'Servicios Profesionales': 'Google Ads + LinkedIn',
        'Tecnología': 'LinkedIn + Google Ads',
        'Salud': 'Google Ads + SEO local',
        'Educación': 'Facebook + Instagram'
      };
      
      recs.push({
        title: 'Optimizar mix de canales de marketing',
        priority: 'Alto',
        description: `Para ${businessData.industry}, los canales más efectivos son diferentes a los que usas actualmente.`,
        actions: [
          `Priorizar: ${optimalChannels[businessData.industry as keyof typeof optimalChannels] || 'Google Ads + Redes Sociales'}`,
          'Pausar canales con bajo rendimiento',
          'Redistribuir 70% del presupuesto a canales top',
          'Testear nuevos canales con 20% del presupuesto'
        ],
        timeframe: '1-2 meses',
        impact: `Potencial mejora de ${Math.round((1 - analysis.channelEfficiency) * 50)}% en eficiencia`,
        icon: <Target className="h-5 w-5" />
      });
    }

    if (businessData.monthlyBudget < 600000 && businessData.primaryGoal === 'Aumentar ventas') {
      recs.push({
        title: 'Evaluar incremento estratégico de inversión',
        priority: 'Medio',
        description: 'Con el presupuesto actual será difícil competir efectivamente en tu mercado.',
        actions: [
          'Calcular LTV promedio de clientes actuales',
          'Definir CAC objetivo (máximo 30% del LTV)',
          'Aumentar gradualmente: +50% primer mes, evaluar resultados',
          'Considerar financiamiento para marketing si ROI > 200%'
        ],
        timeframe: '3-6 meses',
        impact: 'Acceso a mayor volumen de leads cualificados',
        icon: <TrendingUp className="h-5 w-5" />
      });
    }

    if (businessData.currentChallenges.includes('Generar leads de calidad')) {
      recs.push({
        title: 'Mejorar calidad de leads y conversiones',
        priority: 'Alto',
        description: 'Optimizar el funnel completo desde tráfico hasta venta.',
        actions: [
          'Crear landing pages específicas por canal',
          'Implementar lead scoring automático',
          'Desarrollar secuencia de email nurturing',
          'A/B testear formularios y CTAs'
        ],
        timeframe: '4-6 semanas',
        impact: 'Mejora tasa de conversión en 15-30%',
        icon: <Users className="h-5 w-5" />
      });
    }

    if (businessData.currentChallenges.includes('Crear contenido consistente')) {
      recs.push({
        title: 'Crear sistema de contenido escalable',
        priority: 'Medio',
        description: 'El contenido consistente es clave para mantener engagement y autoridad.',
        actions: [
          'Desarrollar calendario editorial mensual',
          'Crear templates reutilizables',
          'Definir 3-5 pilares de contenido principales',
          'Automatizar publicación con herramientas como Buffer'
        ],
        timeframe: '3-4 semanas',
        impact: 'Reduce tiempo de creación en 60% y mejora consistencia',
        icon: <CheckSquare className="h-5 w-5" />
      });
    }

    return recs.slice(0, 4); // Máximo 4 recomendaciones principales
  };

  const handleConsultationRequest = async () => {
    setIsRequesting(true);
    
    try {
      const { error: dbError } = await supabase
        .from('consultation_requests')
        .insert({
          business_name: businessData.businessName,
          email: businessData.email
        });

      if (dbError) throw dbError;

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
  const recommendations = getDetailedRecommendations();

  // Función para formatear números con color rojo si son negativos
  const formatNumberWithColor = (num: number | string, isPercentage: boolean = false) => {
    if (num === 'N/A' || num === null || num === undefined) return 'N/A';
    
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    const isNegative = numValue < 0;
    const colorClass = isNegative ? 'text-red-500' : 'text-[#3E3E3E]';
    const formattedNum = isPercentage ? `${numValue}%` : numValue;
    
    return <span className={colorClass}>{formattedNum}</span>;
  };

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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-[#3E3E3E] mb-2">Puntuación Estratégica</h3>
                <div className="flex items-center gap-4">
                  <span className={`text-4xl font-bold ${analysis.scoreColor}`}>
                    {analysis.score}/100
                  </span>
                  <Badge className={`${
                    analysis.urgency === 'Alto' ? 'bg-red-100 text-red-700' :
                    analysis.urgency === 'Medio' ? 'bg-orange-100 text-orange-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    Prioridad {analysis.urgency}
                  </Badge>
                </div>
                <p className="text-gray-600 mt-3">{analysis.insight}</p>
              </div>
              <HelpCircle className="h-12 w-12 text-[#1FA2FF]" />
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-[#1FA2FF]" />
                <span className="text-sm font-medium text-[#3E3E3E]">Cómo calculamos tu puntuación</span>
              </div>
              <div className="text-xs text-gray-600">
                <p>{analysis.explanation}</p>
                {analysis.hasBudget && (
                  <div className="mt-2 space-y-1">
                    <p>• Madurez digital: {Math.round(analysis.digitalMaturity * 100)}% (basado en presupuesto)</p>
                    <p>• Eficiencia canales: {Math.round(analysis.channelEfficiency * 100)}% (canales óptimos activos)</p>
                    <p>• Penalización desafíos: -{Math.round((1 - analysis.challengePenalty) * 100)}%</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hig-card slide-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Presupuesto Mensual</p>
                  <p className="text-2xl font-bold text-[#3E3E3E]">
                    {businessData.monthlyBudget === 0 ? 'No definido' : `$${Math.round(businessData.monthlyBudget / 1000)}k`}
                  </p>
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
                  <p className="text-sm text-gray-600">Leads Proyectados</p>
                  <p className="text-2xl font-bold text-[#3E3E3E]">{metrics.projected_leads}</p>
                  <p className="text-xs text-gray-500">por mes</p>
                </div>
                <Users className="h-8 w-8 text-[#1FA2FF]" />
              </div>
            </CardContent>
          </Card>

          <Card className="hig-card slide-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">ROI Proyectado</p>
                  <p className="text-2xl font-bold">
                    {metrics.roi_projection === 'N/A' ? 'N/A' : formatNumberWithColor(metrics.roi_projection, true)}
                  </p>
                  <p className="text-xs text-gray-500">retorno mensual</p>
                </div>
                <TrendingUp className="h-8 w-8 text-[#1FA2FF]" />
              </div>
            </CardContent>
          </Card>

          <Card className="hig-card slide-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Costo por Lead</p>
                  <p className="text-2xl font-bold text-[#3E3E3E]">
                    {metrics.lead_cost === 'N/A' ? 'N/A' : `$${Math.round(Number(metrics.lead_cost) / 1000)}k`}
                  </p>
                  <p className="text-xs text-gray-500">promedio estimado</p>
                </div>
                <Target className="h-8 w-8 text-[#1FA2FF]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Budget Distribution */}
          <Card className="hig-card slide-in">
            <CardHeader>
              <CardTitle className="text-xl text-[#3E3E3E]">
                {businessData.monthlyBudget === 0 ? 'Recomendación de Presupuesto' : 'Distribución Óptima de Presupuesto'}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {businessData.monthlyBudget === 0 
                  ? 'Necesitas definir un presupuesto para continuar'
                  : 'Basado en tu industria y objetivo principal'
                }
              </p>
            </CardHeader>
            <CardContent>
              <BudgetChart data={getBudgetAllocation()} />
            </CardContent>
          </Card>

          {/* Competitive Analysis */}
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

        {/* Plan de Acción Personalizado */}
        <Card className="hig-card slide-in mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-[#3E3E3E] flex items-center gap-2">
              <PlayCircle className="h-6 w-6 text-[#1FA2FF]" />
              Plan de Acción Personalizado
            </CardTitle>
            <p className="text-sm text-gray-600">Pasos específicos y accionables para tu situación</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {recommendations.map((rec, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {rec.icon}
                    <div>
                      <h4 className="font-semibold text-[#3E3E3E] text-lg">{rec.title}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <Badge className={`${
                          rec.priority === 'Crítico' ? 'bg-red-100 text-red-700' :
                          rec.priority === 'Alto' ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {rec.priority}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Timer className="h-4 w-4 mr-1" />
                          {rec.timeframe}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{rec.description}</p>
                
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <h5 className="font-medium text-[#3E3E3E] mb-2">Acciones específicas:</h5>
                  <ul className="space-y-2">
                    {rec.actions.map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-start gap-2 text-sm">
                        <CheckSquare className="h-4 w-4 text-[#1FA2FF] mt-0.5 flex-shrink-0" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    <strong>Impacto esperado:</strong> {rec.impact}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="hig-card slide-in">
          <CardContent className="p-8 text-center">
            <Phone className="h-12 w-12 mx-auto text-[#1FA2FF] mb-4" />
            <h2 className="text-2xl font-semibold text-[#3E3E3E] mb-4">
              ¿Quieres implementar estas mejoras?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Podemos ayudarte a implementar estas recomendaciones específicas y generar los resultados proyectados.
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
