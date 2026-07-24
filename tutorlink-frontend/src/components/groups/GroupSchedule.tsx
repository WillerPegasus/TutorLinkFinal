import { GroupSession } from '../../types/group.types';

interface Props { sessions: GroupSession[]; }

const DAYS = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];

const GroupSchedule = ({ sessions }: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-5">
    <h3 className="font-bold text-gray-700 mb-4">📅 Planning des séances</h3>
    <div className="grid grid-cols-7 gap-2 text-center">
      {DAYS.map(day => {
        const session = sessions.find(s => s.day === day);
        return (
          <div key={day}>
            <p className="text-xs text-gray-400 font-semibold mb-2">{day}</p>
            {session ? (
              <div className="bg-[#1a2744] text-white text-xs rounded-lg py-2 px-1 font-medium">
                {session.startTime}-{session.endTime}
              </div>
            ) : (
              <div className="text-gray-300 text-sm">—</div>
            )}
          </div>
        );
      })}
    </div>
    <p className="text-xs text-gray-400 mt-3">
      {sessions.length} séances de 2h par semaine · {sessions.length * 8} heures de cours par mois
    </p>
  </div>
);

export default GroupSchedule;