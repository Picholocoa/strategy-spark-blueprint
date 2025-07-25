
import { useState, useEffect } from 'react';
import { PlannerWizard } from '@/components/PlannerWizard';
import { Dashboard } from '@/components/Dashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Target, TrendingUp, Users, Mail, MessageSquare, Linkedin, Instagram } from 'lucide-react';
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
  teamSize: string;
}

export default function Index() {
  const [currentView, setCurrentView] = useState<'landing' | 'wizard' | 'dashboard'>('landing');
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const { toast } = useToast();

  // SEO and Performance optimizations
  useEffect(() => {
    // Preload critical resources
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = '/favicon.ico';
    document.head.appendChild(link);

    // Set up intersection observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeIn');
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.slide-in');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

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
          timeframe: data.timeframe,
          team_size: data.teamSize
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
    return <PlannerWizard onComplete={handlePlannerComplete} />;
  }

  if (currentView === 'dashboard' && businessData) {
    return <Dashboard businessData={businessData} onBackToStart={handleBackToStart} />;
  }

  // Landing Page
  return (
    <div className="min-h-screen bg-white">
      {/* Header simplificado con solo logo centrado */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-white/90">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center">
            <a href="https://territorioux.cl" className="text-2xl font-bold text-territory-dark">
              Territorio<span className="text-territory-blue">UX</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section simplificado */}
      <section className="hero-section relative overflow-hidden py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center fade-in">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-12">
            <span className="text-territory-dark block">Análisis de marketing</span>
            <span className="text-territory-blue block">gratuito para empresas</span>
          </h1>
          
          <Button 
            onClick={handleStartPlanner}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-11 bg-territory-blue hover:bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-medium group transition-all duration-300 hover:scale-105 mb-4"
          >
            Comenzar análisis →
          </Button>

          {/* Features Grid optimizado */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            <Card className="hig-card text-center slide-in stagger-1 contain-layout">
              <CardContent className="p-8">
                <BarChart3 className="h-12 w-12 text-territory-blue mx-auto mb-6" />
                <h3 className="font-semibold text-territory-dark mb-3 text-lg">Análisis Completo</h3>
                <p className="text-gray-600 leading-relaxed">Evaluación 360° de tu estrategia actual con métricas reales</p>
              </CardContent>
            </Card>

            <Card className="hig-card text-center slide-in stagger-2 contain-layout">
              <CardContent className="p-8">
                <Target className="h-12 w-12 text-territory-blue mx-auto mb-6" />
                <h3 className="font-semibold text-territory-dark mb-3 text-lg">Recomendaciones</h3>
                <p className="text-gray-600 leading-relaxed">Acciones específicas basadas en benchmarks de tu industria</p>
              </CardContent>
            </Card>

            <Card className="hig-card text-center slide-in stagger-3 contain-layout">
              <CardContent className="p-8">
                <TrendingUp className="h-12 w-12 text-territory-blue mx-auto mb-6" />
                <h3 className="font-semibold text-territory-dark mb-3 text-lg">ROI Optimizado</h3>
                <p className="text-gray-600 leading-relaxed">Maximiza el retorno de inversión con datos reales</p>
              </CardContent>
            </Card>

            <Card className="hig-card text-center slide-in stagger-4 contain-layout">
              <CardContent className="p-8">
                <Users className="h-12 w-12 text-territory-blue mx-auto mb-6" />
                <h3 className="font-semibold text-territory-dark mb-3 text-lg">Equipo Experto</h3>
                <p className="text-gray-600 leading-relaxed">Consultoría especializada con más de 5 años de experiencia</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section optimizado */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl font-bold text-territory-dark mb-16">Cómo Funciona</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="slide-in contain-layout">
              <div className="w-16 h-16 bg-territory-blue text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">1</div>
              <h3 className="text-xl font-semibold text-territory-dark mb-4">Responde 6 preguntas</h3>
              <p className="text-gray-600 leading-relaxed">Información básica sobre tu negocio, objetivos y presupuesto actual</p>
            </div>
            
            <div className="slide-in contain-layout">
              <div className="w-16 h-16 bg-territory-blue text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">2</div>
              <h3 className="text-xl font-semibold text-territory-dark mb-4">Obtén tu análisis</h3>
              <p className="text-gray-600 leading-relaxed">Dashboard personalizado con métricas clave y benchmarks de industria</p>
            </div>
            
            <div className="slide-in contain-layout">
              <div className="w-16 h-16 bg-territory-blue text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">3</div>
              <h3 className="text-xl font-semibold text-territory-dark mb-4">Implementa mejoras</h3>
              <p className="text-gray-600 leading-relaxed">Aplica las recomendaciones o solicita ayuda de nuestro equipo experto</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer optimizado según diseño TerritorioUX */}
      <footer className="bg-territory-dark text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="font-bold text-xl mb-6">
                Territorio<span className="text-territory-blue">UX</span>
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Especialistas en experiencia digital para Latinoamérica. UX que convierte, diseño que entiende a las personas.
              </p>
              <div className="flex space-x-4">
                <a href="mailto:pedro@territorioux.cl" className="text-gray-300 hover:text-territory-blue transition-colors">
                  <Mail className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-territory-blue transition-colors">
                  <MessageSquare className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-territory-blue transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-territory-blue transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-6 text-lg">Servicios</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="https://territorioux.cl/servicios/ux-redes-sociales" className="hover:text-territory-blue transition-colors">UX para redes sociales</a></li>
                <li><a href="https://territorioux.cl/servicios/ux-writing" className="hover:text-territory-blue transition-colors">UX Writing</a></li>
                <li><a href="https://territorioux.cl/servicios/investigacion-usuarios" className="hover:text-territory-blue transition-colors">Investigación usuarios</a></li>
                <li><a href="https://territorioux.cl/servicios/interfaces-que-venden" className="hover:text-territory-blue transition-colors">Interfaces que venden</a></li>
                <li><a href="https://territorioux.cl/servicios/ux-ia" className="hover:text-territory-blue transition-colors">UX con IA</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-6 text-lg">Empresa</h4>
              <ul className="space-y-3 text-gray-300 mb-6">
                <li><a href="https://territorioux.cl/nosotros" className="hover:text-territory-blue transition-colors">Nosotros</a></li>
                <li><a href="https://territorioux.cl/casos-exito" className="hover:text-territory-blue transition-colors">Casos de éxito</a></li>
                <li><a href="https://territorioux.cl/contacto" className="hover:text-territory-blue transition-colors">Contacto</a></li>
              </ul>
              <p className="text-gray-300 font-medium">pedro@territorioux.cl</p>
            </div>
          </div>
          
          <div className="border-t border-gray-600 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 Territorio UX. Todos los derechos reservados.
              </p>
              <div className="flex space-x-6 text-sm text-gray-400">
                <a href="https://territorioux.cl/terminos" className="hover:text-territory-blue transition-colors">Términos de uso</a>
                <a href="https://territorioux.cl/privacidad" className="hover:text-territory-blue transition-colors">Política de privacidad</a>
              </div>
            </div>
            
            <div className="text-center mt-8 pt-8 border-t border-gray-700">
              <p className="text-gray-500 text-sm italic">
                "Más usuarios, más ventas" • "UX que convierte" • "Diseño que entiende a las personas"
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
