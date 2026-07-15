import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api";
import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import { AuthContext } from "../../auth/auth.context";
import { useParams } from "react-router";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    const { user } = useContext(AuthContext);
    const { interviewId } = useParams();

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context;

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true);
        let response = null;
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
            setReport(response.interviewReport);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
        return response?.interviewReport;
    };

    const getReportById = async (id) => {
        setLoading(true);
        let response = null;
        try {
            // BUG FIX: was `rsponse` (typo) — assigning to an undeclared
            // variable throws a ReferenceError in strict-mode ES modules,
            // so `response` stayed null and setReport never ran.
            response = await getInterviewReportById(id);
            setReport(response.interviewReport);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
        return response?.interviewReport;
    };

    const getReports = async () => {
        setLoading(true);
        let response = null;
        try {
            response = await getAllInterviewReports();
            setReports(response.interviewReports);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
        return response?.interviewReports;
    };

    // BUG FIX: this effect only re-ran when `interviewId` changed. Logging
    // out and into a *different account* on the same page (interviewId
    // stays undefined the whole time on "/") never re-triggered it, so the
    // previous account's `reports` just sat in context and kept rendering
    // for the next account too — even though the backend was always
    // correctly scoping the query to req.user.id. The data was never
    // "leaking" between accounts; it was just never being asked for again.
    //
    // Now the effect also depends on the logged-in user's id, so switching
    // accounts triggers a fresh fetch. Stale data is also cleared
    // immediately (before the fetch resolves) so nothing from the old
    // account is visible even momentarily during the switch.
    const userId = user?._id || user?.id;

    useEffect(() => {
        setReport(null);
        setReports([]);

        if (!userId) return; // not logged in (yet) — nothing to fetch

        if (interviewId) {
            getReportById(interviewId);
        } else {
            getReports();
        }
    }, [interviewId, userId]);

    // Deliberately does NOT use the shared `loading`/`setLoading` from
    // context — that flag also drives `if (loading || !report) return
    // <loading screen>` in Interview.jsx, which would replace the ENTIRE
    // report page with a spinner while the resume downloads. Button-level
    // loading state belongs in the component that owns the button.
    const downloadResume = async (id) => {
        const targetId = id || interviewId;
        if (!targetId) {
            throw new Error("No interview id available to download a resume for.");
        }

        // BUG FIX: was calling a function named `getResumePdf` that doesn't
        // exist in interview.api.js, and passing a plain string. The real
        // export is `generateResumePdf`, and it expects an object argument:
        // { interviewReportId }. Axios's `responseType: "blob"` already
        // returns a Blob as response.data, so no extra conversion needed.
        const blob = await generateResumePdf({ interviewReportId: targetId });

        // Fetching the PDF bytes alone does nothing visible in the browser —
        // this is the part that was missing entirely before. An object URL
        // + a temporary <a download> click is what actually triggers the
        // browser's save/download behavior.
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "resume.pdf";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    };

    return {
        loading,
        report,
        reports,
        generateReport,
        getReportById,
        getReports,
        downloadResume,
    };
};