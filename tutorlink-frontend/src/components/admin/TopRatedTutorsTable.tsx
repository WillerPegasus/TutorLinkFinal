import { TopRatedTutor } from '../../types/tutorValidation.types';

interface Props { tutors: TopRatedTutor[]; }

// Affiche les étoiles selon la note
const Stars = ({ rating }: { rating: number }) => (
  <span className="text-yellow-400 font-bold">
    {'★'.repeat(Math.floor(rating))}
    <span className="text-gray-300">
      {'★'.repeat(5 - Math.floor(rating))}
    </span>
    <span className="text-gray-600 text-xs ml-1">{rating}</span>
  </span>
);

const TopRatedTutorsTable = ({ tutors }: Props) => (
  <div className="bg-white rounded-xl shadow-sm
                  border border-gray-100 overflow-hidden">
    {/* En-tête */}
    <div className="px-5 py-4 border-b border-gray-100">
      <h3 className="font-bold text-gray-700 text-base">
        🏆 Répétiteurs les mieux notés
      </h3>
    </div>

    {/* Tableau */}
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
          <th className="text-left px-5 py-3 font-semibold">Nom</th>
          <th className="text-left px-5 py-3 font-semibold">Matière</th>
          <th className="text-left px-5 py-3 font-semibold">Note</th>
          <th className="text-left px-5 py-3 font-semibold">Sessions</th>
          <th className="text-left px-5 py-3 font-semibold">Quartier</th>
        </tr>
      </thead>
      <tbody>
        {tutors.map((t, i) => (
          <tr
            key={t.id}
            className={`border-t border-gray-50
              ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
              hover:bg-blue-50 transition-colors`}
          >
            <td className="px-5 py-3 font-medium text-gray-800">
              {t.name}
            </td>
            <td className="px-5 py-3 text-gray-600">{t.subject}</td>
            <td className="px-5 py-3"><Stars rating={t.rating} /></td>
            <td className="px-5 py-3 text-gray-600">
              {t.totalSessions} séances
            </td>
            <td className="px-5 py-3 text-gray-500">{t.quartier}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TopRatedTutorsTable;
