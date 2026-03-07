// RenderResumeForPreview.jsx

import { useEffect, useState , useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { templateRegistry } from "../../config/templateRegistory";
import PageRenderer from "../ResumePreview/PageRenderer";

export default function RenderResumeForPreview() {
  const { id } = useParams();

  const resumeData = useSelector((s) => s.resume.currentResume);
  const config = useSelector((s) => s.resume.currentResumeConfig);

  const checkedFields = useSelector(
    (state) => state.resume.currentResume.checkedFields,
  );
  const Component =
    templateRegistry[resumeData.templateId] ||
    templateRegistry["ModernMinimalResume"];

  const filteredData = useMemo(() => {
    const result = {};
    Object.keys(resumeData).forEach((key) => {
      if (checkedFields.includes(key)) {
        result[key] = resumeData[key];
      }
    });
    return result;
  }, [resumeData, checkedFields]);

  return (
    <div style={{ background: "#fff" }}>
      <PageRenderer
        Component={Component}
        data={filteredData}
        config={config}
      />
    </div>
  );
}
