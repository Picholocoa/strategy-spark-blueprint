
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { BusinessData } from '@/pages/Index';

interface PlannerWizardProps {
  onComplete: (data: BusinessData) => void;
  onBack: () => void;
}

export const PlannerWizard = ({ onComplete, onBack }: PlannerWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;
  
  const [formData, setFormData] = useState<Partial<BusinessData>>({
    currentChannels: [],
    currentChallenges: []
  });

  const industries = [
    "E-commerce", "Servicios Profesionales", "Restaurantes/Comida", "Tecnología", 
    "Salud/Bienestar", "Educación", "Inmobiliario", "Manufactura", "Retail", "Otro"
  ];

  const channels = [
    "Redes Sociales", "Google Ads", "SEO/Contenido", "Email Marketing", 
    "Publicidad Tradicional", "Referencias/Boca a boca", "Eventos/Ferias"
  ];

  const goals = [
    "Aumentar ventas", "Mejorar visibilidad de marca", "Generar más leads", 
    "Fidelizar clientes", "Expandir a nuevos mercados", "Mejorar ROI de marketing"
  ];

  const challenges = [
    "Presupuesto limitado", "Falta de tiempo", "No sé qué canales usar", 
    "Dificultad para medir resultados", "Competencia muy fuerte", "Audiencia poco definida"
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData as BusinessData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChannelChange = (channel: string, checked: boolean) => {
    const currentChannels = formData.currentChannels || [];
    if (checked) {
      updateFormData('currentChannels', [...currentChannels, channel]);
    } else {
      updateFormData('currentChannels', currentChannels.filter(c => c !== channel));
    }
  };

  const handleChallengeChange = (challenge: string, checked: boolean) => {
    const currentChallenges = formData.currentChallenges || [];
    if (checked) {
      updateFormData('currentChallenges', [...currentChallenges, challenge]);
    } else {
      updateFormData('currentChallenges', currentChallenges.filter(c => c !== challenge));
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="businessName" className="text-lg font-medium">¿Cuál es el nombre de tu negocio?</Label>
              <Input
                id="businessName"
                value={formData.businessName || ''}
                onChange={(e) => updateFormData('businessName', e.target.value)}
                placeholder="Ej: Mi Empresa S.A."
                className="mt-2 text-lg p-4"
              />
            </div>
            <div>
              <Label className="text-lg font-medium">¿En qué industria opera tu negocio?</Label>
              <Select value={formData.industry || ''} onValueChange={(value) => updateFormData('industry', value)}>
                <SelectTrigger className="mt-2 text-lg p-4">
                  <SelectValue placeholder="Selecciona una industria" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="targetAudience" className="text-lg font-medium">Describe tu público objetivo principal</Label>
              <Textarea
                id="targetAudience"
                value={formData.targetAudience || ''}
                onChange={(e) => updateFormData('targetAudience', e.target.value)}
                placeholder="Ej: Mujeres de 25-45 años, profesionales, interesadas en bienestar..."
                className="mt-2 text-lg p-4 min-h-[120px]"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-medium mb-4 block">¿Qué canales de marketing usas actualmente? (Selecciona todos los que apliquen)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {channels.map(channel => (
                  <div key={channel} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                    <Checkbox
                      id={channel}
                      checked={formData.currentChannels?.includes(channel) || false}
                      onCheckedChange={(checked) => handleChannelChange(channel, checked as boolean)}
                    />
                    <Label htmlFor={channel} className="flex-1 cursor-pointer">{channel}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-medium">¿Cuál es tu presupuesto mensual aproximado para marketing?</Label>
              <Select value={formData.monthlyBudget?.toString() || ''} onValueChange={(value) => updateFormData('monthlyBudget', parseInt(value))}>
                <SelectTrigger className="mt-2 text-lg p-4">
                  <SelectValue placeholder="Selecciona un rango" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500">Menos de $500</SelectItem>
                  <SelectItem value="2000">$500 - $2,000</SelectItem>
                  <SelectItem value="5000">$2,000 - $5,000</SelectItem>
                  <SelectItem value="10000">$5,000 - $10,000</SelectItem>
                  <SelectItem value="20000">$10,000 - $20,000</SelectItem>
                  <SelectItem value="50000">Más de $20,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-medium">¿Cuál es tu objetivo principal de marketing?</Label>
              <Select value={formData.primaryGoal || ''} onValueChange={(value) => updateFormData('primaryGoal', value)}>
                <SelectTrigger className="mt-2 text-lg p-4">
                  <SelectValue placeholder="Selecciona tu objetivo principal" />
                </SelectTrigger>
                <SelectContent>
                  {goals.map(goal => (
                    <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-medium mb-4 block">¿Cuáles son tus principales desafíos actuales? (Selecciona todos los que apliquen)</Label>
              <div className="grid grid-cols-1 gap-4">
                {challenges.map(challenge => (
                  <div key={challenge} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                    <Checkbox
                      id={challenge}
                      checked={formData.currentChallenges?.includes(challenge) || false}
                      onCheckedChange={(checked) => handleChallengeChange(challenge, checked as boolean)}
                    />
                    <Label htmlFor={challenge} className="flex-1 cursor-pointer">{challenge}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-medium">¿En qué plazo esperas ver resultados?</Label>
              <Select value={formData.timeframe || ''} onValueChange={(value) => updateFormData('timeframe', value)}>
                <SelectTrigger className="mt-2 text-lg p-4">
                  <SelectValue placeholder="Selecciona un plazo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-3 meses">1-3 meses</SelectItem>
                  <SelectItem value="3-6 meses">3-6 meses</SelectItem>
                  <SelectItem value="6-12 meses">6-12 meses</SelectItem>
                  <SelectItem value="12+ meses">Más de 12 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="email" className="text-lg font-medium">Email para recibir tu plan personalizado</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="tu@email.com"
                className="mt-2 text-lg p-4"
              />
              <p className="text-sm text-gray-500 mt-2">Te enviaremos tu plan en PDF y consejos adicionales para implementarlo.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.businessName && formData.industry;
      case 2:
        return formData.targetAudience;
      case 3:
        return formData.currentChannels && formData.currentChannels.length > 0;
      case 4:
        return formData.monthlyBudget;
      case 5:
        return formData.primaryGoal;
      case 6:
        return formData.currentChallenges && formData.currentChallenges.length > 0;
      case 7:
        return formData.timeframe && formData.email;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-strategy-50 via-white to-success-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Planificador Estratégico</h1>
            <span className="text-sm text-gray-500">Paso {currentStep} de {totalSteps}</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-3" />
        </div>

        {/* Main Card */}
        <Card className="strategy-card mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {currentStep === 1 && "Cuéntanos sobre tu negocio"}
              {currentStep === 2 && "Tu audiencia objetivo"}
              {currentStep === 3 && "Canales de marketing actuales"}
              {currentStep === 4 && "Presupuesto de marketing"}
              {currentStep === 5 && "Objetivo principal"}
              {currentStep === 6 && "Desafíos actuales"}
              {currentStep === 7 && "Cronograma y contacto"}
            </CardTitle>
            <CardDescription className="text-center text-lg">
              {currentStep === 1 && "Empecemos con información básica sobre tu empresa"}
              {currentStep === 2 && "¿A quién quieres llegar con tu marketing?"}
              {currentStep === 3 && "¿Dónde promocionas tu negocio actualmente?"}
              {currentStep === 4 && "Esto nos ayuda a dimensionar las recomendaciones"}
              {currentStep === 5 && "¿Qué quieres lograr principalmente?"}
              {currentStep === 6 && "¿Qué te está limitando actualmente?"}
              {currentStep === 7 && "Últimos detalles para generar tu plan"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {currentStep === 1 ? 'Volver al inicio' : 'Anterior'}
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="flex items-center bg-strategy-gradient hover:shadow-lg"
          >
            {currentStep === totalSteps ? (
              <>
                Generar Mi Plan
                <CheckCircle className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
