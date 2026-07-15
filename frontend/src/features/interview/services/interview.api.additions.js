// Add this alongside your existing exports in services/interview.api.js
// (getAllInterviewReports, generateInterviewReport, getInterviewReportById).
// This does NOT touch ai.service.js / Puppeteer / Gemini directly — it
// just calls your backend's own HTTP endpoint and gets bytes back.
//
// ASSUMPTION: the route below (POST /api/interview/:interviewId/resume-pdf)
// matches the route wired to `generateResumePdfController` in your
// interview.controller.js — adjust the path/method here if yours differs.

const API_BASE = "/api/interview";

export const getResumePdf = async (interviewId) => {
    const response = await fetch(`${API_BASE}/${interviewId}/resume-pdf`, {
        method: "POST",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to generate the resume PDF.");
    }

    // The backend sends raw PDF bytes (a Buffer from puppeteer's page.pdf()),
    // not JSON — so this must be read as a blob, not response.json().
    return response.blob();
};