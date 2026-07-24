// ============================================================
// Footer commun à toutes les pages de l'espace public
// Reproduit la maquette : logo + 3 colonnes + barre copyright
// À importer en bas de chaque page publique
// ============================================================

import React from "react";
import { Link } from "react-router-dom";

// ── Configuration des 2 colonnes de liens ─────────────────────

const FOOTER_COLUMNS = [
  {
    title: "PLATEFORME",
    links: [
      { label: "Comment ça marche",  to: "/comment-ca-marche"  },
      { label: "Devenir répétiteur", to: "/devenir-repetiteur" },
      { label: "Tarifs",             to: "/tarifs"             },
      { label: "FAQ",                to: "/faq"                },
    ],
  },
  {
    title: "LÉGAL",
    links: [
      { label: "CGU",              to: "/cgu"              },
      { label: "Confidentialité",  to: "/confidentialite"  },
      { label: "Cookies",          to: "/cookies"          },
      { label: "Mentions légales", to: "/mentions-legales" },
    ],
  },
];

// ── Informations de contact ───────────────────────────────────

const CONTACT_ITEMS = [
  {
    icon: "✉️",
    label: "contact@tutorlink.cm",
    href: "mailto:contact@tutorlink.cm",
    isLink: true,
  },
  {
    icon: "📞",
    label: "+237 6XX XX XX XX",
    href: "tel:+237600000000",
    isLink: true,
  },
  {
    icon: "📍",
    label: "Dschang, Ouest Cameroun",
    href: null,
    isLink: false,
  },
];

// ── Composant ─────────────────────────────────────────────────

const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-[#1a2744] text-white">

      {/* ── Corps : 4 colonnes ────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Col 1 : Logo + description ──────────────────── */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <span className="text-[#f5a623] text-2xl">🎓</span>
              <span className="font-bold text-xl">
                Tutor<span className="text-[#f5a623]">Link</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              La plateforme de référence du soutien scolaire à Dschang.
              <br />
              Projet Université de Dschang, 2026.
            </p>
          </div>

          {/* ── Col 2 & 3 : Plateforme + Légal ─────────────── */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold tracking-widest
                             text-white/40 uppercase mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="
                        text-sm text-white/70
                        hover:text-white transition-colors
                        hover:translate-x-1 inline-block
                        duration-150
                      "
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ── Col 4 : Contact ─────────────────────────────── */}
          <div>
            <h4 className="text-xs font-bold tracking-widest
                           text-white/40 uppercase mb-4">
              CONTACT
            </h4>
            <ul className="space-y-2.5">
              {CONTACT_ITEMS.map(({ icon, label, href, isLink }) => (
                <li key={label} className="flex items-start gap-2">
                  <span className="text-sm flex-shrink-0 mt-0.5">
                    {icon}
                  </span>
                  {isLink && href ? (
                    <a
                      href={href}
                      className="text-sm text-white/70 hover:text-white
                                 transition-colors"
                    >
                      {label}
                    </a>
                  ) : (
                    <span className="text-sm text-white/70">{label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Barre copyright ───────────────────────────────── */}
      <div className="border-t border-white/10">
        <p className="text-xs text-white/40 text-center py-4">
          © 2026 TutorLink · Tous droits réservés · Made with{" "}
          <span className="text-red-400">❤️</span> à Dschang
        </p>
      </div>
    </footer>
  );
};

export default PublicFooter;