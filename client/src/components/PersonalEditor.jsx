const PersonalEditor = ({ data, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {Object.entries(data).map(([key, value]) => (
      <label className=" flex flex-col justify-center gap-1">
        {key.toUpperCase()}
        <input
          key={key}
          value={value}
          onChange={(e) => onChange({ ...data, [key]: e.target.value })}
          className="auth-input"
          placeholder={key}
        />
      </label>
    ))}
  </div>
);

export default PersonalEditor;
