
import { useState, useEffect } from 'react';
import { PlannerWizard } from '@/components/PlannerWizard';
import { Dashboard } from '@/components/Dashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Target, TrendingUp, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BusinessData {
  businessName: string;
  industry: string;
  email: string;
  targetAudience: string;
  currentChannels: string[];
  monthlyBudget: number;
  primaryGoal: string;
  currentChallenges: string[];
  timeframe: string;
}

export default function Index() {
  const [currentView, setCurrentView] = useState<'landing' | 'wizard' | 'dashboard'>('landing');
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const { toast } = useToast();

  const handleStartPlanner = () => {
    setCurrentView('wizard');
  };

  const handlePlannerComplete = async (data: BusinessData) => {
    try {
      // Guardar en la base de datos
      const { error: dbError } = await supabase
        .from('business_plans')
        .insert({
          business_name: data.businessName,
          industry: data.industry,
          email: data.email,
          target_audience: data.targetAudience,
          current_channels: data.currentChannels,
          monthly_budget: data.monthlyBudget,
          primary_goal: data.primaryGoal,
          current_challenges: data.currentChallenges,
          timeframe: data.timeframe
        });

      if (dbError) throw dbError;

      // Enviar email con la información
      const response = await fetch('/functions/v1/send-business-plan-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessData: data })
      });

      if (!response.ok) {
        console.error('Error sending email, but continuing...');
      }

      setBusinessData(data);
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Hubo un problema guardando la información.",
        variant: "destructive"
      });
    }
  };

  const handleBackToStart = () => {
    setCurrentView('landing');
    setBusinessData(null);
  };

  if (currentView === 'wizard') {
    return <PlannerWizard onComplete={handlePlannerComplete} onBack={handleBackToStart} />;
  }

  if (currentView === 'dashboard' && businessData) {
    return <Dashboard businessData={businessData} onBackToStart={handleBackToStart} />;
  }

  // Landing Page
  return (
    <div className="min-h-screen bg-white">
      {/* Header de TerritorioUX */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <a href="https://territorioux.cl" className="text-xl font-bold text-[#3E3E3E]">
                TerritorioUX
              </a>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="https://territorioux.cl/servicios" className="text-[#3E3E3E] hover:text-[#1FA2FF] transition-colors">Servicios</a>
              <a href="https://territorioux.cl/portfolio" className="text-[#3E3E3E] hover:text-[#1FA2FF] transition-colors">Portfolio</a>
              <a href="https://territorioux.cl/contacto" className="text-[#3E3E3E] hover:text-[#1FA2FF] transition-colors">Contacto</a>
              <a href="https://territorioux.cl/contacto" className="hig-button-primary">Hablar con un experto</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center fade-in">
          <h1 className="text-5xl font-bold text-[#3E3E3E] mb-6 leading-tight">
            Análisis de marketing gratuito para empresas
          </h1>
          
          <Button 
            onClick={handleStartPlanner}
            className="hig-button-primary text-lg px-8 py-4 mb-12"
          >
            Analizar Mi Estrategia
          </Button>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <Card className="hig-card text-center slide-in">
              <CardContent className="p-6">
                <BarChart3 className="h-10 w-10 text-[#1FA2FF] mx-auto mb-4" />
                <h3 className="font-semibold text-[#3E3E3E] mb-2">Análisis Completo</h3>
                <p className="text-sm text-gray-600">Evaluación 360° de tu estrategia actual</p>
              </CardContent>
            </Card>

            <Card className="hig-card text-center slide-in">
              <CardContent className="p-6">
                <Target className="h-10 w-10 text-[#1FA2FF] mx-auto mb-4" />
                <h3 className="font-semibold text-[#3E3E3E] mb-2">Recomendaciones</h3>
                <p className="text-sm text-gray-600">Acciones específicas para tu industria</p>
              </CardContent>
            </Card>

            <Card className="hig-card text-center slide-in">
              <CardContent className="p-6">
                <TrendingUp className="h-10 w-10 text-[#1FA2FF] mx-auto mb-4" />
                <h3 className="font-semibold text-[#3E3E3E] mb-2">ROI Optimizado</h3>
                <p className="text-sm text-gray-600">Maximiza el retorno de tu inversión</p>
              </CardContent>
            </Card>

            <Card className="hig-card text-center slide-in">
              <CardContent className="p-6">
                <Users className="h-10 w-10 text-[#1FA2FF] mx-auto mb-4" />
                <h3 className="font-semibold text-[#3E3E3E] mb-2">Equipo Experto</h3>
                <p className="text-sm text-gray-600">Consultoría especializada disponible</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-[#3E3E3E] mb-12">Cómo Funciona</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="slide-in">
              <div className="w-12 h-12 bg-[#1FA2FF] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-lg font-semibold text-[#3E3E3E] mb-2">Responde 6 preguntas</h3>
              <p className="text-gray-600">Información básica sobre tu negocio y objetivos</p>
            </div>
            
            <div className="slide-in">
              <div className="w-12 h-12 bg-[#1FA2FF] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-lg font-semibold text-[#3E3E3E] mb-2">Obtén tu análisis</h3>
              <p className="text-gray-600">Dashboard personalizado con métricas clave</p>
            </div>
            
            <div className="slide-in">
              <div className="w-12 h-12 bg-[#1FA2FF] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-lg font-semibold text-[#3E3E3E] mb-2">Implementa mejoras</h3>
              <p className="text-gray-600">Aplica las recomendaciones o solicita ayuda</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer de TerritorioUX */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-[#3E3E3E] mb-4">TerritorioUX</h3>
              <p className="text-gray-600 text-sm">Especialistas en UX/UI y desarrollo web. Transformamos ideas en experiencias digitales excepcionales.</p>
            </div>
            <div>
              <h4 className="font-semibold text-[#3E3E3E] mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="https://territorioux.cl/servicios/ux-ui" className="hover:text-[#1FA2FF] transition-colors">UX/UI Design</a></li>
                <li><a href="https://territorioux.cl/servicios/desarrollo" className="hover:text-[#1FA2FF] transition-colors">Desarrollo Web</a></li>
                <li><a href="https://territorioux.cl/servicios/marketing" className="hover:text-[#1FA2FF] transition-colors">Marketing Digital</a></li>
                <li><a href="https://territorioux.cl/servicios/consultoria" className="hover:text-[#1FA2FF] transition-colors">Consultoría</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#3E3E3E] mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="https://territorioux.cl/nosotros" className="hover:text-[#1FA2FF] transition-colors">Nosotros</a></li>
                <li><a href="https://territorioux.cl/portfolio" className="hover:text-[#1FA2FF] transition-colors">Portfolio</a></li>
                <li><a href="https://territorioux.cl/blog" className="hover:text-[#1FA2FF] transition-colors">Blog</a></li>
                <li><a href="https://territorioux.cl/contacto" className="hover:text-[#1FA2FF] transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#3E3E3E] mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>pedro@territorioux.cl</li>
                <li>+56 9 1234 5678</li>
                <li>Santiago, Chile</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2024 TerritorioUX. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
