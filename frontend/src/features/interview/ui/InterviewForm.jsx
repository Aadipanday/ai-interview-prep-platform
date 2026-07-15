import React, { useState, useRef } from "react";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router";

const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" fill="currentColor" />
  </svg>
);

const FileDescriptionIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 3.5h8l4 4V19a1.5 1.5 0 01-1.5 1.5h-10A1.5 1.5 0 016 19V5A1.5 1.5 0 017.5 3.5z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M9 12h6M9 15.5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 3.5h8l4 4V19a1.5 1.5 0 01-1.5 1.5h-10A1.5 1.5 0 016 19V5A1.5 1.5 0 017.5 3.5z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8.5" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M5.5 19.5c1.2-3.2 3.8-5 6.5-5s5.3 1.8 6.5 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const CloudUploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.5 17.5a4 4 0 01-.5-7.97 5 5 0 019.79-1.7A4.5 4.5 0 0117 17.5H7.5z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M12 10.5v6M9.5 13l2.5-2.5 2.5 2.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ClipboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="5.5" width="10" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M10 5.5V4.75A1.25 1.25 0 0111.25 3.5h1.5A1.25 1.25 0 0114 4.75V5.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="2.75" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M12 3.5v2M12 18.5v2M20.5 12h-2M5.5 12h-2M17.7 6.3l-1.4 1.4M7.7 16.3l-1.4 1.4M17.7 17.7l-1.4-1.4M7.7 7.7L6.3 6.3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const CodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9 8l-4 4 4 4M15 8l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TerminalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3.5" y="4.5" width="17" height="15" rx="1.8" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M7 9.5l3 3-3 3M12.5 15.5h4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const InterviewForm = () => {
  const { loading, generateReport, reports } = useInterview();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const resumeInputRef = useRef();

  const navigate = useNavigate();

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0] || null;
    setResumeFile(file);
    setError("");
  };

  const handleGenerateReport = async () => {
    if (!jobDescription.trim()) {
      setError("Please add the job description.");
      return;
    }
    if (!resumeFile) {
      setError("Please upload your resume.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const data = await generateReport({ jobDescription, selfDescription, resumeFile });
      navigate(`/interview/${data._id}`);
    } catch (err) {
      setError(err?.message || "Something went wrong generating your report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // `loading` from the hook is shared across generateReport, getReportById,
  // AND getReports — and this page auto-triggers getReports() on mount (no
  // interviewId in the URL). Blocking the whole form behind
  // `if (loading) return <loading screen>` meant the form vanished on every
  // page load while the recent-reports list fetched in the background.
  // Loading feedback lives on the button (via `submitting`) and on the
  // reports list itself, so the form stays put.
  const isGenerating = submitting || loading;

  return (
    <>
      <section className="interview-card">
        <div className="interview-card__header">
          <span className="badge">
            <SparkleIcon />
            Interview Architect AI
          </span>
          <h1>Master Your Interview</h1>
          <p className="subtext">
            Leverage AI to prepare for your specific role and resume. Generate simulated
            questions, tailored responses, and technical deep-dives.
          </p>
        </div>

        <div className="interview-input-group">
          <div className="left">
            <label className="field-label" htmlFor="jobDescription">
              <FileDescriptionIcon />
              Job Description
            </label>
            <div className="textarea-wrap">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                id="jobDescription"
                name="jobDescription"
                placeholder="Paste the full job description here..."
              />
              <button type="button" className="paste-btn" aria-label="Paste from clipboard">
                <ClipboardIcon />
              </button>
            </div>
          </div>

          <div className="right">
            <div className="input-group">
              <p className="field-label">
                <FileIcon />
                Primary Resume
              </p>
              <label className="upload-box" htmlFor="resume">
                <span className="upload-box__icon">
                  <CloudUploadIcon />
                </span>
                {resumeFile ? (
                  <>
                    <span className="upload-box__filename">{resumeFile.name}</span>
                    <span className="upload-box__meta">{formatFileSize(resumeFile.size)}</span>
                    <span className="upload-box__change">Change File</span>
                  </>
                ) : (
                  <>
                    <span className="upload-box__filename">Upload Resume</span>
                    <span className="upload-box__meta">PDF only</span>
                  </>
                )}
              </label>
              <input
                ref={resumeInputRef}
                hidden
                type="file"
                name="resume"
                id="resume"
                accept=".pdf"
                onChange={handleResumeChange}
              />
            </div>

            <div className="input-group">
              <label className="field-label" htmlFor="selfDescription">
                <UserIcon />
                Self Description
                <small className="optional">(Optional)</small>
              </label>
              <textarea
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                id="selfDescription"
                name="selfDescription"
                placeholder="Briefly tell us about your specific goals or concerns for this interview..."
              />
            </div>

            {error && <p className="form-error">{error}</p>}

            <button
              onClick={handleGenerateReport}
              className="btn primary-btn"
              type="button"
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate Interview Prep"}
              {!isGenerating && <ArrowIcon />}
            </button>
            <p className="helper-text">AI will analyze your match and generate 10 questions.</p>
          </div>
        </div>
      </section>

      {reports?.length > 0 && (
        <section className="recent-reports">
          <div className="recent-reports__header">
            <h2>My Recent Interview Plans</h2>
            <span className="recent-reports__count">{reports.length}</span>
          </div>
          <ul className="reports-list">
            {reports.map((report) => (
              <li
                key={report._id}
                className="report-item"
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                <div className="report-item__icon">
                  <FileDescriptionIcon />
                </div>
                <div className="report-item__info">
                  <h3>{report.title || "Interview Prep"}</h3>
                  <p className="report-meta">
                    <span className="report-meta__date">
                      <ClockIcon />
                      {formatDate(report.createdAt)}
                    </span>
                  </p>
                </div>
                {typeof report.matchScore === "number" && (
                  <span className="report-item__score">{report.matchScore}%</span>
                )}
                <span className="report-item__arrow">
                  <ArrowIcon />
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {loading && !reports?.length && (
        <p className="recent-reports__loading">Loading your recent plans...</p>
      )}

      <div className="action-pills">
        <button type="button" className="pill">
          <SettingsIcon />
          Behavioral Analysis
        </button>
        <button type="button" className="pill">
          <CodeIcon />
          Technical Deep-Dives
        </button>
        <button type="button" className="pill">
          <TerminalIcon />
          Mock Feedback
        </button>
      </div>
    </>
  );
};

export default InterviewForm;