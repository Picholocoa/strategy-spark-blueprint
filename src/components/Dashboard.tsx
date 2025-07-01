
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, Download, Calendar, Target, TrendingUp, Users, 
  DollarSign, AlertCircle, CheckCircle, Lightbulb, BarChart3,
  PieChart, Clock, Star
} from 'lucide-react';
import { BusinessData } from '@/pages/Index';
import { BudgetChart } from '@/components/BudgetChart';
import { PriorityMatrix } from '@/components/PriorityMatrix';

interface DashboardProps {
  businessData: BusinessData;
  onBackToStart: () => void;
}

export const Dashboard = ({ businessData, onBackToStart }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('analysis');

  // Generate analysis based on business data
  const generateAnalysis = () => {
    const budget = businessData.monthlyBudget;
    let budgetCategory = '';
    let budgetInsight = '';
    
    if (budget < 2000) {
      budgetCategory = 'Presupuesto Limitado';
      budgetInsight = 'Tu presupuesto está por debajo del promedio de la industria. Recomendamos enfocarte en canales orgánicos y de bajo costo inicial.';
    } else if (budget < 5000) {
      budgetCategory = 'Presupuesto Moderado';
      budgetInsight = 'Tienes un presupuesto saludable para experimentar con diferentes canales. Considera una estrategia mixta.';
    } else {
      budgetCategory = 'Presupuesto Robusto';
      budgetInsight = 'Tu presupuesto te permite implementar una estrategia integral con múltiples canales y herramientas premium.';
    }

    return {
      currentState: {
        channels: businessData.currentChannels.length,
        primaryChannel: businessData.currentChannels[0] || 'No definido',
        budgetCategory,
        budgetInsight,
        mainChallenges: businessData.currentChallenges
      }
    };
  };

  const generateRecommendations = () => {
    const recs = [];
    
    // Budget-based recommendations
    if (businessData.monthlyBudget < 2000) {
      recs.push({
        priority: 'Alta',
        title: 'Optimización SEO y Contenido',
        description: 'Enfócate en crear contenido de valor para tu audiencia. Es una inversión a largo plazo con excelente ROI.',
        timeframe: '1-3 meses',
        effort: 'Medio',
        impact: 'Alto'
      });
      recs.push({
        priority: 'Media',
        title: 'Email Marketing Automation',
        description: 'Implementa secuencias automatizadas para nutrir leads y fidelizar clientes existentes.',
        timeframe: '2-4 semanas',
        effort: 'Bajo',
        impact: 'Alto'
      });
    } else {
      recs.push({
        priority: 'Alta',
        title: 'Campañas de Google Ads',
        description: 'Implementa campañas segmentadas en Google para capturar demanda activa de tu producto/servicio.',
        timeframe: '2-4 semanas',
        effort: 'Medio',
        impact: 'Alto'
      });
    }

    // Goal-based recommendations
    if (businessData.primaryGoal === 'Aumentar ventas') {
      recs.push({
        priority: 'Alta',
        title: 'Funnel de Conversión Optimizado',
        description: 'Mejora tu proceso de venta desde el primer contacto hasta la compra final.',
        timeframe: '1-2 meses',
        effort: 'Alto',
        impact: 'Muy Alto'
      });
    }

    if (businessData.primaryGoal === 'Mejorar visibilidad de marca') {
      recs.push({
        priority: 'Media',
        title: 'Estrategia de Contenido en Redes Sociales',
        description: 'Desarrolla una presencia consistente en las plataformas donde está tu audiencia.',
        timeframe: '1-2 meses',
        effort: 'Medio',
        impact: 'Alto'
      });
    }

    // Challenge-based recommendations
    if (businessData.currentChallenges.includes('No sé qué canales usar')) {
      recs.push({
        priority: 'Alta',
        title: 'Prueba A/B de Canales',
        description: 'Testa diferentes canales con presupuestos pequeños para identificar los más efectivos.',
        timeframe: '1 mes',
        effort: 'Medio',
        impact: 'Alto'
      });
    }

    return recs.slice(0, 6); // Limit to 6 recommendations
  };

  const analysis = generateAnalysis();
  const recommendations = generateRecommendations();

  const getBudgetAllocation = () => {
    const budget = businessData.monthlyBudget;
    if (budget < 2000) {
      return [
        { name: 'Contenido/SEO', value: 40, color: '#0ea5e9' },
        { name: 'Email Marketing', value: 25, color: '#22c55e' },
        { name: 'Redes Sociales', value: 20, color: '#f59e0b' },
        { name: 'Herramientas', value: 15, color: '#8b5cf6' }
      ];
    } else if (budget < 5000) {
      return [
        { name: 'Google Ads', value: 35, color: '#0ea5e9' },
        { name: 'Contenido/SEO', value: 25, color: '#22c55e' },
        { name: 'Redes Sociales', value: 25, color: '#f59e0b' },
        { name: 'Email Marketing', value: 15, color: '#8b5cf6' }
      ];
    } else {
      return [
        { name: 'Publicidad Digital', value: 40, color: '#0ea5e9' },
        { name: 'Contenido/SEO', value: 20, color: '#22c55e' },
        { name: 'Redes Sociales', value: 20, color: '#f59e0b' },
        { name: 'Email Marketing', value: 10, color: '#8b5cf6' },
        { name: 'Herramientas/Software', value: 10, color: '#ef4444' }
      ];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-strategy-50 via-white to-success-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Plan Estratégico para {businessData.businessName}
              </h1>
              <p className="text-gray-600">Tu hoja de ruta personalizada hacia el crecimiento</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={onBackToStart}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al inicio
              </Button>
              <Button className="bg-strategy-gradient">
                <Download className="mr-2 h-4 w-4" />
                Descargar PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="strategy-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Presupuesto Mensual</p>
                  <p className="text-2xl font-bold text-strategy-700">${businessData.monthlyBudget.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-strategy-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="strategy-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Canales Actuales</p>
                  <p className="text-2xl font-bold text-strategy-700">{businessData.currentChannels.length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-strategy-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="strategy-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Objetivo Principal</p>
                  <p className="text-lg font-semibold text-strategy-700">{businessData.primaryGoal}</p>
                </div>
                <Target className="h-8 w-8 text-strategy-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="strategy-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Plazo Esperado</p>
                  <p className="text-lg font-semibold text-strategy-700">{businessData.timeframe}</p>
                </div>
                <Clock className="h-8 w-8 text-strategy-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="analysis">Análisis Actual</TabsTrigger>
            <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
            <TabsTrigger value="budget">Presupuesto</TabsTrigger>
            <TabsTrigger value="roadmap">Hoja de Ruta</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="strategy-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-strategy-500" />
                    Estado Actual
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Industria</h4>
                    <Badge variant="secondary">{businessData.industry}</Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Canales Principales</h4>
                    <div className="flex flex-wrap gap-2">
                      {businessData.currentChannels.map(channel => (
                        <Badge key={channel} className="bg-strategy-100 text-strategy-700">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Categoría de Presupuesto</h4>
                    <p className="text-gray-600">{analysis.currentState.budgetCategory}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="strategy-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="mr-2 h-5 w-5 text-orange-500" />
                    Desafíos Identificados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {businessData.currentChallenges.map(challenge => (
                      <div key={challenge} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{challenge}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="strategy-card">
              <CardHeader>
                <CardTitle>Insights Clave</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-strategy-50 to-success-50 p-6 rounded-lg">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {analysis.currentState.budgetInsight}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid gap-6">
              {recommendations.map((rec, index) => (
                <Card key={index} className="strategy-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge 
                            className={`${
                              rec.priority === 'Alta' ? 'bg-red-100 text-red-700' :
                              rec.priority === 'Media' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}
                          >
                            Prioridad {rec.priority}
                          </Badge>
                          <Badge variant="outline">{rec.timeframe}</Badge>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{rec.title}</h3>
                        <p className="text-gray-600 mb-4">{rec.description}</p>
                      </div>
                      <Lightbulb className="h-8 w-8 text-strategy-500 flex-shrink-0 ml-4" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Esfuerzo Requerido</span>
                        <div className="flex items-center mt-1">
                          <Progress 
                            value={rec.effort === 'Bajo' ? 33 : rec.effort === 'Medio' ? 66 : 100} 
                            className="w-full h-2"
                          />
                          <span className="ml-2 text-sm">{rec.effort}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Impacto Esperado</span>
                        <div className="flex items-center mt-1">
                          <Progress 
                            value={rec.impact === 'Medio' ? 50 : rec.impact === 'Alto' ? 75 : 100} 
                            className="w-full h-2"
                          />
                          <span className="ml-2 text-sm">{rec.impact}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="budget" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="strategy-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="mr-2 h-5 w-5 text-strategy-500" />
                    Distribución Recomendada
                  </CardTitle>
                  <CardDescription>
                    Basado en tu presupuesto de ${businessData.monthlyBudget.toLocaleString()} mensuales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BudgetChart data={getBudgetAllocation()} />
                </CardContent>
              </Card>

              <Card className="strategy-card">
                <CardHeader>
                  <CardTitle>Desglose por Categoría</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {getBudgetAllocation().map(item => (
                    <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{item.value}%</div>
                        <div className="text-sm text-gray-500">
                          ${Math.round(businessData.monthlyBudget * item.value / 100).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            <Card className="strategy-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-strategy-500" />
                  Tu Hoja de Ruta - Primeros 90 Días
                </CardTitle>
                <CardDescription>
                  Plan de acción paso a paso para implementar tu estrategia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PriorityMatrix recommendations={recommendations} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="bg-strategy-gradient text-white mt-8">
          <CardContent className="p-8 text-center">
            <Star className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">¿Listo para implementar tu estrategia?</h2>
            <p className="text-lg mb-6 opacity-90">
              Este plan es solo el comienzo. Nuestro equipo de expertos puede ayudarte a implementar 
              cada recomendación y multiplicar tus resultados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-strategy-700 hover:bg-gray-50">
                Agendar Consultoría Gratuita
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Descargar Plan Completo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
