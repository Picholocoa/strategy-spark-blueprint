
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Users, 
  DollarSign, 
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  Zap
} from 'lucide-react';
import { BusinessData } from '@/pages/Index';

interface DashboardProps {
  businessData: BusinessData;
  onBackToStart: () => void;
}

export const Dashboard = ({ businessData, onBackToStart }: DashboardProps) => {
  console.log('Dashboard rendering with data:', businessData);

  // Verificar que tenemos los datos necesarios
  if (!businessData) {
    console.error('No business data provided to Dashboard');
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Error al cargar datos</h2>
              <p className="text-gray-600 mb-4">No se pudieron cargar los datos del análisis.</p>
              <Button onClick={onBackToStart}>Volver al inicio</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Cálculos seguros con validaciones
  const calculateMetrics = () => {
    try {
      // Budget handling con validación
      let monthlyBudget = 0;
      if (typeof businessData.monthlyBudget === 'number' && !isNaN(businessData.monthlyBudget)) {
        monthlyBudget = businessData.monthlyBudget;
      }

      // Digital maturity score (0-100)
      const getDigitalMaturityScore = () => {
        let score = 30; // Base score
        
        if (monthlyBudget > 2000000) score += 30;
        else if (monthlyBudget > 800000) score += 20;
        else if (monthlyBudget > 400000) score += 10;
        
        if (businessData.currentChannels?.includes('SEO')) score += 15;
        if (businessData.currentChannels?.includes('Google Ads')) score += 10;
        if (businessData.currentChannels?.includes('Email Marketing')) score += 10;
        
        const challengesPenalty = (businessData.currentChallenges?.length || 0) * 3;
        score = Math.max(0, Math.min(100, score - challengesPenalty));
        
        return score;
      };

      const digitalMaturity = getDigitalMaturityScore();

      // Industry benchmarks para Chile
      const industryBenchmarks = {
        'E-commerce': { avgCPC: 450, conversionRate: 2.8, avgTicket: 35000 },
        'Tecnología': { avgCPC: 650, conversionRate: 3.5, avgTicket: 125000 },
        'Servicios Profesionales': { avgCPC: 520, conversionRate: 4.2, avgTicket: 85000 },
        'Salud': { avgCPC: 480, conversionRate: 3.8, avgTicket: 45000 },
        'Educación': { avgCPC: 380, conversionRate: 5.1, avgTicket: 95000 },
        'Restaurantes/Gastronomía': { avgCPC: 320, conversionRate: 6.2, avgTicket: 12000 },
        'Inmobiliaria': { avgCPC: 580, conversionRate: 1.8, avgTicket: 4500000 },
        'Turismo': { avgCPC: 420, conversionRate: 3.2, avgTicket: 155000 },
        'Manufactura': { avgCPC: 510, conversionRate: 2.5, avgTicket: 185000 },
        'Otro': { avgCPC: 450, conversionRate: 3.0, avgTicket: 65000 }
      };

      const benchmark = industryBenchmarks[businessData.industry as keyof typeof industryBenchmarks] || industryBenchmarks['Otro'];

      // Cálculos mensuales estimados
      const monthlyClicks = monthlyBudget > 0 ? Math.floor(monthlyBudget * 0.7 / benchmark.avgCPC) : 0;
      const monthlyLeads = Math.floor(monthlyClicks * (benchmark.conversionRate / 100));
      const closeRate = digitalMaturity > 60 ? 0.15 : digitalMaturity > 40 ? 0.12 : 0.08;
      const monthlySales = Math.floor(monthlyLeads * closeRate);
      const monthlyRevenue = monthlySales * benchmark.avgTicket;
      
      // ROI calculation con validación
      let roi = 0;
      if (monthlyBudget > 0 && monthlyRevenue > 0) {
        roi = ((monthlyRevenue - monthlyBudget) / monthlyBudget) * 100;
      }

      // Cost per acquisition
      const cpa = monthlySales > 0 ? Math.floor(monthlyBudget / monthlySales) : 0;

      return {
        digitalMaturity,
        monthlyClicks,
        monthlyLeads,
        monthlySales,
        monthlyRevenue,
        roi,
        cpa,
        benchmark
      };
    } catch (error) {
      console.error('Error calculating metrics:', error);
      return {
        digitalMaturity: 0,
        monthlyClicks: 0,
        monthlyLeads: 0,
        monthlySales: 0,
        monthlyRevenue: 0,
        roi: 0,
        cpa: 0,
        benchmark: industryBenchmarks['Otro']
      };
    }
  };

  const metrics = calculateMetrics();

  // Helper function para formatear números
  const formatNumber = (num: number) => {
    if (isNaN(num)) return '0';
    return new Intl.NumberFormat('es-CL').format(num);
  };

  // Helper function para formatear moneda
  const formatCurrency = (num: number) => {
    if (isNaN(num)) return '$0';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(num);
  };

  // Helper para mostrar números negativos en rojo
  const formatNumberWithColor = (num: number, isPercentage = false) => {
    const formatted = isPercentage ? `${num.toFixed(1)}%` : formatNumber(num);
    const colorClass = num < 0 ? 'text-red-600' : 'text-green-600';
    return <span className={colorClass}>{formatted}</span>;
  };

  const formatCurrencyWithColor = (num: number) => {
    const formatted = formatCurrency(num);
    const colorClass = num < 0 ? 'text-red-600' : 'text-green-600';
    return <span className={colorClass}>{formatted}</span>;
  };

  // Generar plan de acción personalizado
  const generateActionPlan = () => {
    const actions = [];
    
    // Análisis basado en presupuesto
    if (businessData.monthlyBudget === 0) {
      actions.push({
        title: "Definir presupuesto inicial",
        description: "Establece un presupuesto mínimo de $200.000 mensuales para comenzar con marketing digital efectivo.",
        priority: "Alto",
        timeframe: "Inmediato",
        impact: "Fundamental para iniciar cualquier estrategia"
      });
    } else if (businessData.monthlyBudget < 400000) {
      actions.push({
        title: "Optimizar SEO local",
        description: "Con presupuesto limitado, enfócate en SEO local gratuito: optimiza Google My Business, genera reseñas y crea contenido local.",
        priority: "Alto",
        timeframe: "2-4 semanas",
        impact: "Tráfico orgánico sin costo adicional"
      });
    }

    // Análisis por industria
    if (businessData.industry === 'E-commerce') {
      actions.push({
        title: "Implementar retargeting",
        description: "Configura píxeles de Facebook y Google para recuperar visitantes que no compraron. ROI típico: 300-500%.",
        priority: "Alto",
        timeframe: "1-2 semanas",
        impact: "Aumenta conversiones en 25-40%"
      });
    }

    // Análisis por desafíos
    if (businessData.currentChallenges?.includes('Medir resultados')) {
      actions.push({
        title: "Configurar Google Analytics 4",
        description: "Instala GA4 con objetivos de conversión y configura reportes automáticos para medir ROI real.",
        priority: "Alto",
        timeframe: "3-5 días",
        impact: "Visibilidad completa del rendimiento"
      });
    }

    if (businessData.currentChallenges?.includes('Generar leads de calidad')) {
      actions.push({
        title: "Crear lead magnets específicos",
        description: "Desarrolla contenido de valor (guías, checklist) para capturar leads calificados de tu audiencia objetivo.",
        priority: "Alto",
        timeframe: "2-3 semanas",
        impact: "Mejora calidad de leads en 60%"
      });
    }

    // Análisis por canales actuales
    if (!businessData.currentChannels?.includes('Email Marketing')) {
      actions.push({
        title: "Implementar email marketing",
        description: "Configura secuencias automatizadas de bienvenida y nutrición. Email marketing tiene ROI promedio de $42 por cada $1 invertido.",
        priority: "Medio",
        timeframe: "1-2 semanas",
        impact: "Canal de alta conversión"
      });
    }

    // Acciones por objetivo principal
    if (businessData.primaryGoal === 'Aumentar ventas') {
      actions.push({
        title: "Optimizar embudo de conversión",
        description: "Analiza y mejora cada paso del proceso de compra para reducir abandono y aumentar ventas.",
        priority: "Alto",
        timeframe: "3-4 semanas",
        impact: "Incremento de 20-35% en conversiones"
      });
    }

    return actions;
  };

  const actionPlan = generateActionPlan();

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-territory-dark mb-4">
            Tu Análisis de Marketing Digital
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            {businessData.businessName} - {businessData.industry}
          </p>
          <Badge variant="outline" className="text-sm">
            Presupuesto mensual: {businessData.monthlyBudget === 0 ? 'Sin presupuesto definido' : formatCurrency(businessData.monthlyBudget)}
          </Badge>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Madurez Digital</CardTitle>
              <BarChart3 className="h-4 w-4 text-territory-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.digitalMaturity}%</div>
              <Progress value={metrics.digitalMaturity} className="mt-2" />
              <p className="text-xs text-gray-600 mt-2">
                Basado en presupuesto, canales y experiencia
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leads Mensuales</CardTitle>
              <Users className="h-4 w-4 text-territory-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(metrics.monthlyLeads)}</div>
              <p className="text-xs text-gray-600 mt-2">
                Estimado con {formatNumber(metrics.monthlyClicks)} clics
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas Mensuales</CardTitle>
              <Target className="h-4 w-4 text-territory-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(metrics.monthlySales)}</div>
              <p className="text-xs text-gray-600 mt-2">
                Con tasa de cierre estimada del {((metrics.monthlySales / Math.max(metrics.monthlyLeads, 1)) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROI Mensual</CardTitle>
              <TrendingUp className="h-4 w-4 text-territory-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumberWithColor(metrics.roi, true)}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Ingresos: {formatCurrencyWithColor(metrics.monthlyRevenue)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-territory-blue" />
                Análisis Detallado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Costo por Clic (CPC)</span>
                <span className="text-sm">{formatCurrency(metrics.benchmark.avgCPC)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Tasa de Conversión</span>
                <span className="text-sm">{metrics.benchmark.conversionRate}%</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Ticket Promedio</span>
                <span className="text-sm">{formatCurrency(metrics.benchmark.avgTicket)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Costo por Adquisición</span>
                <span className="text-sm">{formatCurrency(metrics.cpa)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-territory-blue" />
                Tu Situación Actual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Objetivo Principal</h4>
                <Badge variant="secondary">{businessData.primaryGoal}</Badge>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Canales Actuales</h4>
                <div className="flex flex-wrap gap-2">
                  {businessData.currentChannels?.map((channel, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {channel}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Principales Desafíos</h4>
                <div className="flex flex-wrap gap-2">
                  {businessData.currentChallenges?.map((challenge, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {challenge}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plan de Acción Personalizado */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-territory-blue" />
              Plan de Acción Personalizado
            </CardTitle>
            <p className="text-gray-600">Recomendaciones específicas para {businessData.businessName}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {actionPlan.map((action, index) => (
                <div key={index} className="border-l-4 border-territory-blue pl-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{action.title}</h3>
                    <div className="flex gap-2">
                      <Badge 
                        variant={action.priority === 'Alto' ? 'destructive' : action.priority === 'Medio' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {action.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {action.timeframe}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{action.description}</p>
                  <p className="text-sm text-territory-blue font-medium">
                    💡 Impacto esperado: {action.impact}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-territory-blue text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">¿Necesitas ayuda implementando estas estrategias?</h2>
              <p className="text-blue-100 mb-6">
                Nuestro equipo puede ayudarte a ejecutar este plan y optimizar tus resultados
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary"
                  size="lg"
                  onClick={() => window.open('mailto:pedro@territorioux.cl?subject=Consultoría Marketing Digital - ' + businessData.businessName, '_blank')}
                >
                  Solicitar Consultoría
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={onBackToStart}
                  className="bg-transparent border-white text-white hover:bg-white hover:text-territory-blue"
                >
                  Nuevo Análisis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
