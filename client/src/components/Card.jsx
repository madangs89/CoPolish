const Card = ({ icon, bg, title, desc, footer, onClick, handleHover }) => (
  <div
    onClick={onClick}
    onMouseEnter={() => handleHover(2.5)}
    onMouseLeave={() => handleHover(1)}
    className="cursor-pointer rounded-2xl bg-white border border-[#e6e6e6] p-6 shadow-sm hover:shadow-xl transition-all"
  >
    <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-6`}>
      {icon}
    </div>

    <h3 className="text-lg font-semibold text-[#1f2430]">{title}</h3>
    <p className="text-sm text-[#6b6b6b] mt-2">{desc}</p>

    <div className="mt-6 text-xs font-medium">{footer}</div>
  </div>
);

export default Card;