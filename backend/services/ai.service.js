import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
import puppeteer from "puppeteer";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = {
    type: Type.OBJECT,
    properties: {
        matchScore: {
            type: Type.NUMBER,
            description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description."
        },
        technicalQuestions: {
            type: Type.ARRAY,
            description: "A collection of technical interview questions with their underlying intention and suggested structured answers.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "A technical interview question, typically related to coding, system design, or problem-solving." },
                    intention: { type: Type.STRING, description: "The interviewer's goal behind asking this question." },
                    answer: { type: Type.STRING, description: "Guidance on how to answer the question effectively." }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: Type.ARRAY,
            description: "A set of behavioral interview questions with their purpose and structured guidance on how to answer them.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "A behavioral interview question focused on past experiences, teamwork, leadership, or conflict resolution." },
                    intention: { type: Type.STRING, description: "The interviewer's purpose, such as evaluating communication skills or cultural fit." },
                    answer: { type: Type.STRING, description: "Best practices for answering: use the STAR method, highlight soft skills, and provide real-life examples." }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: Type.ARRAY,
            description: "Identified skill gaps in the candidate's profile, along with severity levels indicating their impact on job readiness.",
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING, description: "A specific skill the candidate lacks or needs improvement in." },
                    severity: { type: Type.STRING, enum: ["low", "medium", "high"], description: "The importance of this skill gap in relation to the job role." }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: Type.ARRAY,
            description: "A structured preparation plan broken down by days, with focus areas and specific tasks.",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.STRING, description: "The day or session number in the preparation schedule. Example: 'Day 1'." },
                    focus: { type: Type.STRING, description: "The main topic or skill to focus on for that day." },
                    tasks: {
                        type: Type.ARRAY,
                        description: "List of actionable tasks or exercises to complete on that day.",
                        items: { type: Type.STRING }
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        },
        title: {
            type: Type.STRING,
            description: "A short, human-readable title for this interview report, e.g. the job title or role the candidate is preparing for."
        }
    },
    // "title" is now required — previously it was defined as a property but
    // left out of this array, so Gemini was free to omit it. That's why
    // stored reports never actually had a title to display.
    required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan", "title"]
};

const resumePdfSchema = {
    type: Type.OBJECT,
    properties: {
        html: {
            type: Type.STRING,
            description: "Complete, self-contained, print-ready HTML (including inline CSS) for the tailored resume, ready to be rendered and converted to a PDF."
        }
    },
    required: ["html"]
};

const answerFeedbackSchema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.NUMBER, description: "A score from 0 to 100." },
        feedback: { type: Type.STRING, description: "Concise, constructive feedback for the candidate." },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["score", "feedback", "strengths", "improvements"]
};

export async function evaluateInterviewAnswer({ question, answer, idealAnswer }) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are an encouraging interview coach. Review this interview answer.\nQuestion: ${question}\nCandidate answer: ${answer}\nSuggested answer guidance: ${idealAnswer || "Not provided"}\nGive specific, honest feedback.`,
        config: { responseMimeType: "application/json", responseSchema: answerFeedbackSchema, maxOutputTokens: 1024 }
    });

    if (!response.text) throw new Error("Gemini returned an empty response.");
    return JSON.parse(response.text);
}

export async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate an interview report for a candidate with the following details:
          Resume: ${resume}
          Self Description: ${selfDescription}
          Job Description: ${jobDescription}

Fill in every field with realistic, complete content. Do not leave any array empty — provide at least 3 technical questions, 3 behavioral questions, 2 skill gaps, and a 5-day preparation plan. Also provide a short "title" summarizing the role being prepared for.

Think carefully about how well the candidate's actual skills and experience match the job requirements before assigning matchScore, and make sure skillGaps reflect genuine, specific gaps between the resume/self-description and the job description — not generic filler.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: interviewReportSchema,
                maxOutputTokens: 12288,
                thinkingConfig: {
                    thinkingBudget: 2048,
                    includeThoughts: false
                }
            }
        });

        const finishReason = response.candidates?.[0]?.finishReason;
        if (finishReason && finishReason !== "STOP") {
            console.warn("Gemini finishReason was not STOP:", finishReason);
        }

        if (!response.text) {
            throw new Error("Gemini returned an empty response.");
        }

        return JSON.parse(response.text);
    } catch (err) {
        console.error("Failed to generate interview report:", err);
        throw err;
    }
}

/**
 * Renders HTML to a PDF buffer using a headless browser.

 * no parameters or body, which made the file a syntax error on its own.
 */
async function generatePdfFromHtml(html) {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-web-security",
            "--disable-features=IsolateOrigins,site-per-process"
        ]
    });

    try {
        const page = await browser.newPage();

        // Security: disable JavaScript execution to prevent client-side script injection
        await page.setJavaScriptEnabled(false);

        // Security: block external and local network requests to prevent SSRF
        await page.setRequestInterception(true);
        page.on("request", (req) => {
            const url = req.url();
            // Only allow inline data: URLs (e.g. data:image/...), abort all external or file:// requests
            if (url.startsWith("data:")) {
                req.continue();
            } else {
                req.abort();
            }
        });

        // Set content with a strict timeout to prevent indefinite hangs
        await page.setContent(html, { waitUntil: "load", timeout: 10000 });
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: "15mm", right: "15mm", bottom: "15mm", left: "15mm" }
        });
        return pdfBuffer;
    } finally {
        await browser.close();
    }
}

export async function generateResumePdf({ resume, selfDescription, jobDescription }) {
   
    const prompt = `Generate a tailored resume for a candidate with the following details:
          Resume: ${resume}
          Self Description: ${selfDescription}
          Job Description: ${jobDescription}

          Return a JSON object with a single field "html" containing complete, self-contained, print-ready HTML (including inline styles) for the resume, tailored to best match the job description.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: resumePdfSchema,
                maxOutputTokens: 12288
            }
        });

        const finishReason = response.candidates?.[0]?.finishReason;
        if (finishReason && finishReason !== "STOP") {
            console.warn("Gemini finishReason was not STOP:", finishReason);
        }

        if (!response.text) {
            throw new Error("Gemini returned an empty response.");
        }

        const { html } = JSON.parse(response.text);

      
        const pdfBuffer = await generatePdfFromHtml(html);
        return pdfBuffer;
    } catch (err) {
        console.error("Failed to generate resume PDF:", err);
        throw err;
    }
}


