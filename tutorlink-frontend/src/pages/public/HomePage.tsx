import { useHome } from '../../hooks/useHome';
import HomeNavbar from '../../components/home/HomeNavbar';
import HeroSection from '../../components/home/HeroSection';
import HowItWorksSection from '../../components/home/HowItWorksSection';
import AdvantagesSection from '../../components/home/AdvantagesSection';
import FeaturedTutorsSection from '../../components/home/FeaturedTutorsSection';
import FeaturedGroupsSection from '../../components/home/FeaturedGroupsSection';
import PublicFooter from "../../components/public/layout/PublicFooter";
import CTASection from '../../components/home/CTASection';

// ⬇️ IMPORTE ICI TON FOOTER PARTAGÉ
// import SharedFooter from '../../components/shared/SharedFooter';

const HomePage = () => {
  const {
    
    featuredTutors, featuredGroups,
    steps, advantages,
  } = useHome();

  return (
    <>
    <div className="min-h-screen">

      {/* Navbar flottante sur le hero */}
      <HomeNavbar />

      {/* Section héro avec image de fond */}
      <HeroSection />

      {/* Comment ça marche */}
      <HowItWorksSection steps={steps} />

      {/* Pourquoi TutorLink */}
      <AdvantagesSection advantages={advantages} />

      {/* Répétiteurs vedettes */}
      <FeaturedTutorsSection tutors={featuredTutors} />

      {/* Groupes vedettes */}
      <FeaturedGroupsSection groups={featuredGroups} />

      {/* CTA finale */}
      <CTASection />

      {/*
        ══════════════════════════════════
        TON FOOTER PARTAGÉ — DÉCOMMENTE
        <SharedFooter />
        ══════════════════════════════════
      */}
    </div>
    <PublicFooter/>
    </>

  );
};

export default HomePage;