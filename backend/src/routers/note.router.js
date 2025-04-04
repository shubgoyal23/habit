import { Router } from "express";
import { AddNote, deleteNote, getNotes, getNotesforMonth } from "../controller/note.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

//secure route
router.route("/").post(verifyJwt, AddNote);

router.route("/del").post(verifyJwt, deleteNote);
router.route("/list").post(verifyJwt, getNotes);
router.route("/list-month").post(verifyJwt, getNotesforMonth);

export default router;
