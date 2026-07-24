import { ConfirmedCourse, ConfirmedCourseStatus } from '../../types/tutor.types';

interface Props { courses: ConfirmedCourse[]; }

const statusConfig: Record<ConfirmedCourseStatus, { label: string; className: string }> = {
  confirme:   { label: 'CONFIRMÉ',   className: 'bg-blue-100 text-blue-700' },
  en_attente: { label: 'EN ATTENTE', className: 'bg-orange-100 text-orange-700' },
  termine:    { label: 'TERMINÉ',    className: 'bg-gray-100 text-gray-500' },
};

const ConfirmedCoursesTable = ({ courses }: Props) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">

    {/* En-tête */}
    <div className="px-5 py-4 border-b border-gray-100">
      <h3 className="font-bold text-gray-700">
        ✅ Prochains cours confirmés
      </h3>
    </div>

    {/* Tableau */}
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
          {['Date', 'Heure', 'Élève', 'Matière', 'Statut', 'Actions'].map(h => (
            <th key={h} className="text-left px-5 py-3 font-semibold">{h}</th>
          ))}
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
              <td className="px-5 py-3 font-medium text-gray-800">{c.date}</td>
              <td className="px-5 py-3 text-gray-600">{c.time}</td>
              <td className="px-5 py-3 text-gray-700">{c.studentName}</td>
              <td className="px-5 py-3 text-gray-600">{c.subject}</td>
              <td className="px-5 py-3">
                <span className={`${className} text-xs font-bold
                                 px-2 py-1 rounded-full`}>
                  {label}
                </span>
              </td>
              <td className="px-5 py-3">
                <button className="border border-gray-200 text-gray-600
                                   text-xs px-3 py-1 rounded-lg
                                   hover:bg-gray-50 cursor-pointer">
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

export default ConfirmedCoursesTable;