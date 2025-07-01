
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Target, BarChart3, Lightbulb, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { PlannerWizard } from '@/components/PlannerWizard';
import { Dashboard } from '@/components/Dashboard';

export interface BusinessData {
  businessName: string;
  industry: string;
  targetAudience: string;
  currentChannels: string[];
  monthlyBudget: number;
  primaryGoal: string;
  currentChallenges: string[];
  timeframe: string;
  teamSize: string;
  email: string;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'landing' | 'wizard' | 'dashboard'>('landing');
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);

  const handleStartPlanner = () => {
    setCurrentStep('wizard');
  };

  const handleWizardComplete = (data: BusinessData) => {
    setBusinessData(data);
    setCurrentStep('dashboard');
  };

  const handleBackToStart = () => {
    setCurrentStep('landing');
    setBusinessData(null);
  };

  if (currentStep === 'wizard') {
    return <PlannerWizard onComplete={handleWizardComplete} onBack={handleBackToStart} />;
  }

  if (currentStep === 'dashboard' && businessData) {
    return <Dashboard businessData={businessData} onBackToStart={handleBackToStart} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-strategy-50 via-white to-success-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <Badge className="mb-4 bg-strategy-gradient text-white" variant="secondary">
            Herramienta Gratuita
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-strategy-700 to-success-600 bg-clip-text text-transparent">
            Planificador Estratégico
            <br />
            Interactivo
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Descubre hacia dónde llevar tu negocio con un plan de marketing personalizado. 
            Responde unas preguntas simples y obtén una estrategia completa con visualizaciones profesionales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={handleStartPlanner}
              size="lg" 
              className="bg-strategy-gradient hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-lg px-8 py-4"
            >
              Crear Mi Plan Estratégico
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <div className="flex items-center text-sm text-gray-500">
              <CheckCircle className="h-4 w-4 mr-1 text-success-500" />
              100% Gratuito • Sin registros previos
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="strategy-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-strategy-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">Análisis Personalizado</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600">
                Analizamos tu situación actual y identificamos oportunidades específicas para tu industria y objetivos.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="strategy-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-strategy-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">Dashboard Visual</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600">
                Recibe gráficos interactivos y métricas que hacen fácil entender tu plan de acción paso a paso.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="strategy-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-strategy-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">Recomendaciones Accionables</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600">
                Obtén una hoja de ruta clara con acciones priorizadas y consejos prácticos para implementar.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-16 border border-white/20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">¿Qué obtienes con tu plan?</h2>
            <p className="text-gray-600 text-lg">Un diagnóstico completo que responde las preguntas clave de tu negocio</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-strategy-500 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">¿Dónde estoy ahora?</h3>
                  <p className="text-gray-600">Análisis de tu situación actual, canales actuales y distribución de presupuesto comparado con tu industria.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-success-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">¿A dónde voy?</h3>
                  <p className="text-gray-600">Hoja de ruta personalizada con acciones priorizadas y timeline para alcanzar tus objetivos específicos.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-strategy-50 to-success-50 rounded-2xl p-6 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-strategy-700 mb-2">3-5 min</div>
                <div className="text-gray-600">para completar</div>
                <div className="text-4xl font-bold text-success-600 mb-2 mt-4">100%</div>
                <div className="text-gray-600">personalizado</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-strategy-gradient rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">¿Listo para clarificar tu estrategia?</h2>
          <p className="text-xl mb-8 opacity-90">
            Miles de empresarios ya han usado esta herramienta para organizar sus ideas y trazar su plan de crecimiento.
          </p>
          <Button 
            onClick={handleStartPlanner}
            size="lg" 
            variant="secondary"
            className="bg-white text-strategy-700 hover:bg-gray-50 text-lg px-8 py-4 transform hover:scale-105 transition-all duration-300"
          >
            Comenzar Ahora - Es Gratis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
