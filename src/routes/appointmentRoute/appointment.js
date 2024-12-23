import express from "express";
import {
  createAvailability,
  viewAvailability,
  bookAppointment,
  cancelAppointment,
  getStudentAppointments,
} from "../../controllers/appointmentController/appointment.js";
import { authenticateJWT } from "../../middleware/authenticateJWT.js";

const router = express.Router();

// POST || Professors create availability
router.post("/availability", authenticateJWT, createAvailability); 

// GET || Students view availability and book appointments
router.get("/availability/:professorId", authenticateJWT, viewAvailability);

// POST || Students book appointment's slot
router.post("/book-appointment", authenticateJWT, bookAppointment);

// POST || Students cancel their appointments
router.post("/cancel-appointment",authenticateJWT, cancelAppointment);

// GET || Students view their appointments
router.get("/student/:studentId",authenticateJWT, getStudentAppointments); 

export default router;