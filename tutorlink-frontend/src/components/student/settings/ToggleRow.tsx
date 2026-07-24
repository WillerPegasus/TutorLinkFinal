interface Props {
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}

// Ligne avec interrupteur on/off réutilisable
const ToggleRow = ({ label, description, checked, onToggle }: Props) => (
  <div className="flex items-center justify-between py-3
                  border-b border-gray-50 last:border-0">
    <div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="text-xs text-gray-400 mt-0.5">{description}</p>
    </div>

    {/* Switch toggle */}
    <button
      onClick={onToggle}
      className={`w-12 h-6 rounded-full relative cursor-pointer
                  transition-colors flex-shrink-0
                  ${checked ? 'bg-[#1a2744]' : 'bg-gray-200'}`}
    >
      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5
                       transition-all shadow-sm
                       ${checked ? 'left-6' : 'left-0.5'}`} />
    </button>
  </div>
);

export default ToggleRow;