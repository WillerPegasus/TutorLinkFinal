// ============================================================
// FICHIER : src/pages/public/PricingPage.tsx
// RÔLE    : Page publicitaire complète de TutorLink.
//           Présente la plateforme, le modèle économique,
//           les tarifs et les avantages.
//           Signature visuelle : "0 FCFA de commission. Jamais."
// ROUTING : /tarifs
// ============================================================

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PublicFooter from "../../components/public/layout/PublicFooter";

// ════════════════════════════════════════════════════════════════
// DONNÉES DE LA PAGE
// ════════════════════════════════════════════════════════════════

const STATS = [
  { value: 500,    suffix: "+", label: "Répétiteurs actifs",  icon: "🎓" },
  { value: 3000,   suffix: "+", label: "Élèves accompagnés",  icon: "📚" },
  { value: 98,     suffix: "%", label: "Taux de satisfaction", icon: "⭐" },
  { value: 42,     suffix: "",  label: "Groupes de répétition",icon: "👥" },
];

const STUDENT_STEPS = [
  {
    icon: "🔍",
    title: "Trouvez votre répétiteur",
    desc: "Parcourez les profils vérifiés par matière, niveau et quartier à Dschang. Consultez les avis d'autres élèves.",
  },
  {
    icon: "📅",
    title: "Réservez un créneau",
    desc: "Choisissez le jour et l'heure qui vous conviennent selon les disponibilités du répétiteur. Simple et rapide.",
  },
  {
    icon: "💬",
    title: "Suivez vos progrès",
    desc: "Communiquez avec votre répétiteur, suivez vos cours et célébrez vos réussites au BEPC et au BAC.",
  },
];

const TUTOR_STEPS = [
  {
    icon: "📋",
    title: "Créez votre profil",
    desc: "Renseignez vos matières, niveaux, tarifs et disponibilités. Soumettez vos justificatifs (CNI + diplôme) pour être vérifié.",
  },
  {
    icon: "💳",
    title: "Souscrivez un abonnement",
    desc: "Choisissez le plan Répétiteur (3 000 FCFA/mois) ou Groupe (5 000 FCFA/mois) selon votre activité.",
  },
  {
    icon: "💰",
    title: "Recevez vos paiements",
    desc: "Les élèves vous paient directement. TutorLink ne prélève aucune commission. 100% de vos revenus vous reviennent.",
  },
];

const ADVANTAGES = [
  {
    icon: "🛡️",
    title: "Profils vérifiés",
    desc: "CNI, diplômes et adresse vérifiés par l'équipe TutorLink. Chaque répétiteur est validé avant publication.",
    color: "from-blue-500/10 to-blue-600/5 dark:from-blue-500/20",
  },
  {
    icon: "📍",
    title: "Hyper-local Dschang",
    desc: "Répétiteurs par quartier (Centre, Foto, Ngui, Tsinkop, Foréké). Cours à domicile ou dans votre quartier.",
    color: "from-green-500/10 to-green-600/5 dark:from-green-500/20",
  },
  {
    icon: "💰",
    title: "0% de commission",
    desc: "Le répétiteur garde 100% de ses revenus. TutorLink se finance uniquement par les abonnements répétiteurs.",
    color: "from-yellow-500/10 to-yellow-600/5 dark:from-yellow-500/20",
  },
  {
    icon: "📱",
    title: "Paiement Mobile Money",
    desc: "Abonnements répétiteurs via MTN Mobile Money et Orange Money. Simple, rapide et accessible à tous.",
    color: "from-orange-500/10 to-orange-600/5 dark:from-orange-500/20",
  },
  {
    icon: "💬",
    title: "Messagerie intégrée",
    desc: "Communiquez directement avec votre répétiteur ou vos élèves depuis la plateforme. Suivi en temps réel.",
    color: "from-purple-500/10 to-purple-600/5 dark:from-purple-500/20",
  },
  {
    icon: "📊",
    title: "Suivi des progrès",
    desc: "Dashboard personnalisé avec vos cours, réservations, groupes et évolution scolaire par matière.",
    color: "from-pink-500/10 to-pink-600/5 dark:from-pink-500/20",
  },
];

const TESTIMONIALS = [
  {
    name: "Talla Mireille",
    role: "Parent d'élève · Quartier Foto",
    avatar: "TM",
    rating: 5,
    text: "Mon fils a gagné 4 points de moyenne en mathématiques en deux mois grâce à M. Kamga. La plateforme est simple à utiliser et tous les répétiteurs sont sérieux et vérifiés.",
    subject: "Mathématiques · Terminale D",
  },
  {
    name: "Junior Nkoumba",
    role: "Élève · Terminale D · Centre Dschang",
    avatar: "JN",
    rating: 5,
    text: "J'ai eu 15/20 en physique-chimie au DS grâce aux cours de Mme Tchana. La réservation prend 2 minutes et le répétiteur répond toujours aux messages.",
    subject: "Physique-Chimie · Lycée",
  },
  {
    name: "M. Kamga Eric",
    role: "Répétiteur Mathématiques · 312 cours donnés",
    avatar: "KE",
    rating: 5,
    text: "Depuis mon abonnement TutorLink, j'ai plus de 12 élèves actifs. Je gère tout depuis mon téléphone : disponibilités, réservations, messagerie. Et je garde 100% de mes revenus.",
    subject: "Abonnement Répétiteur · 3 000 FCFA/mois",
  },
];

const FAQ_ITEMS = [
  {
    q: "TutorLink est-il gratuit pour les élèves ?",
    a: "Oui, entièrement gratuit. Les élèves et parents créent un compte, cherchent un répétiteur et réservent des cours sans payer aucun frais à TutorLink. Le paiement des cours se règle directement avec le répétiteur.",
  },
  {
    q: "Comment fonctionne l'abonnement répétiteur ?",
    a: "L'abonnement Répétiteur coûte 3 000 FCFA/mois et donne accès à votre profil public, la gestion des disponibilités, la messagerie et le tableau de bord. L'abonnement Groupe (5 000 FCFA/mois) ajoute la création de groupes de répétition. Paiement via MTN MoMo ou Orange Money.",
  },
  {
    q: "Comment les répétiteurs sont-ils vérifiés ?",
    a: "Chaque répétiteur soumet sa CNI, son diplôme et son adresse à Dschang. L'équipe TutorLink vérifie manuellement ces documents avant d'activer le profil et d'afficher le badge 'Vérifié'.",
  },
  {
    q: "TutorLink prend-il une commission sur les cours ?",
    a: "Non. TutorLink ne prélève aucune commission sur les cours donnés. Le modèle économique repose uniquement sur les abonnements répétiteurs. Les répétiteurs gardent 100% de leurs revenus.",
  },
  {
    q: "Quels quartiers de Dschang sont couverts ?",
    a: "Centre Dschang, Quartier Foto, Ngui Dschang, Tsinkop et Foréké. D'autres quartiers seront ajoutés selon la demande. Tous les cours sont en présentiel à domicile.",
  },
];

const SUBJECTS = [
  "Mathématiques", "Physique-Chimie", "SVT",
  "Français", "Anglais", "Informatique",
  "Histoire-Géo", "Philosophie", "Économie",
];

// ════════════════════════════════════════════════════════════════
// COMPOSANTS INTERNES
// ════════════════════════════════════════════════════════════════

/** Compteur animé — s'incrémente quand visible */
const AnimatedCounter: React.FC<{
  value: number; suffix: string;
}> = ({ value, suffix }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = value / 60;
          const timer = setInterval(() => {
            start += step;
            if (start >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString("fr-FR")}{suffix}
    </span>
  );
};

/** Card FAQ avec accordion */
const FaqItem: React.FC<{ q: string; a: string; defaultOpen?: boolean }> = ({
  q, a, defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl
                    overflow-hidden transition-all duration-200">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="
          w-full flex items-center justify-between
          px-6 py-4 text-left
          bg-white dark:bg-gray-800
          hover:bg-gray-50 dark:hover:bg-gray-750
          transition-colors cursor-pointer
        "
      >
        <span className="font-semibold text-[#1a2744] dark:text-white text-sm pr-4">
          {q}
        </span>
        <span className={`
          text-[#f5a623] text-xl flex-shrink-0 font-bold
          transition-transform duration-200
          ${open ? "rotate-45" : "rotate-0"}
        `}>
          +
        </span>
      </button>
      {open && (
        <div className="px-6 pb-4 bg-gray-50 dark:bg-gray-800/50
                        border-t border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300
                        leading-relaxed pt-3">
            {a}
          </p>
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
// PAGE PRINCIPALE
// ════════════════════════════════════════════════════════════════

const PricingPage: React.FC = () => {
  return (
    <>
      <div className="min-h-screen bg-white dark:bg-gray-900
                      transition-colors duration-300">

        {/* ══ 1. HERO ══════════════════════════════════════════ */}
        <section className="
          relative overflow-hidden
          bg-gradient-to-br from-[#1a2744] via-[#1a2744] to-[#0d1a33]
          dark:from-[#0a0f1e] dark:via-[#0d1a33] dark:to-[#060c17]
          pt-16 pb-24
        ">
          {/* Grille décorative en arrière-plan */}
          <div className="absolute inset-0 opacity-5"
               style={{
                 backgroundImage:
                   "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), " +
                   "linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                 backgroundSize: "48px 48px",
               }}
          />

          {/* Cercle décoratif doré */}
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full
                          bg-[#f5a623]/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full
                          bg-[#f5a623]/5 blur-2xl" />

          <div className="relative max-w-6xl mx-auto px-6 text-center">

            {/* Badge "Nouveau modèle" */}
            <div className="inline-flex items-center gap-2 bg-[#f5a623]/20
                            border border-[#f5a623]/30 text-[#f5a623]
                            text-xs font-bold px-4 py-2 rounded-full mb-8
                            animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-[#f5a623] animate-pulse" />
              Plateforme de soutien scolaire · Dschang, Cameroun
            </div>

            {/* Titre principal */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black
                           text-white leading-tight mb-6 animate-fade-in-up">
              L'excellence scolaire<br />
              <span className="text-[#f5a623]">à portée de main</span>
            </h1>

            {/* ⭐ SIGNATURE VISUELLE : 0% commission ⭐ */}
            <div className="inline-flex flex-col items-center mb-8
                            animate-fade-in-up">
              <div className="relative bg-[#f5a623]/10 border border-[#f5a623]/40
                              rounded-2xl px-8 py-4 backdrop-blur-sm">
                <p className="text-white/60 text-sm mb-1">
                  TutorLink prend
                </p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-5xl font-black text-[#f5a623]">
                    0 FCFA
                  </span>
                  <span className="text-white/70 text-lg">de commission</span>
                </div>
                <p className="text-white/50 text-xs mt-1">
                  Le répétiteur garde 100% de ses revenus
                </p>
                {/* Barre barrée décorative */}
                <div className="absolute inset-0 flex items-center justify-center
                                pointer-events-none">
                  <div className="w-full h-0.5 bg-red-500/30 rotate-[-8deg]
                                  rounded-full" />
                </div>
              </div>
            </div>

            {/* Sous-titre */}
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Trouvez le répétiteur idéal pour votre enfant à Dschang.
              Du primaire au BAC C/D, des enseignants qualifiés et vérifiés
              près de chez vous. Paiement direct, sans intermédiaire.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center
                            justify-center gap-4 mb-16">
              <Link
                to="/repetiteurs"
                className="
                  group flex items-center gap-3
                  bg-[#f5a623] text-[#1a2744] font-black text-base
                  px-8 py-4 rounded-xl hover:bg-[#e09415]
                  transition-all duration-200 shadow-xl
                  hover:shadow-[#f5a623]/30 hover:scale-105
                  animate-pulse-gold
                "
              >
                🔍 Trouver un répétiteur
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                to="/inscription"
                className="
                  flex items-center gap-3
                  bg-white/10 text-white font-bold text-base
                  px-8 py-4 rounded-xl
                  border border-white/30 hover:border-white/60
                  hover:bg-white/20 transition-all duration-200
                  backdrop-blur-sm
                "
              >
                🎓 Devenir répétiteur
              </Link>
            </div>

            {/* Vignettes matières */}
            <div className="flex flex-wrap justify-center gap-2">
              {SUBJECTS.map((subject) => (
                <span
                  key={subject}
                  className="
                    text-xs text-white/60 bg-white/5 border border-white/10
                    px-3 py-1 rounded-full hover:bg-white/10
                    hover:text-white/80 transition-colors cursor-default
                  "
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>

          {/* Vague de transition */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden
                          leading-none">
            <svg viewBox="0 0 1440 60" fill="none"
                 className="w-full h-12 fill-white dark:fill-gray-900">
              <path d="M0,60 C360,0 1080,60 1440,0 L1440,60 L0,60 Z" />
            </svg>
          </div>
        </section>

        {/* ══ 2. STATS ═════════════════════════════════════════ */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {STATS.map(({ value, suffix, label, icon }) => (
                <div
                  key={label}
                  className="
                    text-center p-6 rounded-2xl
                    bg-gray-50 dark:bg-gray-800
                    border border-gray-100 dark:border-gray-700
                    hover:border-[#f5a623]/50 hover:shadow-lg
                    transition-all duration-300
                  "
                >
                  <div className="text-3xl mb-2">{icon}</div>
                  <div className="text-3xl sm:text-4xl font-black
                                  text-[#1a2744] dark:text-white mb-1">
                    <AnimatedCounter value={value} suffix={suffix} />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500
                                dark:text-gray-400 font-medium">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 3. COMMENT ÇA MARCHE ═══════════════════════════════ */}
        <section className="py-20 bg-[#eef2f7] dark:bg-gray-800/50
                            transition-colors duration-300">
          <div className="max-w-6xl mx-auto px-6">

            <div className="text-center mb-14">
              <p className="text-[#f5a623] font-bold text-sm
                            tracking-widest uppercase mb-3">
                Simple & Rapide
              </p>
              <h2 className="text-3xl sm:text-4xl font-black
                             text-[#1a2744] dark:text-white mb-4">
                Comment ça marche ?
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                Que vous soyez élève, parent ou répétiteur, TutorLink
                vous accompagne en 3 étapes simples.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* Pour les élèves / parents */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-[#1a2744]
                                  dark:bg-[#f5a623] flex items-center
                                  justify-center text-xl">
                    🎓
                  </div>
                  <h3 className="text-xl font-bold text-[#1a2744]
                                 dark:text-white">
                    Pour les élèves & parents
                    <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/30
                                     text-green-700 dark:text-green-400
                                     px-2 py-0.5 rounded-full font-bold">
                      GRATUIT
                    </span>
                  </h3>
                </div>

                <div className="space-y-6">
                  {STUDENT_STEPS.map(({ icon, title, desc }, i) => (
                    <div key={title} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-2xl
                                        bg-white dark:bg-gray-800
                                        border-2 border-[#1a2744]/20
                                        dark:border-gray-600
                                        flex items-center justify-center
                                        text-2xl shadow-sm">
                          {icon}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-[#f5a623]">
                            Étape {i + 1}
                          </span>
                        </div>
                        <h4 className="font-bold text-[#1a2744] dark:text-white
                                       text-sm mb-1">
                          {title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400
                                      leading-relaxed">
                          {desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  to="/repetiteurs"
                  className="
                    inline-flex items-center gap-2 mt-8
                    bg-[#1a2744] dark:bg-[#f5a623]
                    text-white dark:text-[#1a2744]
                    font-bold text-sm px-6 py-3 rounded-xl
                    hover:bg-[#243566] dark:hover:bg-[#e09415]
                    transition-colors shadow-md
                  "
                >
                  Trouver un répétiteur →
                </Link>
              </div>

              {/* Pour les répétiteurs */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-[#f5a623]
                                  flex items-center justify-center text-xl">
                    📋
                  </div>
                  <h3 className="text-xl font-bold text-[#1a2744]
                                 dark:text-white">
                    Pour les répétiteurs
                    <span className="ml-2 text-xs bg-amber-100 dark:bg-amber-900/30
                                     text-amber-700 dark:text-amber-400
                                     px-2 py-0.5 rounded-full font-bold">
                      À PARTIR DE 3 000 F/MOIS
                    </span>
                  </h3>
                </div>

                <div className="space-y-6">
                  {TUTOR_STEPS.map(({ icon, title, desc }, i) => (
                    <div key={title} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-2xl
                                        bg-white dark:bg-gray-800
                                        border-2 border-[#f5a623]/40
                                        flex items-center justify-center
                                        text-2xl shadow-sm">
                          {icon}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-[#f5a623]">
                            Étape {i + 1}
                          </span>
                        </div>
                        <h4 className="font-bold text-[#1a2744] dark:text-white
                                       text-sm mb-1">
                          {title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400
                                      leading-relaxed">
                          {desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  to="/inscription"
                  className="
                    inline-flex items-center gap-2 mt-8
                    bg-[#f5a623] text-[#1a2744]
                    font-bold text-sm px-6 py-3 rounded-xl
                    hover:bg-[#e09415] transition-colors shadow-md
                  "
                >
                  Devenir répétiteur →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 4. TARIFS ════════════════════════════════════════ */}
        <section className="py-20 bg-white dark:bg-gray-900
                            transition-colors duration-300">
          <div className="max-w-6xl mx-auto px-6">

            <div className="text-center mb-14">
              <p className="text-[#f5a623] font-bold text-sm
                            tracking-widest uppercase mb-3">
                Transparent & Abordable
              </p>
              <h2 className="text-3xl sm:text-4xl font-black
                             text-[#1a2744] dark:text-white mb-4">
                Des tarifs clairs pour tout le monde
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                Gratuit pour les élèves. Abonnement mensuel unique pour les répétiteurs.
                Aucune surprise, aucune commission cachée.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Plan Élève — GRATUIT */}
              <div className="
                bg-gray-50 dark:bg-gray-800
                border-2 border-gray-200 dark:border-gray-700
                rounded-2xl p-8 flex flex-col
                hover:shadow-lg transition-all duration-300
                hover:border-gray-300 dark:hover:border-gray-600
              ">
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="text-xl font-black text-[#1a2744]
                               dark:text-white mb-2">
                  Élève / Parent
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-black text-green-600
                                   dark:text-green-400">
                    GRATUIT
                  </span>
                  <p className="text-gray-400 text-sm mt-1">
                    Pour toujours
                  </p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {[
                    "Recherche de répétiteurs",
                    "Consultation des profils et avis",
                    "Réservation de cours",
                    "Messagerie avec le répétiteur",
                    "Tableau de bord personnel",
                    "Suivi des progrès scolaires",
                    "Groupes de répétition",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm
                                           text-gray-600 dark:text-gray-300">
                      <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/inscription"
                  className="
                    w-full text-center py-3 rounded-xl
                    bg-[#1a2744] dark:bg-gray-700 text-white
                    font-bold text-sm hover:bg-[#243566]
                    dark:hover:bg-gray-600 transition-colors
                  "
                >
                  S'inscrire gratuitement
                </Link>
              </div>

              {/* Plan Répétiteur — 3 000 FCFA */}
              <div className="
                bg-white dark:bg-gray-800
                border-2 border-[#f5a623] rounded-2xl p-8
                flex flex-col relative
                shadow-xl shadow-[#f5a623]/10
                hover:shadow-2xl hover:shadow-[#f5a623]/20
                transition-all duration-300 scale-105
              ">
                {/* Badge recommandé */}
                <div className="
                  absolute -top-4 left-1/2 -translate-x-1/2
                  bg-[#f5a623] text-[#1a2744]
                  text-xs font-black px-5 py-1.5 rounded-full
                  whitespace-nowrap shadow-lg
                ">
                  ⭐ LE PLUS POPULAIRE
                </div>

                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-black text-[#1a2744]
                               dark:text-white mb-2">
                  Répétiteur
                </h3>
                <div className="mb-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-[#1a2744]
                                     dark:text-white">
                      3 000
                    </span>
                    <span className="text-gray-400 text-sm">FCFA / mois</span>
                  </div>
                  <p className="text-[#f5a623] text-xs font-bold mt-1">
                    Soit 100 FCFA par jour · Payable par Mobile Money
                  </p>
                </div>

                {/* 14 jours gratuits */}
                <div className="bg-green-50 dark:bg-green-900/20 border
                                border-green-200 dark:border-green-800
                                rounded-lg px-3 py-2 mb-6 text-center">
                  <p className="text-green-700 dark:text-green-400
                                text-xs font-bold">
                    🎁 60 jours d'essai gratuit
                  </p>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {[
                    "Profil public vérifié visible",
                    "Jusqu'à 15 élèves actifs",
                    "1 groupe de répétition",
                    "Gestion des disponibilités",
                    "Messagerie illimitée",
                    "Tableau de bord complet",
                    "0% de commission sur vos revenus",
                    "Badge Répétiteur Vérifié",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm
                                           text-gray-600 dark:text-gray-300">
                      <span className="text-[#f5a623] mt-0.5 flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/inscription"
                  className="
                    w-full text-center py-3.5 rounded-xl
                    bg-[#f5a623] text-[#1a2744] font-black text-sm
                    hover:bg-[#e09415] transition-colors shadow-lg
                    hover:shadow-[#f5a623]/40
                  "
                >
                  Démarrer mon essai gratuit
                </Link>
              </div>

              {/* Plan Groupe — 5 000 FCFA */}
              <div className="
                bg-gray-50 dark:bg-gray-800
                border-2 border-[#1a2744] dark:border-gray-600
                rounded-2xl p-8 flex flex-col
                hover:shadow-xl hover:border-[#1a2744]
                transition-all duration-300
              ">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-black text-[#1a2744]
                               dark:text-white mb-2">
                  Répétiteur + Groupes
                </h3>
                <div className="mb-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-[#1a2744]
                                     dark:text-white">
                      5 000
                    </span>
                    <span className="text-gray-400 text-sm">FCFA / mois</span>
                  </div>
                  <p className="text-[#1a2744] dark:text-gray-400
                                text-xs font-bold mt-1">
                    Tout inclus · Groupes illimités
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border
                                border-blue-200 dark:border-blue-800
                                rounded-lg px-3 py-2 mb-6 text-center">
                  <p className="text-blue-700 dark:text-blue-400
                                text-xs font-bold">
                    🎁 60 jours d'essai gratuit
                  </p>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {[
                    "Tout le plan Répétiteur",
                    "Groupes de répétition illimités",
                    "Jusqu'à 15 élèves par groupe",
                    "Gestion des inscriptions groupes",
                    "Planning des séances de groupe",
                    "Badge Répétiteur Pro",
                    "Statistiques revenus groupes",
                    "Position prioritaire dans les résultats",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm
                                           text-gray-600 dark:text-gray-300">
                      <span className="text-[#1a2744] dark:text-gray-400
                                       mt-0.5 flex-shrink-0">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/inscription"
                  className="
                    w-full text-center py-3.5 rounded-xl
                    bg-[#1a2744] dark:bg-gray-700 text-white
                    font-bold text-sm hover:bg-[#243566]
                    dark:hover:bg-gray-600 transition-colors shadow-md
                  "
                >
                  Commencer avec les groupes
                </Link>
              </div>
            </div>

            {/* Note paiement */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-500 dark:text-gray-400
                            flex items-center justify-center gap-2">
                <span>💳</span>
                Paiement de l'abonnement via{" "}
                <strong className="text-[#1a2744] dark:text-gray-200">
                  MTN Mobile Money
                </strong>{" "}
                ou{" "}
                <strong className="text-[#1a2744] dark:text-gray-200">
                  Orange Money
                </strong>{" "}
                · Renouvellement mensuel · Sans engagement
              </p>
            </div>
          </div>
        </section>

        {/* ══ 5. AVANTAGES ════════════════════════════════════ */}
        <section className="py-20 bg-[#1a2744] dark:bg-[#0f172a]
                            transition-colors duration-300 relative overflow-hidden">

          {/* Décoration */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full
                          bg-[#f5a623]/5 blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-6">

            <div className="text-center mb-14">
              <p className="text-[#f5a623] font-bold text-sm
                            tracking-widest uppercase mb-3">
                Pourquoi TutorLink ?
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Une plateforme conçue pour
                <br className="hidden sm:block" />
                <span className="text-[#f5a623]"> le marché camerounais</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ADVANTAGES.map(({ icon, title, desc, color }) => (
                <div
                  key={title}
                  className={`
                    bg-gradient-to-br ${color}
                    border border-white/10
                    rounded-2xl p-6
                    hover:border-[#f5a623]/30 hover:scale-105
                    transition-all duration-300 group
                  `}
                >
                  <div className="text-4xl mb-4 group-hover:scale-110
                                  transition-transform duration-200">
                    {icon}
                  </div>
                  <h3 className="font-bold text-white text-base mb-2">
                    {title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 6. CARTE ZONES GÉOGRAPHIQUES ════════════════════ */}
        <section className="py-16 bg-white dark:bg-gray-900
                            transition-colors duration-300">
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-gradient-to-r from-[#1a2744] to-[#243566]
                            dark:from-[#0f172a] dark:to-[#1a2744]
                            rounded-3xl p-8 sm:p-12
                            flex flex-col lg:flex-row items-center
                            justify-between gap-8">

              <div className="text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
                  Disponible dans tout Dschang
                </h3>
                <p className="text-white/70 text-sm max-w-md leading-relaxed">
                  Nos répétiteurs interviennent dans tous les quartiers.
                  Cours à domicile ou en présentiel selon votre préférence.
                </p>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-end gap-3">
                {[
                  { name: "Centre Dschang", tutors: "187+" },
                  { name: "Quartier Foto",  tutors: "124+" },
                  { name: "Ngui Dschang",   tutors: "98+"  },
                  { name: "Tsinkop",         tutors: "76+"  },
                  { name: "Foréké",          tutors: "27+"  },
                ].map(({ name, tutors }) => (
                  <div
                    key={name}
                    className="
                      bg-white/10 border border-white/20
                      rounded-xl px-4 py-3 text-center
                      hover:bg-white/20 hover:border-white/40
                      transition-colors cursor-default
                    "
                  >
                    <p className="text-white font-bold text-sm">{name}</p>
                    <p className="text-[#f5a623] text-xs font-bold mt-0.5">
                      {tutors} répétiteurs
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ 7. TÉMOIGNAGES ══════════════════════════════════ */}
        <section className="py-20 bg-[#eef2f7] dark:bg-gray-800/30
                            transition-colors duration-300">
          <div className="max-w-6xl mx-auto px-6">

            <div className="text-center mb-14">
              <p className="text-[#f5a623] font-bold text-sm
                            tracking-widest uppercase mb-3">
                Ils nous font confiance
              </p>
              <h2 className="text-3xl sm:text-4xl font-black
                             text-[#1a2744] dark:text-white mb-4">
                Ce qu'ils en disent
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map(({ name, role, avatar, rating, text, subject }) => (
                <div
                  key={name}
                  className="
                    bg-white dark:bg-gray-800
                    border border-gray-200 dark:border-gray-700
                    rounded-2xl p-6 flex flex-col
                    hover:shadow-xl hover:border-[#f5a623]/30
                    transition-all duration-300
                  "
                >
                  {/* Étoiles */}
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: rating }).map((_, i) => (
                      <span key={i} className="text-[#f5a623]">★</span>
                    ))}
                  </div>

                  {/* Texte */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm
                                leading-relaxed flex-1 mb-6 italic">
                    "{text}"
                  </p>

                  {/* Auteur */}
                  <div className="flex items-center gap-3 pt-4
                                  border-t border-gray-100 dark:border-gray-700">
                    <div className="
                      w-10 h-10 rounded-full bg-[#1a2744] dark:bg-[#f5a623]
                      flex items-center justify-center
                      text-white dark:text-[#1a2744] font-black text-sm
                      flex-shrink-0
                    ">
                      {avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#1a2744] dark:text-white
                                    text-sm truncate">
                        {name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{role}</p>
                    </div>
                  </div>

                  {/* Sujet */}
                  <div className="mt-3 text-[10px] text-[#f5a623] font-bold
                                  bg-[#f5a623]/10 px-2 py-1 rounded-full
                                  text-center w-fit mx-auto">
                    {subject}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 8. FAQ ══════════════════════════════════════════ */}
        <section className="py-20 bg-white dark:bg-gray-900
                            transition-colors duration-300">
          <div className="max-w-3xl mx-auto px-6">

            <div className="text-center mb-14">
              <p className="text-[#f5a623] font-bold text-sm
                            tracking-widest uppercase mb-3">
                Questions fréquentes
              </p>
              <h2 className="text-3xl sm:text-4xl font-black
                             text-[#1a2744] dark:text-white">
                Tout ce que vous devez savoir
              </h2>
            </div>

            <div className="space-y-3">
              {FAQ_ITEMS.map(({ q, a }, i) => (
                <FaqItem key={q} q={q} a={a} defaultOpen={i === 0} />
              ))}
            </div>

            {/* Contact */}
            <div className="mt-10 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                Vous avez d'autres questions ?
              </p>
              <a
                href="mailto:contact@tutorlink.cm"
                className="
                  inline-flex items-center gap-2
                  text-[#1a2744] dark:text-[#f5a623]
                  font-bold text-sm hover:underline
                "
              >
                ✉️ contact@tutorlink.cm
              </a>
            </div>
          </div>
        </section>

        {/* ══ 9. CTA FINAL ════════════════════════════════════ */}
        <section className="py-20 bg-gradient-to-br
                            from-[#1a2744] via-[#1a2744] to-[#0d1a33]
                            dark:from-[#0a0f1e] dark:to-[#0d1a33]
                            transition-colors duration-300 relative
                            overflow-hidden">

          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full
                          bg-[#f5a623]/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full
                          bg-[#f5a623]/5 blur-3xl" />

          <div className="relative max-w-4xl mx-auto px-6 text-center">

            <div className="text-5xl mb-6">🚀</div>

            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">
              Prêt à rejoindre
              <br />
              <span className="text-[#f5a623]">TutorLink ?</span>
            </h2>

            <p className="text-white/70 text-lg max-w-xl mx-auto mb-10">
              Plus de 500 répétiteurs et 3 000 élèves font déjà confiance
              à TutorLink à Dschang. Rejoignez-les aujourd'hui.
            </p>

            <div className="flex flex-col sm:flex-row items-center
                            justify-center gap-4">
              <Link
                to="/repetiteurs"
                className="
                  group flex items-center gap-3
                  bg-[#f5a623] text-[#1a2744] font-black text-base
                  px-10 py-4 rounded-xl hover:bg-[#e09415]
                  transition-all duration-200 shadow-xl w-full sm:w-auto
                  justify-center hover:scale-105
                "
              >
                🎓 Je cherche un répétiteur
              </Link>

              <Link
                to="/inscription"
                className="
                  flex items-center gap-3 justify-center
                  bg-white/10 text-white font-bold text-base
                  px-10 py-4 rounded-xl border border-white/30
                  hover:bg-white/20 hover:border-white/60
                  transition-all duration-200 w-full sm:w-auto
                "
              >
                📋 Je suis répétiteur — 60 jours gratuits
              </Link>
            </div>

            {/* Garanties finales */}
            <div className="flex flex-wrap items-center justify-center
                            gap-6 mt-10">
              {[
                "✓ Sans engagement",
                "✓ 60 jours gratuits",
                "✓ 0% commission",
                "✓ Mobile Money",
              ].map((g) => (
                <span key={g} className="text-white/60 text-sm font-medium">
                  {g}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>

      <PublicFooter />
    </>
  );
};

export default PricingPage;