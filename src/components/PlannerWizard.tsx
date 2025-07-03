
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { BusinessData } from '@/pages/Index';

interface PlannerWizardProps {
  onComplete: (data: BusinessData) => void;
}

export const PlannerWizard = ({ onComplete }: PlannerWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<BusinessData>({
    businessName: '',
    email: '',
    industry: '',
    monthlyBudget: 0,
    primaryGoal: '',
    targetAudience: '',
    currentChannels: [],
    currentChallenges: [],
    timeframe: '',
    teamSize: ''
  });

  console.log('PlannerWizard rendering, current step:', currentStep);
  console.log('Form data:', formData);

  const industries = [
    'E-commerce',
    'Tecnología',
    'Servicios Profesionales',
    'Salud',
    'Educación',
    'Restaurantes/Gastronomía',
    'Inmobiliaria',
    'Turismo',
    'Manufactura',
    'Otro'
  ];

  const budgetRanges = [
    { label: 'Sin presupuesto definido', value: 0, display: 'Sin presupuesto' },
    { label: '$0 - $400.000', value: 200000, display: '$200k promedio' },
    { label: '$400.000 - $800.000', value: 600000, display: '$600k promedio' },
    { label: '$800.000 - $1.600.000', value: 1200000, display: '$1.2M promedio' },
    { label: '$1.600.000 - $4.000.000', value: 2800000, display: '$2.8M promedio' },
    { label: 'Más de $4.000.000', value: 5000000, display: '$5M+' }
  ];

  const goals = [
    'Aumentar ventas',
    'Generar más leads',
    'Mejorar reconocimiento de marca',
    'Fidelizar clientes existentes'
  ];

  const channels = [
    'Google Ads',
    'Facebook Ads',
    'Instagram',
    'LinkedIn Ads',
    'SEO',
    'Email Marketing',
    'WhatsApp Business',
    'Influencers',
    'Referidos',
    'Ninguno actualmente'
  ];

  const challenges = [
    'Medir resultados',
    'Generar leads de calidad',
    'Optimizar conversiones',
    'Gestionar múltiples canales',
    'Crear contenido consistente',
    'Definir audiencia objetivo',
    'Competencia muy alta',
    'Presupuesto limitado'
  ];

  const timeframes = [
    '1-3 meses',
    '3-6 meses',
    '6-12 meses',
    'Más de 12 meses'
  ];

  const teamSizes = [
    'Solo yo',
    '2-5 personas',
    '6-20 personas',
    'Más de 20 personas'
  ];

  const steps = [
    {
      title: 'Información Básica',
      description: 'Cuéntanos sobre tu empresa'
    },
    {
      title: 'Presupuesto y Objetivos',
      description: 'Define tu inversión y metas'
    },
    {
      title: 'Situación Actual',
      description: 'Canales y desafíos actuales'
    },
    {
      title: 'Planificación',
      description: 'Tiempos y recursos'
    }
  ];

  const handleNext = () => {
    console.log('handleNext called, current step:', currentStep);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Completing wizard with data:', formData);
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCheckboxChange = (value: string, field: 'currentChannels' | 'currentChallenges') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.businessName && formData.email && formData.industry;
      case 1:
        return formData.monthlyBudget !== undefined && formData.primaryGoal;
      case 2:
        return formData.currentChannels.length > 0 && formData.currentChallenges.length > 0;
      case 3:
        return formData.timeframe && formData.teamSize;
      default:
        return false;
    }
  };

  const renderStep = () => {
    try {
      switch (currentStep) {
        case 0:
          return (
            <div className="space-y-6">
              <div>
                <Label htmlFor="businessName">Nombre de tu empresa *</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  placeholder="Ej: Mi Startup SPA"
                />
              </div>
              <div>
                <Label htmlFor="email">Email de contacto *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <Label htmlFor="industry">Industria *</Label>
                <Select onValueChange={(value) => setFormData({...formData, industry: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu industria" />
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

        case 1:
          return (
            <div className="space-y-6">
              <div>
                <Label>Presupuesto mensual para marketing *</Label>
                <div className="space-y-3 mt-2">
                  {budgetRanges.map(range => (
                    <div key={range.value} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`budget-${range.value}`}
                        name="budget"
                        value={range.value}
                        checked={formData.monthlyBudget === range.value}
                        onChange={() => setFormData({...formData, monthlyBudget: range.value})}
                        className="text-territory-blue"
                      />
                      <label htmlFor={`budget-${range.value}`} className="flex-1 cursor-pointer">
                        <div className="flex justify-between">
                          <span>{range.label}</span>
                          <Badge variant="outline" className="text-xs">
                            {range.display}
                          </Badge>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label>Objetivo principal *</Label>
                <Select onValueChange={(value) => setFormData({...formData, primaryGoal: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="¿Cuál es tu meta principal?" />
                  </SelectTrigger>
                  <SelectContent>
                    {goals.map(goal => (
                      <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="targetAudience">Audiencia objetivo</Label>
                <Textarea
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                  placeholder="Ej: Empresarios de 30-50 años en Santiago..."
                />
              </div>
            </div>
          );

        case 2:
          return (
            <div className="space-y-6">
              <div>
                <Label>Canales de marketing actuales *</Label>
                <p className="text-sm text-gray-600 mb-3">Selecciona todos los que uses actualmente</p>
                <div className="grid grid-cols-2 gap-2">
                  {channels.map(channel => (
                    <div key={channel} className="flex items-center space-x-2">
                      <Checkbox
                        id={channel}
                        checked={formData.currentChannels.includes(channel)}
                        onCheckedChange={() => handleCheckboxChange(channel, 'currentChannels')}
                      />
                      <Label htmlFor={channel} className="text-sm cursor-pointer">{channel}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label>Principales desafíos *</Label>
                <p className="text-sm text-gray-600 mb-3">¿Qué te genera más dificultades?</p>
                <div className="grid grid-cols-1 gap-2">
                  {challenges.map(challenge => (
                    <div key={challenge} className="flex items-center space-x-2">
                      <Checkbox
                        id={challenge}
                        checked={formData.currentChallenges.includes(challenge)}
                        onCheckedChange={() => handleCheckboxChange(challenge, 'currentChallenges')}
                      />
                      <Label htmlFor={challenge} className="text-sm cursor-pointer">{challenge}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );

        case 3:
          return (
            <div className="space-y-6">
              <div>
                <Label>Plazo para ver resultados *</Label>
                <Select onValueChange={(value) => setFormData({...formData, timeframe: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="¿En cuánto tiempo esperas resultados?" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeframes.map(timeframe => (
                      <SelectItem key={timeframe} value={timeframe}>{timeframe}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tamaño del equipo *</Label>
                <Select onValueChange={(value) => setFormData({...formData, teamSize: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="¿Cuántas personas trabajan en marketing?" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamSizes.map(size => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          );

        default:
          return <div>Error: Paso no encontrado</div>;
      }
    } catch (error) {
      console.error('Error rendering step:', error);
      return (
        <div className="text-center py-8">
          <p className="text-red-600">Error al cargar el formulario</p>
          <Button onClick={() => setCurrentStep(0)} className="mt-4">
            Reiniciar
          </Button>
        </div>
      );
    }
  };

  // Safety check para evitar crashes
  if (currentStep < 0 || currentStep >= steps.length) {
    console.error('Invalid step:', currentStep);
    setCurrentStep(0);
    return null;
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-territory-dark mb-4">
            Análisis Personalizado
          </h1>
          <div className="flex justify-center items-center space-x-2 mb-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep 
                    ? 'bg-territory-blue text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-1 ${
                    index < currentStep ? 'bg-territory-blue' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-territory-dark">
              {steps[currentStep]?.title || 'Cargando...'}
            </CardTitle>
            <p className="text-gray-600">{steps[currentStep]?.description || ''}</p>
          </CardHeader>
          <CardContent>
            {renderStep()}
            
            <div className="flex justify-between pt-6 mt-6 border-t">
              <Button 
                variant="outline" 
                onClick={handleBack}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </Button>
              
              <Button 
                onClick={handleNext}
                disabled={!isStepValid()}
                className="bg-territory-blue hover:bg-blue-600 text-white flex items-center gap-2"
              >
                {currentStep === steps.length - 1 ? 'Generar Análisis' : 'Siguiente'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
