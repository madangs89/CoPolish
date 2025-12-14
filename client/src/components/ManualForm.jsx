const ManualForm = () => (
  <div className="max-w-xl mx-auto bg-white rounded-2xl border border-[#e6e6e6] p-8 shadow-sm">
    <h2 className="text-2xl font-bold text-[#1f2430]">Build your profile</h2>
    <p className="text-sm text-[#6b6b6b] mt-2">
      Start simple. You can refine it later.
    </p>

    <div className="flex flex-col gap-4 mt-6">
      <input className="auth-input" placeholder="Full name" />
      <input className="auth-input" placeholder="Current role / student" />
      <textarea
        rows={4}
        className="auth-input rounded-xl"
        placeholder="Short professional summary"
      />
    </div>

    <button className="mt-6 w-full rounded-full bg-black text-white py-3 text-sm font-medium hover:scale-[1.02] transition">
      Continue
    </button>
  </div>
);

export default ManualForm;
