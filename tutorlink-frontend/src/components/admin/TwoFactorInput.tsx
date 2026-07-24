import { useRef } from 'react';

interface Props {
  onComplete: (otp: string) => void; // appelé quand les 6 chiffres sont saisis
}

const TwoFactorInput = ({ onComplete }: Props) => {
  // Un ref par case pour gérer le focus automatique
  const inputs = useRef<HTMLInputElement[]>([]);

  const handleChange = (value: string, index: number) => {
    // N'accepte que les chiffres
    if (!/^\d$/.test(value)) return;

    // Passe automatiquement à la case suivante
    if (index < 5) inputs.current[index + 1]?.focus();

    // Quand les 6 cases sont remplies, assemble le code et notifie le parent
    const otp = inputs.current.map(i => i.value).join('');
    if (otp.length === 6) onComplete(otp);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    // Retour arrière : efface et revient à la case précédente
    if (e.key === 'Backspace' && !inputs.current[index].value && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={el => { if (el) inputs.current[i] = el; }}
          maxLength={1}
          onChange={e => handleChange(e.target.value, i)}
          onKeyDown={e => handleKeyDown(e, i)}
          style={{
            width: 48, height: 56, textAlign: 'center',
            fontSize: 24, fontWeight: 'bold', borderRadius: 8,
            border: '2px solid #1a2744', outline: 'none',
          }}
        />
      ))}
    </div>
  );
};

export default TwoFactorInput;