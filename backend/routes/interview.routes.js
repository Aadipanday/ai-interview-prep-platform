import express from "express"
import authMiddleware from "../middleware/auth.middleware.js";
import { evaluateMockAnswerController, generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController } from "../controllers/interview.controller.js";
import upload from "../middleware/file.middleware.js";
import { generateResumePdf } from "../services/ai.service.js";


const interviewRouter = express.Router();


/**
 * @route Post /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job description
 * @access private
 */
interviewRouter.post("/",authMiddleware, upload.single("resume"), generateInterViewReportController )


/**
 * @route GET /api/interview/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */

interviewRouter.get("/report/:interviewId", authMiddleware, getInterviewReportByIdController)

interviewRouter.post("/:interviewId/mock-feedback", authMiddleware, evaluateMockAnswerController)

/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */

interviewRouter.get("/", authMiddleware , getAllInterviewReportsController)

/**
 * @route GET /api/interview/resuem/pdf
 * @description generate resume pdf on the basis of user detail
 * @access private
 */

interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware, generateResumePdfController)



export default interviewRouter;
