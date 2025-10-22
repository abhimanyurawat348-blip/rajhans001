import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Beaker, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Info, 
  Zap, 
  Thermometer, 
  Gauge, 
  Activity,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Download,
  Share2
} from 'lucide-react';

interface LabExperiment {
  id: string;
  title: string;
  subject: 'Physics' | 'Chemistry' | 'Biology';
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // in minutes
  objectives: string[];
  materials: string[];
  steps: LabStep[];
  simulationData: SimulationData;
}

interface LabStep {
  id: string;
  title: string;
  description: string;
  actionRequired: boolean;
  expectedOutcome: string;
}

interface SimulationData {
  initialState: Record<string, any>;
  variables: SimulationVariable[];
  equations: string[];
}

interface SimulationVariable {
  name: string;
  label: string;
  type: 'slider' | 'dropdown' | 'toggle';
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  defaultValue: any;
  unit?: string;
}

interface SimulationState {
  [key: string]: any;
}

const VirtualLabSimulation: React.FC = () => {
  const [currentExperiment, setCurrentExperiment] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [simulationState, setSimulationState] = useState<SimulationState>({});
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  // Mock physics experiments data
  const [experiments] = useState<LabExperiment[]>([
    {
      id: '1',
      title: 'Newton\'s Laws of Motion',
      subject: 'Physics',
      description: 'Explore the three fundamental laws that describe the relationship between forces acting on a body and its motion.',
      difficulty: 'medium',
      estimatedTime: 45,
      objectives: [
        'Understand Newton\'s First Law (Law of Inertia)',
        'Apply Newton\'s Second Law (F = ma)',
        'Demonstrate Newton\'s Third Law (Action-Reaction)'
      ],
      materials: ['Cart', 'Track', 'Weights', 'Force sensor', 'Motion detector'],
      steps: [
        {
          id: '1-1',
          title: 'Setup the Experiment',
          description: 'Place the cart on the track and attach the force sensor.',
          actionRequired: true,
          expectedOutcome: 'Cart should be stationary on the track'
        },
        {
          id: '1-2',
          title: 'Apply Force',
          description: 'Gradually apply force to the cart using the force sensor.',
          actionRequired: true,
          expectedOutcome: 'Cart begins to move with acceleration proportional to applied force'
        },
        {
          id: '1-3',
          title: 'Observe Inertia',
          description: 'Stop applying force and observe the cart\'s motion.',
          actionRequired: true,
          expectedOutcome: 'Cart continues moving at constant velocity (Newton\'s First Law)'
        }
      ],
      simulationData: {
        initialState: {
          mass: 2.0,
          force: 0,
          velocity: 0,
          acceleration: 0,
          friction: 0.1
        },
        variables: [
          {
            name: 'mass',
            label: 'Mass',
            type: 'slider',
            min: 0.5,
            max: 10,
            step: 0.1,
            defaultValue: 2.0,
            unit: 'kg'
          },
          {
            name: 'force',
            label: 'Applied Force',
            type: 'slider',
            min: 0,
            max: 50,
            step: 1,
            defaultValue: 0,
            unit: 'N'
          },
          {
            name: 'friction',
            label: 'Friction Coefficient',
            type: 'slider',
            min: 0,
            max: 1,
            step: 0.01,
            defaultValue: 0.1,
            unit: ''
          }
        ],
        equations: [
          'F_net = F_applied - (friction * mass * 9.8)',
          'acceleration = F_net / mass',
          'velocity = velocity + acceleration * dt',
          'position = position + velocity * dt'
        ]
      }
    },
    {
      id: '2',
      title: 'Ohm\'s Law',
      subject: 'Physics',
      description: 'Investigate the relationship between voltage, current, and resistance in electrical circuits.',
      difficulty: 'easy',
      estimatedTime: 30,
      objectives: [
        'Verify Ohm\'s Law (V = IR)',
        'Measure current and voltage in series circuits',
        'Calculate resistance from measured values'
      ],
      materials: ['Battery', 'Resistors', 'Ammeter', 'Voltmeter', 'Connecting wires'],
      steps: [
        {
          id: '2-1',
          title: 'Build the Circuit',
          description: 'Connect the battery, resistor, ammeter, and voltmeter in series.',
          actionRequired: true,
          expectedOutcome: 'Closed circuit with all components properly connected'
        },
        {
          id: '2-2',
          title: 'Measure Voltage and Current',
          description: 'Record voltage and current readings for different resistor values.',
          actionRequired: true,
          expectedOutcome: 'Voltage and current values follow Ohm\'s Law'
        }
      ],
      simulationData: {
        initialState: {
          voltage: 0,
          resistance: 10,
          current: 0
        },
        variables: [
          {
            name: 'voltage',
            label: 'Voltage',
            type: 'slider',
            min: 0,
            max: 20,
            step: 0.5,
            defaultValue: 0,
            unit: 'V'
          },
          {
            name: 'resistance',
            label: 'Resistance',
            type: 'slider',
            min: 1,
            max: 100,
            step: 1,
            defaultValue: 10,
            unit: 'Ω'
          }
        ],
        equations: [
          'current = voltage / resistance'
        ]
      }
    }
  ]);

  // Initialize simulation state
  useEffect(() => {
    const initialState = experiments[currentExperiment].simulationData.initialState;
    setSimulationState(initialState);
  }, [currentExperiment, experiments]);

  const handleVariableChange = (name: string, value: any) => {
    setSimulationState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const playSimulation = () => {
    setIsPlaying(true);
  };

  const pauseSimulation = () => {
    setIsPlaying(false);
  };

  const resetSimulation = () => {
    setIsPlaying(false);
    const initialState = experiments[currentExperiment].simulationData.initialState;
    setSimulationState(initialState);
    setActiveStep(0);
  };

  const nextExperiment = () => {
    if (currentExperiment < experiments.length - 1) {
      setCurrentExperiment(currentExperiment + 1);
    }
  };

  const prevExperiment = () => {
    if (currentExperiment > 0) {
      setCurrentExperiment(currentExperiment - 1);
    }
  };

  const nextStep = () => {
    if (activeStep < experiments[currentExperiment].steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate derived values based on equations
  const calculateDerivedValues = () => {
    const exp = experiments[currentExperiment];
    const state = simulationState;
    
    // This is a simplified calculation - in a real implementation, 
    // this would be more complex and use a proper physics engine
    if (exp.id === '1') { // Newton's Laws
      const netForce = state.force - (state.friction * state.mass * 9.8);
      const acceleration = netForce / state.mass;
      return { netForce, acceleration };
    } else if (exp.id === '2') { // Ohm's Law
      const current = state.voltage / state.resistance;
      return { current };
    }
    
    return {};
  };

  const derivedValues = calculateDerivedValues();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Beaker className="h-6 w-6 text-purple-600 mr-2" />
            Virtual Lab Simulations
          </h1>
          <p className="text-gray-600 mt-1">Interactive experiments for Physics, Chemistry, and Biology</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            {isMuted ? <VolumeX className="h-5 w-5 text-gray-600" /> : <Volume2 className="h-5 w-5 text-gray-600" />}
          </button>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <Info className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <Share2 className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <Download className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Experiment Selector */}
      <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-xl">
        <button
          onClick={prevExperiment}
          disabled={currentExperiment === 0}
          className={`p-2 rounded-full ${
            currentExperiment === 0 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">
            {experiments[currentExperiment].title}
          </h2>
          <div className="flex items-center justify-center mt-1 space-x-3">
            <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(experiments[currentExperiment].difficulty)}`}>
              {experiments[currentExperiment].difficulty}
            </span>
            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
              {experiments[currentExperiment].subject}
            </span>
            <span className="text-xs text-gray-500">
              {experiments[currentExperiment].estimatedTime} min
            </span>
          </div>
        </div>
        
        <button
          onClick={nextExperiment}
          disabled={currentExperiment === experiments.length - 1}
          className={`p-2 rounded-full ${
            currentExperiment === experiments.length - 1 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulation Controls */}
        <div className="lg:col-span-2 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Simulation Controls</h3>
            <div className="mt-3 md:mt-0 flex space-x-2">
              {!isPlaying ? (
                <button
                  onClick={playSimulation}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Play
                </button>
              ) : (
                <button
                  onClick={pauseSimulation}
                  className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </button>
              )}
              <button
                onClick={resetSimulation}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </button>
            </div>
          </div>

          {/* Variable Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {experiments[currentExperiment].simulationData.variables.map((variable) => (
              <div key={variable.name} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">{variable.label}</label>
                  <span className="text-sm text-gray-500">
                    {simulationState[variable.name]}{variable.unit}
                  </span>
                </div>
                {variable.type === 'slider' && (
                  <input
                    type="range"
                    min={variable.min}
                    max={variable.max}
                    step={variable.step}
                    value={simulationState[variable.name]}
                    onChange={(e) => handleVariableChange(variable.name, parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Simulation Visualization */}
          <div className="bg-white rounded-xl p-6 shadow-sm h-64 flex items-center justify-center relative overflow-hidden">
            {/* Physics simulation visualization */}
            {experiments[currentExperiment].id === '1' && (
              <div className="relative w-full h-full">
                {/* Track */}
                <div className="absolute bottom-10 left-0 right-0 h-2 bg-gray-300 rounded"></div>
                
                {/* Cart */}
                <motion.div
                  className="absolute bottom-12 w-16 h-8 bg-blue-500 rounded"
                  style={{ 
                    left: `${(simulationState.force || 0) * 2}%`,
                    transition: 'left 0.1s linear'
                  }}
                  animate={isPlaying ? { 
                    left: `${Math.min(90, (simulationState.force || 0) * 2 + (derivedValues.acceleration || 0) * 2)}%` 
                  } : {}}
                >
                  <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                    Cart
                  </div>
                </motion.div>
                
                {/* Force arrow */}
                {simulationState.force > 0 && (
                  <div 
                    className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
                    style={{ left: '10%' }}
                  >
                    <div className="flex items-center">
                      <div 
                        className="h-1 bg-red-500 rounded"
                        style={{ width: `${simulationState.force * 3}px` }}
                      ></div>
                      <div className="w-0 h-0 border-t-4 border-b-4 border-l-8 border-l-red-500 border-t-transparent border-b-transparent"></div>
                    </div>
                    <div className="text-xs text-red-600 mt-1 text-center">
                      {simulationState.force}N
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {experiments[currentExperiment].id === '2' && (
              <div className="relative w-full h-full">
                {/* Circuit visualization */}
                <div className="flex items-center justify-center space-x-8">
                  {/* Battery */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-12 bg-gray-800 rounded flex items-center justify-center">
                      <div className="w-4 h-8 bg-gray-600 rounded"></div>
                    </div>
                    <div className="text-xs mt-1">Battery</div>
                  </div>
                  
                  {/* Resistor */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-4 bg-red-500 rounded flex items-center justify-center">
                      <div className="text-white text-xs font-bold">
                        {simulationState.resistance}Ω
                      </div>
                    </div>
                    <div className="text-xs mt-1">Resistor</div>
                  </div>
                  
                  {/* Ammeter */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="text-white text-xs font-bold">
                        {derivedValues.current !== undefined ? derivedValues.current.toFixed(2) : '0.00'}A
                      </div>
                    </div>
                    <div className="text-xs mt-1">Ammeter</div>
                  </div>
                  
                  {/* Voltmeter */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="text-white text-xs font-bold">
                        {simulationState.voltage}V
                      </div>
                    </div>
                    <div className="text-xs mt-1">Voltmeter</div>
                  </div>
                </div>
                
                {/* Connecting wires */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-400"></div>
              </div>
            )}
            
            {/* Play indicator */}
            {isPlaying && (
              <div className="absolute top-4 right-4 flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm text-green-600 font-medium">Running</span>
              </div>
            )}
          </div>

          {/* Real-time Data */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {experiments[currentExperiment].id === '1' && (
              <>
                <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                  <div className="text-xs text-gray-500">Net Force</div>
                  <div className="text-lg font-bold text-gray-900">
                    {derivedValues.netForce !== undefined ? derivedValues.netForce.toFixed(2) : '0.00'}N
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                  <div className="text-xs text-gray-500">Acceleration</div>
                  <div className="text-lg font-bold text-gray-900">
                    {derivedValues.acceleration !== undefined ? derivedValues.acceleration.toFixed(2) : '0.00'}m/s²
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                  <div className="text-xs text-gray-500">Mass</div>
                  <div className="text-lg font-bold text-gray-900">
                    {simulationState.mass}kg
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                  <div className="text-xs text-gray-500">Friction</div>
                  <div className="text-lg font-bold text-gray-900">
                    {simulationState.friction}
                  </div>
                </div>
              </>
            )}
            
            {experiments[currentExperiment].id === '2' && (
              <>
                <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                  <div className="text-xs text-gray-500">Voltage</div>
                  <div className="text-lg font-bold text-gray-900">
                    {simulationState.voltage}V
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                  <div className="text-xs text-gray-500">Current</div>
                  <div className="text-lg font-bold text-gray-900">
                    {derivedValues.current !== undefined ? derivedValues.current.toFixed(2) : '0.00'}A
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                  <div className="text-xs text-gray-500">Resistance</div>
                  <div className="text-lg font-bold text-gray-900">
                    {simulationState.resistance}Ω
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                  <div className="text-xs text-gray-500">Power</div>
                  <div className="text-lg font-bold text-gray-900">
                    {derivedValues.current !== undefined 
                      ? (simulationState.voltage * derivedValues.current).toFixed(2) 
                      : '0.00'}W
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Experiment Guide */}
        <div className="space-y-6">
          {/* Objectives */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Target className="h-4 w-4 text-blue-600 mr-2" />
              Learning Objectives
            </h3>
            <ul className="space-y-2">
              {experiments[currentExperiment].objectives.map((objective, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Procedure Steps */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Activity className="h-4 w-4 text-purple-600 mr-2" />
              Procedure Steps
            </h3>
            <div className="space-y-3">
              {experiments[currentExperiment].steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`p-3 rounded-lg border ${
                    index === activeStep 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === activeStep 
                        ? 'bg-blue-500 text-white' 
                        : index < activeStep 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-gray-900 text-sm">{step.title}</h4>
                      <p className="text-gray-600 text-xs mt-1">{step.description}</p>
                      {step.actionRequired && (
                        <button className="mt-2 text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                          Perform Action
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between mt-3">
                <button
                  onClick={prevStep}
                  disabled={activeStep === 0}
                  className={`px-3 py-1 text-sm rounded ${
                    activeStep === 0 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  disabled={activeStep === experiments[currentExperiment].steps.length - 1}
                  className={`px-3 py-1 text-sm rounded ${
                    activeStep === experiments[currentExperiment].steps.length - 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Materials */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Settings className="h-4 w-4 text-gray-600 mr-2" />
              Required Materials
            </h3>
            <ul className="space-y-1">
              {experiments[currentExperiment].materials.map((material, index) => (
                <li key={index} className="flex items-center text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                  {material}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200"
        >
          <h3 className="font-semibold text-gray-900 mb-3">About This Experiment</h3>
          <p className="text-gray-700 mb-4">
            {experiments[currentExperiment].description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Key Concepts</h4>
              <ul className="space-y-1">
                <li className="flex items-center text-sm text-gray-700">
                  <Zap className="h-4 w-4 text-yellow-500 mr-2" />
                  Newton's Laws of Motion
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Thermometer className="h-4 w-4 text-red-500 mr-2" />
                  Force and Acceleration
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Gauge className="h-4 w-4 text-green-500 mr-2" />
                  Friction and Motion
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Real-world Applications</h4>
              <p className="text-sm text-gray-700">
                Understanding these principles helps explain how vehicles accelerate, 
                how seatbelts work, and how rockets are launched into space.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VirtualLabSimulation;