const MobileResumeWrapper = ({ children }) => {
  const isMobile = window.innerWidth < 768;
  const scale = isMobile ? window.innerWidth / 794 : 1;

  return (
    <div className="flex items-start h-screen overflow-y-scroll overflow-x-hidden  justify-center">
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default MobileResumeWrapper;
