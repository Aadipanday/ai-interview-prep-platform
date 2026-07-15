import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});


/**
 * 
 * @description Service to generate interview report based on user self description, resume adn job description.
 */
export const generateInterviewReport = async ({ jobDescription , selfDescription, resumeFile }) => {
    const formData = new FormData();

    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resumeFile)

    const response = await api.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data;

}

/**
 * 
 * @description Service to get interview report by interviewId.
 */

export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
}

/**
 * 
 * @description Service to get all interview reports of logged in user.
 */

export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/")

    return response.data;
}

export const generateResumePdf = async ({interviewReportId}) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob"
    });

    return response.data;
}

// Add this alongside your existing exports in services/interview.api.js
// (uses the same `api` axios instance already defined there).
//
// ASSUMPTION: route is DELETE /api/interview/:interviewId, following the
// same REST convention as your other interview routes
// (GET /api/interview/report/:interviewId, POST /api/interview/resume/pdf/:interviewReportId).
// Adjust the path here if your actual backend route differs.

export const deleteInterviewReport = async (interviewId) => {
    try {
        const res = await api.delete(`/api/interview/${interviewId}`);
        return res.data;
    } catch (error) {
        console.error("Error deleting interview report:", error);
        throw error;
    }
};