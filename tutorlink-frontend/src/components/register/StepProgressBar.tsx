interface Props {
  current: number;
  total: number;
  role: string | null;
}

// Barre de progression multi-étapes
const StepProgressBar = ({ current, total, role }: Props) => {
  // Labels des étapes selon le rôle
  const steps = role === 'REPETITEUR'
    ? ['Rôle', 'Infos', 'Pédagogie', 'Documents']
    : ['Rôle', 'Infos'];

  return (
    <div className="mb-6">
      {/* Barre de progression */}
      <div className="flex items-center gap-0 mb-3">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            {/* Cercle étape */}
            <div className={`w-8 h-8 rounded-full flex items-center
                            justify-center text-xs font-bold flex-shrink-0
                            transition-colors
                            ${i + 1 < current
                              ? 'bg-green-500 text-white'
                              : i + 1 === current
                                ? 'bg-[#1a2744] text-white'
                                : 'bg-gray-100 text-gray-400'
                            }`}>
              {i + 1 < current ? '✓' : i + 1}
            </div>
            {/* Ligne entre étapes */}
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 transition-colors
                ${i + 1 < current ? 'bg-green-500' : 'bg-gray-100'}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Labels */}
      <div className="flex justify-between">
        {steps.map((label, i) => (
          <p key={label}
            className={`text-xs font-medium
              ${i + 1 === current
                ? 'text-[#1a2744]'
                : i + 1 < current
                  ? 'text-green-500'
                  : 'text-gray-300'
              }`}>
            {label}
          </p>
        ))}
      </div>
    </div>
  );
};

export default StepProgressBar;