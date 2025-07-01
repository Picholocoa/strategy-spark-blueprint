
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Calendar, Target, TrendingUp, Users, 
  DollarSign, AlertTriangle, CheckCircle, Zap, Phone
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

  // Análisis simplificado y enfocado en venta
  const getAnalysis = () => {
    const budget = businessData.monthlyBudget;
    const channelCount = businessData.currentChannels.length;
    const challengeCount = businessData.currentChallenges.length;

    let scoreColor = '';
    let score = 0;
    let insight = '';
    let urgency = '';

    // Scoring básico
    if (budget < 2000) score += 20;
    else if (budget < 5000) score += 50;
    else score += 80;

    if (channelCount < 3) score += 20;
    else if (channelCount < 5) score += 40;
    else score += 60;

    if (challengeCount > 3) score -= 20;

    if (score < 40) {
      scoreColor = 'text-red-500';
      insight = 'Tu estrategia actual tiene gaps importantes que están limitando tu crecimiento.';
      urgency = 'Crítico';
    } else if (score < 70) {
      scoreColor = 'text-orange-500';
      insight = 'Hay oportunidades claras para optimizar tu inversión y resultados.';
      urgency = 'Alto';
    } else {
      scoreColor = 'text-green-500';
      insight = 'Tu estrategia tiene buena base, pero podría ser más eficiente.';
      urgency = 'Medio';
    }

    return { score, scoreColor, insight, urgency };
  };

  const getBudgetAllocation = () => {
    const budget = businessData.monthlyBudget;
    if (budget < 2000) {
      return [
        { name: 'SEO/Contenido', value: 45, color: '#1FA2FF' },
        { name: 'Email Marketing', value: 30, color: '#22c55e' },
        { name: 'Redes Sociales', value: 25, color: '#f59e0b' }
      ];
    } else if (budget < 5000) {
      return [
        { name: 'Google Ads', value: 40, color: '#1FA2FF' },
        { name: 'SEO/Contenido', value: 30, color: '#22c55e' },
        { name: 'Redes Sociales', value: 30, color: '#f59e0b' }
      ];
    } else {
      return [
        { name: 'Publicidad Digital', value: 45, color: '#1FA2FF' },
        { name: 'Contenido/SEO', value: 25, color: '#22c55e' },
        { name: 'Redes Sociales', value: 20, color: '#f59e0b' },
        { name: 'Email Marketing', value: 10, color: '#8b5cf6' }
      ];
    }
  };

  const getRecommendations = () => {
    const budget = businessData.monthlyBudget;
    const recs = [];

    if (budget < 2000) {
      recs.push({
        title: 'Optimiza tu presencia orgánica',
        impact: 'Alto',
        description: 'Con tu presupuesto actual, el ROI más alto viene de SEO y contenido.',
        icon: <TrendingUp className="h-5 w-5" />
      });
    } else {
      recs.push({
        title: 'Implementa campañas pagadas',
        impact: 'Muy Alto',
        description: 'Tu presupuesto permite escalar con publicidad digital efectiva.',
        icon: <Zap className="h-5 w-5" />
      });
    }

    if (businessData.currentChallenges.includes('No sé qué canales usar')) {
      recs.push({
        title: 'Estrategia multicanal',
        impact: 'Alto',
        description: 'Necesitas una estrategia clara para optimizar tus canales.',
        icon: <Target className="h-5 w-5" />
      });
    }

    if (businessData.currentChallenges.includes('Medir resultados')) {
      recs.push({
        title: 'Sistema de tracking',
        impact: 'Crítico',
        description: 'Sin medición no puedes optimizar tu inversión.',
        icon: <AlertTriangle className="h-5 w-5" />
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
              <p className="text-gray-600">Tu diagnóstico estratégico personalizado</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hig-card slide-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Presupuesto</p>
                  <p className="text-2xl font-bold text-[#3E3E3E]">${businessData.monthlyBudget.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">mensual</p>
                </div>
                <DollarSign className="h-8 w-8 text-[#1FA2FF]" />
              </div>
            </CardContent>
          </Card>

          <Card className="hig-card slide-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Canales Activos</p>
                  <p className="text-2xl font-bold text-[#3E3E3E]">{businessData.currentChannels.length}</p>
                  <p className="text-xs text-gray-500">de 7 principales</p>
                </div>
                <Users className="h-8 w-8 text-[#1FA2FF]" />
              </div>
            </CardContent>
          </Card>

          <Card className="hig-card slide-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Objetivo</p>
                  <p className="text-lg font-semibold text-[#3E3E3E]">{businessData.primaryGoal}</p>
                  <p className="text-xs text-gray-500">{businessData.timeframe}</p>
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
              <CardTitle className="text-xl text-[#3E3E3E]">Distribución Recomendada</CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetChart data={getBudgetAllocation()} />
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="hig-card slide-in">
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
        </div>

        {/* CTA Section */}
        <Card className="hig-card slide-in">
          <CardContent className="p-8 text-center">
            <Phone className="h-12 w-12 mx-auto text-[#1FA2FF] mb-4" />
            <h2 className="text-2xl font-semibold text-[#3E3E3E] mb-4">
              ¿Listo para implementar estas mejoras?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Nuestro equipo puede ayudarte a implementar estas recomendaciones y multiplicar tu ROI.
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
