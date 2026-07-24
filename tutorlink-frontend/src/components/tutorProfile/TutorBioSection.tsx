interface Props { bio: string; }

const TutorBioSection = ({ bio }: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-5">
    <h3 className="font-bold text-gray-700 mb-3">
      🎓 À propos de {bio.split(' ')[0]}
    </h3>
    <p className="text-sm text-gray-600 leading-relaxed">{bio}</p>
  </div>
);

export default TutorBioSection;