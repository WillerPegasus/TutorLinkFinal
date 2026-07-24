interface Props {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
}

// Zone de saisie du message avec bouton envoyer
const ChatInput = ({ value, onChange, onSend }: Props) => {

  // Envoyer avec Entrée (Shift+Entrée pour saut de ligne)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="bg-white border-t border-gray-100 px-5 py-4">
      <div className="flex items-end gap-3">

        {/* Zone de texte */}
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Écrire un message..."
          rows={1}
          className="flex-1 border border-gray-200 rounded-xl
                     px-4 py-2.5 text-sm resize-none
                     focus:outline-none focus:ring-2 focus:ring-blue-300
                     max-h-32 overflow-y-auto"
          style={{ minHeight: 44 }}
        />

        {/* Bouton envoyer */}
        <button
          onClick={onSend}
          disabled={!value.trim()}
          className="bg-[#1a2744] hover:bg-blue-900 text-white
                     font-bold px-5 py-2.5 rounded-xl
                     cursor-pointer transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed
                     flex items-center gap-2 flex-shrink-0"
        >
          Envoyer ▶
        </button>
      </div>

      {/* Astuce clavier */}
      <p className="text-xs text-gray-300 mt-1 ml-1">
        Entrée pour envoyer · Shift+Entrée pour saut de ligne
      </p>
    </div>
  );
};

export default ChatInput;