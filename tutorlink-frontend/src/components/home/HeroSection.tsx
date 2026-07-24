import { useNavigate } from 'react-router-dom';
import heroBg from '../../assets/hero-bg.jpg';
// ╔══════════════════════════════════════════════════════════╗
// ║  IMAGE DE FOND — À PERSONNALISER                         ║
// ║                                                          ║
// ║  Option 1 — Fichier local :                              ║
// ║  Placez votre image dans : src/assets/hero-bg.jpg        ║
// ║  Puis importez-la en haut : import heroBg from          ║
// ║    '../../assets/hero-bg.jpg'                            ║
// ║  Et remplacez bg-[url('/hero-bg.jpg')] par              ║
// ║    style={{ backgroundImage: `url(${heroBg})` }}        ║
// ║                                                          ║
// ║  Option 2 — URL externe :                                ║
// ║  Remplacez bg-[url('/hero-bg.jpg')] par                  ║
// ║    bg-[url('https://votre-url.com/image.jpg')]           ║
// ╚══════════════════════════════════════════════════════════╝

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section
      className="relative min-h-screen flex items-center
                 justify-center overflow-hidden"
    >
      {/*
        ══════════════════════════════════
        IMAGE DE FOND — MODIFIEZ ICI
        Remplacez bg-[#1a2744] par votre image :
        className="absolute inset-0 bg-cover bg-center bg-no-repeat
                   bg-[url('/src/assets/hero-bg.jpg')]"
        ══════════════════════════════════
      */}
      <div
  className="absolute inset-0 bg-cover bg-center bg-no-repeat
  bg-[url('/src/assets/hero-bg.jpg')]"
/>
      {/* Overlay dégradé pour lisibilité du texte */}
      <div className="absolute inset-0
                      bg-gradient-to-b from-[#1a2744]/90
                      via-[#1a2744]/60 to-[#1a2744]/90" />

      {/* Cercles décoratifs animés en arrière-plan */}
      <div className="absolute top-20 left-10 w-64 h-64
                      rounded-full bg-yellow-400/5
                      blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96
                      rounded-full bg-blue-400/5
                      blur-3xl pointer-events-none" />

      {/* Contenu centré */}
      <div className="relative z-10 text-center px-6
                      max-w-4xl mx-auto flex flex-col
                      items-center gap-6">

        {/* Badge localisation */}
        <div className="flex items-center gap-2 bg-white/10
                        backdrop-blur-sm border border-white/20
                        rounded-full px-4 py-1.5">
          <span className="text-yellow-400 text-sm">📍</span>
          <span className="text-white/90 text-sm font-medium">
            Dschang · Ouest Cameroun
          </span>
        </div>

        {/* Titre principal */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl
                       font-bold text-white leading-tight">
          L'excellence{' '}
          <span className="text-yellow-400 relative">
            scolaire
            {/* Soulignement décoratif */}
            <svg className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 200 8" fill="none">
              <path d="M0 6 Q50 0 100 4 Q150 8 200 2"
                stroke="#E9A319" strokeWidth="3"
                strokeLinecap="round" fill="none" />
            </svg>
          </span>
          <br />à portée de main
        </h1>

        {/* Sous-titre */}
        <p className="text-white/70 text-base md:text-lg
                      max-w-2xl leading-relaxed">
          Trouvez le répétiteur idéal pour votre enfant à Dschang.
          Du primaire au BAC C/D, des enseignants qualifiés et
          vérifiés près de chez vous.
        </p>

        {/* Boutons CTA */}
        <div className="flex flex-col sm:flex-row gap-3
                        items-center justify-center w-full max-w-md">
          <button
            onClick={() => navigate('/repetiteurs')}
            className="w-full sm:w-auto bg-yellow-400
                       hover:bg-yellow-300 text-gray-900
                       font-bold px-8 py-3.5 rounded-xl
                       cursor-pointer transition-all
                       hover:shadow-lg hover:shadow-yellow-400/30
                       flex items-center justify-center gap-2 text-sm"
          >
            🔍 Trouver un répétiteur
          </button>
          <button
            onClick={() => navigate('/inscription')}
            className="w-full sm:w-auto border-2 border-white/40
                       hover:border-white text-white font-bold
                       px-8 py-3.5 rounded-xl cursor-pointer
                       transition-all hover:bg-white/10
                       flex items-center justify-center gap-2 text-sm"
          >
            🎓 Devenir répétiteur
          </button>
        </div>

        {/* Statistiques sous les boutons */}
        <div className="flex flex-wrap justify-center gap-8 mt-4">
          {[
            { value: '500+', label: 'Répétiteurs', icon: '🎓' },
            { value: '3 000+', label: 'Élèves', icon: '👨‍🎓' },
            { value: '98%', label: 'Satisfaction', icon: '⭐' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-yellow-400">
                {s.icon} {s.value}
              </p>
              <p className="text-white/60 text-xs uppercase
                            font-semibold tracking-wide mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Flèche scroll vers le bas */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2
                      text-white/40 animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12l7 7 7-7"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;