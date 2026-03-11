import { useEffect, useState, useCallback } from "react";

// Mock data for demonstration
const mockQuestions = Array.from({ length: 47 }, (_, i) => ({
  questionId: { title: ["What is polymorphism?", "Explain ACID properties", "What is a deadlock?", "Difference between TCP and UDP", "What is Big O notation?", "Explain inheritance in OOP", "What is normalization?", "Explain process scheduling", "What is DNS?", "What is a linked list?"][i % 10] },
  subject: ["OOPS", "DBMS", "OS", "CN", "DSA"][i % 5],
  difficulty: ["Easy", "Medium", "Hard", "Basic"][i % 4],
  solvedAt: new Date(Date.now() - i * 86400000 * 2).toISOString(),
}));

const LIMIT = 10;

const subjectColors = {
  OOPS: { bg: "#e0f2fe", text: "#0369a1", dot: "#0ea5e9" },
  DBMS: { bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
  OS:   { bg: "#ede9fe", text: "#5b21b6", dot: "#8b5cf6" },
  CN:   { bg: "#dcfce7", text: "#166534", dot: "#22c55e" },
  DSA:  { bg: "#fce7f3", text: "#9d174d", dot: "#ec4899" },
};

const difficultyConfig = {
  Basic:  { color: "#6366f1", bg: "#eef2ff", label: "Basic" },
  Easy:   { color: "#16a34a", bg: "#dcfce7", label: "Easy" },
  Medium: { color: "#d97706", bg: "#fef3c7", label: "Medium" },
  Hard:   { color: "#dc2626", bg: "#fee2e2", label: "Hard" },
};

const SkeletonRow = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "18px 0", borderBottom: "1px solid #f3f4f6" }}>
    <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#f3f4f6", animation: "pulse 1.5s ease-in-out infinite" }} />
    <div style={{ flex: 1 }}>
      <div style={{ height: "14px", width: "60%", borderRadius: "6px", background: "#f3f4f6", animation: "pulse 1.5s ease-in-out infinite", marginBottom: "8px" }} />
      <div style={{ height: "11px", width: "30%", borderRadius: "6px", background: "#f3f4f6", animation: "pulse 1.5s ease-in-out infinite" }} />
    </div>
    <div style={{ width: "60px", height: "22px", borderRadius: "20px", background: "#f3f4f6", animation: "pulse 1.5s ease-in-out infinite" }} />
    <div style={{ width: "50px", height: "22px", borderRadius: "20px", background: "#f3f4f6", animation: "pulse 1.5s ease-in-out infinite" }} />
    <div style={{ width: "80px", height: "14px", borderRadius: "6px", background: "#f3f4f6", animation: "pulse 1.5s ease-in-out infinite" }} />
  </div>
);

export default function SolvedQuestions() {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [hoveredRow, setHoveredRow] = useState(null);

  const subjects = ["All", "OOPS", "DBMS", "OS", "CN", "DSA"];

  const getPageWiseData = useCallback(async (pageNum, subjectFilter) => {
    setLoading(true);
    try {
      // Simulating API call
      await new Promise(r => setTimeout(r, 700));
      const filtered = subjectFilter === "All"
        ? mockQuestions
        : mockQuestions.filter(q => q.subject === subjectFilter);
      const start = (pageNum - 1) * LIMIT;
      setQuestions(filtered.slice(start, start + LIMIT));
      setTotalPages(Math.ceil(filtered.length / LIMIT));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getPageWiseData(page, filter);
  }, [page, filter, getPageWiseData]);

  const handleFilter = (subject) => {
    setFilter(subject);
    setPage(1);
  };

  const stats = {
    total: mockQuestions.length,
    easy: mockQuestions.filter(q => q.difficulty === "Easy").length,
    medium: mockQuestions.filter(q => q.difficulty === "Medium").length,
    hard: mockQuestions.filter(q => q.difficulty === "Hard").length,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .row-item { transition: background 0.15s ease, transform 0.15s ease; }
        .row-item:hover { background: #fafafa; transform: translateX(3px); }
        .page-btn { transition: all 0.15s ease; }
        .page-btn:hover:not(:disabled) { transform: scale(1.08); }
        .filter-chip { transition: all 0.2s ease; cursor: pointer; }
        .filter-chip:hover { transform: translateY(-1px); }
        .stat-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
      `}</style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(145deg, #f8faff 0%, #f0f4ff 50%, #faf8ff 100%)", fontFamily: "'DM Sans', sans-serif", padding: "40px 20px 80px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", animation: "fadeUp 0.5s ease both" }}>

          {/* Header */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "12px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>✓</div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: "800", color: "#0f0f1a", margin: 0, letterSpacing: "-0.5px" }}>Solved Questions</h1>
            </div>
            <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 0 50px" }}>Track your interview preparation progress</p>
          </div>

          {/* Stats Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "28px" }}>
            {[
              { label: "Total Solved", value: stats.total, color: "#6366f1", bg: "#eef2ff" },
              { label: "Easy", value: stats.easy, color: "#16a34a", bg: "#dcfce7" },
              { label: "Medium", value: stats.medium, color: "#d97706", bg: "#fef3c7" },
              { label: "Hard", value: stats.hard, color: "#dc2626", bg: "#fee2e2" },
            ].map((s) => (
              <div key={s.label} className="stat-card" style={{ background: "white", borderRadius: "14px", padding: "16px", border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: "24px", fontFamily: "'Syne', sans-serif", fontWeight: "800", color: s.color }}>{s.value}</div>
                <div style={{ fontSize: "12px", color: "#9ca3af", fontWeight: "500", marginTop: "2px" }}>{s.label}</div>
                <div style={{ height: "3px", borderRadius: "4px", background: s.bg, marginTop: "10px" }}>
                  <div style={{ height: "100%", width: `${(s.value / stats.total) * 100}%`, borderRadius: "4px", background: s.color, transition: "width 0.6s ease" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Main Card */}
          <div style={{ background: "white", borderRadius: "20px", border: "1px solid #eef0f6", boxShadow: "0 4px 24px rgba(99,102,241,0.06)", overflow: "hidden" }}>

            {/* Filter Bar */}
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: "500", marginRight: "4px" }}>Filter:</span>
              {subjects.map((s) => (
                <button key={s} className="filter-chip" onClick={() => handleFilter(s)} style={{
                  padding: "5px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", border: "none", cursor: "pointer",
                  background: filter === s ? (s === "All" ? "#0f0f1a" : subjectColors[s]?.bg || "#eef2ff") : "#f9fafb",
                  color: filter === s ? (s === "All" ? "white" : subjectColors[s]?.text || "#4f46e5") : "#6b7280",
                  boxShadow: filter === s ? "0 2px 8px rgba(0,0,0,0.12)" : "none",
                }}>
                  {s === "All" ? "All" : s}
                </button>
              ))}
              <span style={{ marginLeft: "auto", fontSize: "12px", color: "#9ca3af" }}>
                Page <strong style={{ color: "#374151" }}>{page}</strong> of <strong style={{ color: "#374151" }}>{totalPages}</strong>
              </span>
            </div>

            {/* Table Header */}
            <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 90px 70px 100px", gap: "16px", padding: "10px 24px", background: "#fafafa", borderBottom: "1px solid #f0f0f0" }}>
              {["#", "Question", "Subject", "Level", "Solved On"].map((h) => (
                <span key={h} style={{ fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.6px" }}>{h}</span>
              ))}
            </div>

            {/* Rows */}
            <div style={{ padding: "0 24px" }}>
              {loading
                ? Array.from({ length: LIMIT }).map((_, i) => <SkeletonRow key={i} />)
                : questions.length === 0
                  ? (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
                      <div style={{ fontSize: "40px", marginBottom: "12px" }}>🎯</div>
                      <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: "700", fontSize: "16px", color: "#374151", margin: "0 0 6px" }}>No questions solved yet</p>
                      <p style={{ fontSize: "13px", margin: 0 }}>Start solving to track your progress!</p>
                    </div>
                  )
                  : questions.map((q, i) => {
                    const diff = difficultyConfig[q.difficulty] || difficultyConfig.Basic;
                    const subj = subjectColors[q.subject] || subjectColors.DSA;
                    const idx = (page - 1) * LIMIT + i + 1;
                    return (
                      <div key={i} className="row-item" onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)}
                        style={{ display: "grid", gridTemplateColumns: "28px 1fr 90px 70px 100px", gap: "16px", alignItems: "center", padding: "16px 0", borderBottom: "1px solid #f9fafb", animation: `fadeUp 0.3s ease ${i * 40}ms both`, cursor: "pointer", borderRadius: "8px", margin: "0 -8px", padding: "16px 8px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "700", color: "#d1d5db", fontFamily: "'Syne', sans-serif" }}>{String(idx).padStart(2, "0")}</span>
                        <span style={{ fontSize: "14px", fontWeight: "500", color: "#111827", lineHeight: "1.4" }}>{q.questionId.title}</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "600", color: subj.text, background: subj.bg, padding: "3px 10px", borderRadius: "20px", width: "fit-content" }}>
                          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: subj.dot, flexShrink: 0 }} />
                          {q.subject}
                        </span>
                        <span style={{ fontSize: "12px", fontWeight: "600", color: diff.color, background: diff.bg, padding: "3px 10px", borderRadius: "20px", width: "fit-content" }}>{diff.label}</span>
                        <span style={{ fontSize: "12px", color: "#9ca3af" }}>{new Date(q.solvedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                      </div>
                    );
                  })
              }
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div style={{ padding: "18px 24px", borderTop: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <button className="page-btn" onClick={() => setPage(1)} disabled={page === 1} style={{ width: "34px", height: "34px", borderRadius: "10px", border: "1px solid #e5e7eb", background: "white", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1, fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>«</button>
                <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1} style={{ width: "34px", height: "34px", borderRadius: "10px", border: "1px solid #e5e7eb", background: "white", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1, fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) => p === "..." ? (
                    <span key={`dot-${i}`} style={{ padding: "0 4px", color: "#9ca3af", fontSize: "13px" }}>…</span>
                  ) : (
                    <button key={p} className="page-btn" onClick={() => setPage(p)} style={{ width: "34px", height: "34px", borderRadius: "10px", border: page === p ? "none" : "1px solid #e5e7eb", background: page === p ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "white", color: page === p ? "white" : "#374151", fontWeight: page === p ? "700" : "400", fontSize: "13px", cursor: "pointer", boxShadow: page === p ? "0 4px 12px rgba(99,102,241,0.35)" : "none", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif" }}>{p}</button>
                  ))}

                <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages} style={{ width: "34px", height: "34px", borderRadius: "10px", border: "1px solid #e5e7eb", background: "white", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1, fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
                <button className="page-btn" onClick={() => setPage(totalPages)} disabled={page === totalPages} style={{ width: "34px", height: "34px", borderRadius: "10px", border: "1px solid #e5e7eb", background: "white", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1, fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>»</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}