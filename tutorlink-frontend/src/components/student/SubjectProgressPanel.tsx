import { SubjectProgress } from '../../types/student.types';

interface Props { progress: SubjectProgress[]; }

// Affiche la progression par matière avec barres
const SubjectProgressPanel = ({ progress }: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-5">
    <h3 className="font-bold text-gray-700 mb-4">
      📈 Progression par matière
    </h3>
    <div className="flex flex-col gap-4">
      {progress.map(p => (
        <div key={p.subject}>
          {/* Label + note */}
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-700">{p.subject}</span>
            <span className="text-sm font-bold text-gray-800">
              {p.score}/20
            </span>
          </div>
          {/* Barre de progression */}
          <div className="bg-gray-100 rounded-full h-2.5">
            <div
              className={`${p.color} h-2.5 rounded-full transition-all`}
              style={{ width: `${(p.score / 20) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SubjectProgressPanel;