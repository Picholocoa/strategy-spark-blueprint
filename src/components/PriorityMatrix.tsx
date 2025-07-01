
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, CheckCircle } from 'lucide-react';

interface Recommendation {
  priority: string;
  title: string;
  description: string;
  timeframe: string;
  effort: string;
  impact: string;
}

interface PriorityMatrixProps {
  recommendations: Recommendation[];
}

export const PriorityMatrix = ({ recommendations }: PriorityMatrixProps) => {
  const getTimeframeOrder = (timeframe: string) => {
    if (timeframe.includes('semana')) return 1;
    if (timeframe.includes('1-2 meses') || timeframe.includes('1 mes')) return 2;
    if (timeframe.includes('1-3 meses')) return 3;
    return 4;
  };

  const sortedRecommendations = recommendations.sort((a, b) => {
    // First by priority (Alta > Media > Baja)
    const priorityOrder = { 'Alta': 1, 'Media': 2, 'Baja': 3 };
    const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] - 
                        priorityOrder[b.priority as keyof typeof priorityOrder];
    
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then by timeframe (shorter first)
    return getTimeframeOrder(a.timeframe) - getTimeframeOrder(b.timeframe);
  });

  const getPhase = (index: number) => {
    if (index < 2) return { phase: 'Fase 1: Fundación', period: 'Primeros 30 días', color: 'bg-red-100 text-red-700' };
    if (index < 4) return { phase: 'Fase 2: Crecimiento', period: 'Días 31-60', color: 'bg-yellow-100 text-yellow-700' };
    return { phase: 'Fase 3: Optimización', period: 'Días 61-90', color: 'bg-green-100 text-green-700' };
  };

  let currentPhase = '';

  return (
    <div className="space-y-6">
      {sortedRecommendations.map((rec, index) => {
        const phaseInfo = getPhase(index);
        const showPhaseHeader = phaseInfo.phase !== currentPhase;
        
        if (showPhaseHeader) {
          currentPhase = phaseInfo.phase;
        }

        return (
          <div key={index}>
            {showPhaseHeader && (
              <div className="flex items-center mb-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <Badge className={`mx-4 px-4 py-2 ${phaseInfo.color}`}>
                  {phaseInfo.phase} • {phaseInfo.period}
                </Badge>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>
            )}
            
            <Card className="strategy-card hover:shadow-lg transition-all duration-300">
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
                        {rec.priority}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {rec.timeframe}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{rec.title}</h3>
                    <p className="text-gray-600 mb-4">{rec.description}</p>
                  </div>
                  <div className="flex flex-col items-center ml-4">
                    <TrendingUp className="h-8 w-8 text-strategy-500 mb-2" />
                    <span className="text-xs text-gray-500">Impacto {rec.impact}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-500">
                    <span>Esfuerzo: {rec.effort}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Listo para implementar</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
      
      <div className="mt-8 p-6 bg-gradient-to-r from-strategy-50 to-success-50 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">💡 Consejo Pro</h3>
        <p className="text-gray-700">
          No trates de implementar todo a la vez. Enfócate en completar la Fase 1 antes de pasar a la siguiente. 
          Cada fase construye sobre la anterior para maximizar tus resultados.
        </p>
      </div>
    </div>
  );
};
