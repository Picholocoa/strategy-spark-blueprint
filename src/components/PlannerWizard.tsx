
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  const totalSteps = 6;
  
  const [formData, setFormData] = useState<Partial<BusinessData>>({
    currentChannels: [],
    currentChallenges: []
  });

  const [emailError, setEmailError] = useState('');

  const industries = [
    "E-commerce", "Servicios Profesionales", "Restaurantes", "Tecnología", 
    "Salud", "Educación", "Inmobiliario", "Manufactura", "Retail", "Otro"
  ];

  const channels = [
    "Redes Sociales", "Google Ads", "SEO", "Email Marketing", 
    "Publicidad Tradicional", "Referencias", "Eventos"
  ];

  const goals = [
    "Aumentar ventas", "Mejorar visibilidad", "Generar leads", 
    "Fidelizar clientes", "Nuevos mercados", "Mejorar ROI"
  ];

  const challenges = [
    "Presupuesto limitado", "Falta de tiempo", "No sé qué canales usar", 
    "Medir resultados", "Competencia fuerte", "Audiencia indefinida"
  ];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const disposableEmailDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com',
      'throwaway.email', 'temp-mail.org', 'getnada.com', 'yopmail.com'
    ];
    
    if (!emailRegex.test(email)) {
      return 'Por favor ingresa un email válido';
    }
    
    const domain = email.split('@')[1]?.toLowerCase();
    if (disposableEmailDomains.includes(domain)) {
      return 'Por favor usa un email corporativo o personal válido';
    }
    
    return '';
  };

  const handleNext = () => {
    if (currentStep === 1) {
      const error = validateEmail(formData.email || '');
      if (error) {
        setEmailError(error);
        return;
      }
      setEmailError('');
    }

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
    if (field === 'email') {
      setEmailError('');
    }
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
          <div className="space-y-6 slide-in">
            <div>
              <Label htmlFor="email" className="text-lg font-medium text-[#3E3E3E]">Tu email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="tu@empresa.com"
                className={`hig-input mt-2 ${emailError ? 'border-red-500' : ''}`}
              />
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              <p className="text-sm text-gray-500 mt-2">Para enviarte tu análisis personalizado</p>
            </div>
            <div>
              <Label htmlFor="businessName" className="text-lg font-medium text-[#3E3E3E]">Nombre de tu negocio</Label>
              <Input
                id="businessName"
                value={formData.businessName || ''}
                onChange={(e) => updateFormData('businessName', e.target.value)}
                placeholder="Mi Empresa"
                className="hig-input mt-2"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 slide-in">
            <div>
              <Label className="text-lg font-medium text-[#3E3E3E]">Industria</Label>
              <Select value={formData.industry || ''} onValueChange={(value) => updateFormData('industry', value)}>
                <SelectTrigger className="hig-input mt-2">
                  <SelectValue placeholder="Selecciona tu industria" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="targetAudience" className="text-lg font-medium text-[#3E3E3E]">Tu cliente ideal</Label>
              <Textarea
                id="targetAudience"
                value={formData.targetAudience || ''}
                onChange={(e) => updateFormData('targetAudience', e.target.value)}
                placeholder="Ej: Mujeres 25-45 años, profesionales con ingresos medio-alto..."
                className="hig-input mt-2 min-h-[100px]"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 slide-in">
            <div>
              <Label className="text-lg font-medium text-[#3E3E3E] mb-4 block">
                Canales que usas actualmente
                <span className="text-sm text-gray-500 font-normal block mt-1">Puedes seleccionar múltiples opciones</span>
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {channels.map(channel => (
                  <div key={channel} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <Checkbox
                      id={channel}
                      checked={formData.currentChannels?.includes(channel) || false}
                      onCheckedChange={(checked) => handleChannelChange(channel, checked as boolean)}
                    />
                    <Label htmlFor={channel} className="flex-1 cursor-pointer text-[#3E3E3E]">{channel}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 slide-in">
            <div>
              <Label className="text-lg font-medium text-[#3E3E3E]">Presupuesto mensual para marketing</Label>
              <Select value={formData.monthlyBudget?.toString() || ''} onValueChange={(value) => updateFormData('monthlyBudget', parseInt(value))}>
                <SelectTrigger className="hig-input mt-2">
                  <SelectValue placeholder="Selecciona tu rango de presupuesto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="400000">Menos de $400.000 CLP</SelectItem>
                  <SelectItem value="1600000">$400.000 - $1.600.000 CLP</SelectItem>
                  <SelectItem value="4000000">$1.600.000 - $4.000.000 CLP</SelectItem>
                  <SelectItem value="8000000">$4.000.000 - $8.000.000 CLP</SelectItem>
                  <SelectItem value="16000000">Más de $8.000.000 CLP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-lg font-medium text-[#3E3E3E]">Objetivo principal</Label>
              <Select value={formData.primaryGoal || ''} onValueChange={(value) => updateFormData('primaryGoal', value)}>
                <SelectTrigger className="hig-input mt-2">
                  <SelectValue placeholder="¿Qué quieres lograr principalmente?" />
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

      case 5:
        return (
          <div className="space-y-6 slide-in">
            <div>
              <Label className="text-lg font-medium text-[#3E3E3E] mb-4 block">
                Principales desafíos
                <span className="text-sm text-gray-500 font-normal block mt-1">Puedes seleccionar múltiples opciones</span>
              </Label>
              <div className="grid grid-cols-1 gap-3">
                {challenges.map(challenge => (
                  <div key={challenge} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <Checkbox
                      id={challenge}
                      checked={formData.currentChallenges?.includes(challenge) || false}
                      onCheckedChange={(checked) => handleChallengeChange(challenge, checked as boolean)}
                    />
                    <Label htmlFor={challenge} className="flex-1 cursor-pointer text-[#3E3E3E]">{challenge}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 slide-in">
            <div>
              <Label className="text-lg font-medium text-[#3E3E3E]">¿En cuánto tiempo esperas resultados?</Label>
              <Select value={formData.timeframe || ''} onValueChange={(value) => updateFormData('timeframe', value)}>
                <SelectTrigger className="hig-input mt-2">
                  <SelectValue placeholder="Selecciona tu expectativa de tiempo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-3 meses">1-3 meses</SelectItem>
                  <SelectItem value="3-6 meses">3-6 meses</SelectItem>
                  <SelectItem value="6-12 meses">6-12 meses</SelectItem>
                  <SelectItem value="12+ meses">Más de 12 meses</SelectItem>
                </SelectContent>
              </Select>
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
        return formData.email && formData.businessName && !emailError;
      case 2:
        return formData.industry && formData.targetAudience;
      case 3:
        return formData.currentChannels && formData.currentChannels.length > 0;
      case 4:
        return formData.monthlyBudget && formData.primaryGoal;
      case 5:
        return formData.currentChallenges && formData.currentChallenges.length > 0;
      case 6:
        return formData.timeframe;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Progress */}
        <div className="mb-8 fade-in">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-[#3E3E3E]">Planificador Estratégico</h1>
            <span className="text-sm text-gray-500">{currentStep} de {totalSteps}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-[#1FA2FF] h-1 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Card */}
        <Card className="hig-card mb-8">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl text-[#3E3E3E]">
              {currentStep === 1 && "Empecemos"}
              {currentStep === 2 && "Tu negocio"}
              {currentStep === 3 && "Canales actuales"}
              {currentStep === 4 && "Objetivos"}
              {currentStep === 5 && "Desafíos"}
              {currentStep === 6 && "Cronograma"}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="hig-button-secondary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {currentStep === 1 ? 'Atrás' : 'Anterior'}
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="hig-button-primary"
          >
            {currentStep === totalSteps ? (
              <>
                Generar Análisis
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
