import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { useInterview } from "../hooks/useInterview.js";
import { evaluateMockAnswer } from "../services/interview.api.js";
import "../style/interview.scss";

const MockInterview = () => {
  const { interviewId } = useParams();
  const { report, loading } = useInterview();
  const questions = useMemo(() => [
    ...(report?.technicalQuestions || []),
    ...(report?.behavioralQuestions || []),
  ], [report]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (loading || !report) return <main className="loading-screen"><h1>Preparing your mock interview...</h1></main>;
  const question = questions[index];
  if (!question) return <main className="loading-screen"><h1>No questions are available for this report.</h1></main>;

  const submitAnswer = async () => {
    if (!answer.trim()) return setError("Write an answer before requesting feedback.");
    setSubmitting(true); setError("");
    try { setFeedback(await evaluateMockAnswer({ interviewId, question: question.question, answer, idealAnswer: question.answer })); }
    catch (err) { setError(err.response?.data?.message || "Feedback could not be generated. Please try again."); }
    finally { setSubmitting(false); }
  };

  const nextQuestion = () => { setIndex((current) => Math.min(current + 1, questions.length - 1)); setAnswer(""); setFeedback(null); setError(""); };

  return <main className="mock-page"><section className="mock-card">
    <div className="mock-card__header"><Link to={`/interview/${interviewId}`}>← Back to report</Link><span>Question {index + 1} of {questions.length}</span></div>
    <div className="mock-progress"><span style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
    <p className="mock-card__eyebrow">AI Mock Interview</p><h1>{question.question}</h1>
    <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Type the answer you would give in an interview..." disabled={submitting || Boolean(feedback)} />
    {error && <p className="mock-error">{error}</p>}
    {!feedback ? <button className="mock-primary" type="button" onClick={submitAnswer} disabled={submitting}>{submitting ? "Reviewing your answer..." : "Get AI Feedback"}</button> : <div className="mock-feedback"><div><span className="mock-score">{feedback.score}%</span><p>{feedback.feedback}</p></div><div className="mock-feedback__lists"><section><h2>Strong points</h2><ul>{feedback.strengths.map((item) => <li key={item}>{item}</li>)}</ul></section><section><h2>Improve next time</h2><ul>{feedback.improvements.map((item) => <li key={item}>{item}</li>)}</ul></section></div><button className="mock-primary" type="button" onClick={nextQuestion} disabled={index === questions.length - 1}>{index === questions.length - 1 ? "Interview complete" : "Next question"}</button></div>}
  </section></main>;
};

export default MockInterview;
