import { useState } from "react";
import "../style/interview.scss";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate, useParams } from "react-router";

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CaretIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19 12H5M11 6l-6 6 6 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7 5.5v13l11-6.5-11-6.5z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="currentColor"
    />
  </svg>
);

const SparkleWandIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z" />
  </svg>
);

const SECTIONS = [
  { id: "technical", label: "Technical Questions" },
  { id: "behavioral", label: "Behavioral Questions" },
  { id: "roadmap", label: "Road Map" },
];

const SEVERITY_LABEL = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const QuestionCard = ({ item }) => {
  const [open, setOpen] = useState(false);

  return (
    <li className="content-item">
      <button
        type="button"
        className="content-item__toggle"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <p className="content-item__question">{item.question}</p>
        <span className={`content-item__caret${open ? " content-item__caret--open" : ""}`}>
          <CaretIcon />
        </span>
      </button>

      {open && (
        <div className="content-item__details">
          {item.intention && (
            <div className="content-item__block">
              <p className="content-item__label">Why it's asked</p>
              <p className="content-item__text">{item.intention}</p>
            </div>
          )}
          {item.answer && (
            <div className="content-item__block">
              <p className="content-item__label">How to answer</p>
              <p className="content-item__text">{item.answer}</p>
            </div>
          )}
        </div>
      )}
    </li>
  );
};

const Interview = () => {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  // BUG FIX: fetching now happens inside useInterview() itself (it already
  // has access to interviewId via its own useParams call), so this
  // component no longer needs its own useEffect or to call
  // getReportById/getReports manually. That duplicate effect was the
  // source of the naming mismatch — this component was calling
  // "getReportbyId" (lowercase b) which never existed on the hook.
  const { report, loading, downloadResume } = useInterview();
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const handleDownloadResume = async () => {
    setDownloadError("");
    setIsDownloading(true);
    try {
      await downloadResume(interviewId || report?._id);
    } catch (err) {
      setDownloadError(err?.message || "Couldn't download the resume. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // BUG FIX: this is the actual crash you hit. `report` starts out `null`
  // until the fetch above resolves. The old code only guarded the
  // report.* reads inside renderContent(), but the <nav>/<aside> markup
  // below read report.matchScore / report.skillGaps directly and
  // unconditionally — so on the very first render (report === null) it
  // threw "Cannot read properties of null". Guarding once, here, before
  // any report.* access, fixes it for the whole component.
  if (loading || !report) {
    return (
      <main className="loading-screen">
        <h1>Loading your interview plan...</h1>
      </main>
    );
  }

  const renderContent = () => {
    if (activeSection === "technical") {
      return (
        <ul className="content-list">
          {report.technicalQuestions?.map((item, index) => (
            <QuestionCard key={index} item={item} />
          ))}
        </ul>
      );
    }

    if (activeSection === "behavioral") {
      return (
        <ul className="content-list">
          {report.behavioralQuestions?.map((item, index) => (
            <QuestionCard key={index} item={item} />
          ))}
        </ul>
      );
    }

    return (
      <ul className="roadmap-list">
        {report.preparationPlan?.map((step, index) => (
          <li key={index} className="roadmap-item">
            <span className="roadmap-item__index">{index + 1}</span>
            <div>
              <p className="roadmap-item__day">{step.day}</p>
              <p className="roadmap-item__title">{step.focus}</p>
              {step.tasks?.length > 0 && (
                <ul className="roadmap-item__tasks">
                  {step.tasks.map((task, taskIndex) => (
                    <li key={taskIndex}>{task}</li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section className="interview-report">
      <nav className="report-nav">
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate("/")}
          aria-label="Back to interview plans"
        >
          <ArrowLeftIcon />
          Back
        </button>

        {typeof report.matchScore === "number" && (
          <div className="match-score">
            <span className="match-score__value">{report.matchScore}%</span>
            <span className="match-score__label">Match Score</span>
          </div>
        )}

        {SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            className={`report-nav__item${
              activeSection === section.id ? " report-nav__item--active" : ""
            }`}
            onClick={() => setActiveSection(section.id)}
          >
            <span>{section.label}</span>
            <ChevronIcon />
          </button>
        ))}

        {/* Grouped together under one wrapper with a single margin-top:
            auto, instead of each button carrying its own margin-top: auto.
            Two siblings both using margin-top: auto in the same flex
            column fight over the same leftover space and end up looking
            inconsistent — grouping them fixes that and keeps the two
            action buttons visually paired at the bottom of the nav. */}
        <div className="nav-actions">
          <button
            onClick={() => navigate(`/interview/${interviewId || report._id}/mock`)}
            className="btn mock-interview-btn"
            type="button"
          >
            <PlayIcon />
            Start Mock Interview
          </button>
          <button
            onClick={handleDownloadResume}
            className="btn download-resume-btn"
            type="button"
            disabled={isDownloading}
          >
            <SparkleWandIcon />
            {isDownloading ? "Preparing..." : "Download Resume"}
          </button>
          {downloadError && <p className="download-error">{downloadError}</p>}
        </div>
      </nav>

      <div className="report-main">{renderContent()}</div>

      <aside className="report-sidebar">
        <p className="report-sidebar__title">Skill Gaps</p>
        <div className="skill-gap-list">
          {report.skillGaps?.map((gap, index) => (
            <span key={index} className={`skill-gap-pill skill-gap-pill--${gap.severity}`}>
              {gap.skill}
              {gap.severity && (
                <span className="skill-gap-pill__severity">
                  {SEVERITY_LABEL[gap.severity] || gap.severity}
                </span>
              )}
            </span>
          ))}
        </div>
      </aside>
    </section>
  );
};

export default Interview;