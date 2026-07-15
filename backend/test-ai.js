import generatInterviewReport from "./services/ai.service.js";

const result = await generatInterviewReport({
    resume: "Sample resume: React, Node.js, MongoDB developer with 2 projects.",
    selfDescription: "I am a quick learner aiming for a web dev internship.",
    jobDescription: "Looking for a Web Development Intern skilled in MERN stack."
});

console.log("=== FINAL PARSED RESULT ===");
console.log(JSON.stringify(result, null, 2));