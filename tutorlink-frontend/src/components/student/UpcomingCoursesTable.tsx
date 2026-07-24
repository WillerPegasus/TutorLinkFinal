import { useNavigate } from 'react-router-dom';
import { UpcomingCourse, CourseStatus } from '../../types/student.types';

interface Props { courses: UpcomingCourse[]; }

// Config badge statut cours
const statusConfig: Record<CourseStatus, { label: string; className: string }> = {
  confirme:   { label: 'CONFIRMÉ',   className: 'bg-blue-100 text-blue-700' },
  en_attente: { label: 'EN ATTENTE', className: 'bg-orange-100 text-orange-700' },
  termine:    { label: 'TERMINÉ',    className: 'bg-gray-100 text-gray-500' },
  annule:     { label: 'ANNULÉ',     className: 'bg-red-100 text-red-700' },
};

const UpcomingCoursesTable = ({ courses }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">

      {/* En-tête section */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-700">
          📅 Prochains cours
        </h3>
        <button
          onClick={() => navigate('/reservation')}
          className="bg-[#1a2744] hover:bg-blue-900 text-white
                     text-xs font-bold px-3 py-1.5 rounded-lg
                     cursor-pointer transition-colors"
        >
          + Nouvelle réservation
        </button>
      </div>

      {/* Tableau */}
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
            <th className="text-left px-5 py-3 font-semibold">Date</th>
            <th className="text-left px-5 py-3 font-semibold">Heure</th>
            <th className="text-left px-5 py-3 font-semibold">Matière</th>
            <th className="text-left px-5 py-3 font-semibold">Répétiteur</th>
            <th className="text-left px-5 py-3 font-semibold">Statut</th>
            <th className="text-left px-5 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c, i) => {
            const { label, className } = statusConfig[c.status];
            return (
              <tr
                key={c.id}
                className={`border-t border-gray-50
                  ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
              >
                <td className="px-5 py-3 font-medium text-gray-800">
                  {c.date}
                </td>
                <td className="px-5 py-3 text-gray-600">{c.time}</td>
                <td className="px-5 py-3 text-gray-700">{c.subject}</td>
                <td className="px-5 py-3 text-gray-600">{c.tutorName}</td>
                <td className="px-5 py-3">
                  <span className={`${className} text-xs font-bold
                                   px-2 py-1 rounded-full`}>
                    {label}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => navigate(`/mes-reservations`)}
                    className="border border-gray-200 text-gray-600
                               text-xs px-3 py-1 rounded-lg hover:bg-gray-50
                               cursor-pointer"
                  >
                    Détails
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UpcomingCoursesTable;