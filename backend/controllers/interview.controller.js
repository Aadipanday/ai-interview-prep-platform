import { PDFParse } from "pdf-parse"
import { evaluateInterviewAnswer, generateInterviewReport, generateResumePdf } from "../services/ai.service.js";
import interviewReportModel from "../models/interviewReport.model.js";

export async function generateInterViewReportController(req,res) {

    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload a resume PDF." });
        }

        const parser = new PDFParse({ data: req.file.buffer });
        const resumeContent = await parser.getText();
        await parser.destroy();

        const { selfDescription, jobDescription } = req.body;

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.Id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        });

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        });
    } catch (err) {
        console.error("generateInterViewReportController error:", err);
        res.status(500).json({ message: "Failed to generate interview report", error: err.message });
    }

};

export async function getInterviewReportByIdController(req,res){
    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.Id })

    if(!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}

export async function getAllInterviewReportsController(req, res) {
  const interviewReports = await interviewReportModel
    .find({ user: req.user.Id })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -strategicAdvice -skillGaps -preparationPlan"
    );

  res.status(200).json({
    message: "Interview reports fetched successfully.",
    interviewReports,
  });
}

/**
 * @description controller to generate resumepdf based on user detaile
 */

export async function generateResumePdfController(req,res) {
    const {interviewReportId} = req.params;

    const interviewReport = await interviewReportModel.findOne({ _id: interviewReportId, user: req.user.Id });

    if(!interviewReport){
        return res.status(404).json({
            message: "Interview report not found"
        })
    }

    const {resume, jobDescription, selfDescription} = interviewReport;

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription});

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer);
}

export async function evaluateMockAnswerController(req, res) {
    const { interviewId } = req.params;
    const { question, answer, idealAnswer } = req.body;

    if (!question || !answer?.trim()) {
        return res.status(400).json({ message: "A question and answer are required." });
    }

    const report = await interviewReportModel.findOne({ _id: interviewId, user: req.user.Id }).select("_id");
    if (!report) return res.status(404).json({ message: "Interview report not found." });

    try {
        const feedback = await evaluateInterviewAnswer({ question, answer, idealAnswer });
        return res.status(200).json({ feedback });
    } catch (error) {
        console.error("evaluateMockAnswerController error:", error);
        return res.status(500).json({ message: "Failed to evaluate your answer." });
    }
}


