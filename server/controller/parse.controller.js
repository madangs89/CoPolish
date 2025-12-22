import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export const parseData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    const { mimetype, buffer, size } = req.file;

    if (size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "File size exceeds 5MB limit",
      });
    }

    let text = "";

    if (mimetype === "application/pdf") {
      const uint8Array = new Uint8Array(buffer);
      const parser = new PDFParse(uint8Array);

      const result = await parser.getText();
      text = result.text;
    }

    else if (
      mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    }

    // ---- unsupported ----
    else {
      return res.status(400).json({
        success: false,
        message: "Unsupported file type",
      });
    }

    return res.status(200).json({
      success: true,
      text,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to parse file",
    });
  }
};
