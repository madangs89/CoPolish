import AchievementsEditor from "./AchievementsEditor";
import CertificationsEditor from "./CertificationsEditor";
import EducationEditor from "./EducationEditor";
import ExperienceEditor from "./ExperienceEditor";
import ExtracurricularEditor from "./ExtracurricularEditor";
import HobbiesEditor from "./HobbiesEditor";
import PersonalEditor from "./PersonalEditor";
import Preview from "./ResumePreview";
import ProjectsEditor from "./ProjectsEditor";
import SkillsEditor from "./SkillsEditor";
import ResumePreview from "./ResumePreview";

function renderSection(section, resumeData, setResumeData) {
  switch (section) {
    case "personal":
      return (
        <PersonalEditor
          data={resumeData.personal}
          onChange={(data) => setResumeData((p) => ({ ...p, personal: data }))}
        />
      );
    case "education":
      return (
        <EducationEditor
          data={resumeData.education}
          onChange={(data) => setResumeData((p) => ({ ...p, education: data }))}
        />
      );

    case "experience":
      return (
        <ExperienceEditor
          data={resumeData.experience}
          onChange={(data) =>
            setResumeData((p) => ({ ...p, experience: data }))
          }
        />
      );

    case "skills":
      return (
        <SkillsEditor
          data={resumeData.skills}
          onChange={(data) => setResumeData((p) => ({ ...p, skills: data }))}
        />
      );

    case "preview":
      return (
        <ResumePreview
          data={resumeData}
          resumeData={resumeData}
          setResumeData={setResumeData}
        />
      );
    case "projects":
      return (
        <ProjectsEditor
          data={resumeData.projects}
          resumeData={resumeData}
          setResumeData={setResumeData}
          onChange={(data) => setResumeData((p) => ({ ...p, projects: data }))}
        />
      );
    case "certifications":
      return (
        <CertificationsEditor
          data={resumeData.certifications}
          resumeData={resumeData}
          setResumeData={setResumeData}
          onChange={(data) =>
            setResumeData((p) => ({ ...p, certifications: data }))
          }
        />
      );
    case "achievements":
      return (
        <AchievementsEditor
          data={resumeData.achievements}
          resumeData={resumeData}
          setResumeData={setResumeData}
          onChange={(data) =>
            setResumeData((p) => ({ ...p, achievements: data }))
          }
        />
      );
    case "hobbies":
      return (
        <HobbiesEditor
          data={resumeData.hobbies}
          resumeData={resumeData}
          setResumeData={setResumeData}
          onChange={(data) => setResumeData((p) => ({ ...p, hobbies: data }))}
        />
      );
    case "extracurricular":
      return (
        <ExtracurricularEditor
          data={resumeData.extracurricular}
          onChange={(data) =>
            setResumeData((p) => ({ ...p, extracurricular: data }))
          }
        />
      );

    default:
      return null;
  }
}
export default renderSection;
