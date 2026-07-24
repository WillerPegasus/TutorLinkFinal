import { TutorActivity } from '../../types/tutor.types';

interface Props { activities: TutorActivity[]; }

const TutorActivityPanel = ({ activities }: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-5">
    <h3 className="font-bold text-gray-700 mb-4">
      🔔 Activité récente
    </h3>
    <div className="flex flex-col gap-3">
      {activities.map(a => (
        <div
          key={a.id}
          className="flex items-start gap-3 py-2
                     border-b border-gray-50 last:border-0"
        >
          <span className="text-lg flex-shrink-0">{a.icon}</span>
          <div className="flex-1">
            <p className={`text-sm
              ${a.isNew ? 'font-medium text-gray-800' : 'text-gray-600'}`}>
              {a.message}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
          </div>
          {a.isNew && (
            <div className="w-2 h-2 rounded-full bg-yellow-400
                            flex-shrink-0 mt-1" />
          )}
        </div>
      ))}
    </div>
  </div>
);

export default TutorActivityPanel;