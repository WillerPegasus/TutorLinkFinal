import { Link } from 'react-router-dom';

// Navbar publique de la page d'accueil
const HomeNavbar = () => (
  <nav className="absolute top-0 left-0 right-0 z-20
                  px-6 py-4 flex items-center justify-between">

    {/* Logo */}
    <Link to="/" className="flex items-center gap-2">
      <span className="text-2xl">🎓</span>
      <span className="text-white font-bold text-xl">
        Tutor<span className="text-yellow-400">Link</span>
      </span>
    </Link>

    {/* Menu central */}
    <div className="hidden md:flex items-center gap-6 text-sm">
      <Link to="/repetiteurs"
        className="text-white/80 hover:text-white transition-colors">
        Répétiteurs
      </Link>
      <Link to="/groupes"
        className="text-white/80 hover:text-white transition-colors">
        Groupes
      </Link>
      <a href="tarifs"
        className="text-white/80 hover:text-white transition-colors">
        Comment ça marche
      </a>
      <a href="#avantages"
        className="text-white/80 hover:text-white transition-colors">
        À propos
      </a>
    </div>

    {/* Boutons CTA */}
    <div className="flex items-center gap-2">
      <Link to="/connexion"
        className="text-white border border-white/40
                   hover:border-white px-4 py-2 rounded-lg
                   text-sm transition-colors">
        Connexion
      </Link>
      <Link to="/inscription"
        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900
                   font-bold px-4 py-2 rounded-lg text-sm
                   transition-colors">
        S'inscrire
      </Link>
    </div>
  </nav>
);

export default HomeNavbar;