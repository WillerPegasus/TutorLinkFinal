interface Props {
  subjects: { label: string }[];
}

// Liste des matières et niveaux enseignés sous forme de tags
const SubjectsTaughtPanel = ({ subjects }: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-5">
    <h3 className="font-bold text-gray-700 mb-3">
      📚 Matières & niveaux enseignés
    </h3>
    <div className="flex flex-wrap gap-2">
      {subjects.map(s => (
        <span key={s.label}
          className="bg-blue-50 text-blue-700 text-xs
                     font-medium px-3 py-1.5 rounded-full
                     border border-blue-100">
          {s.label}
        </span>
      ))}
    </div>
  </div>
);

export default SubjectsTaughtPanel;