import Appointment from "../../models/appointmentModel.js";

// Set The Appointment Availability as per the Professor specified time slots
export const createAvailability = async (req, res) => {
  const { professorId, times } = req.body;

  // Validate input
  if (!professorId || !Array.isArray(times) || times.length === 0) {
    return res.status(400).json({
      message: "Invalid input. Professor ID and times are required.",
      status: false,
      code: 400,
    });
  }

  try {
    // Create Availability for the Appointment
    const availability = await Promise.allSettled(
      times.map((time) =>
        Appointment.create({
          professorId,
          time,
          status: "available",
        })
      )
    );

    // Separate successes and failures
    const successes = results
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value);
    const errors = results
      .filter((r) => r.status === "rejected")
      .map((r) => r.reason);

    if (errors.length > 0) {
      console.error("Some availability slots failed to save:", errors);
    }

    res.status(201).json({
      message: "Availability created Successfully",
      data: availability,
      status: true,
      code: 201,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Error in creating availability",
      error: error.message,
      status: false,
      code: 500,
    });
  }
};

// Now View the Available Slots
export const viewAvailability = async (req, res) => {
  const { professorId } = req.params;

  try {
    const availableSlots = await Appointment.find({
      where: {
        professorId,
        studentId: null,
        status: "booked",
      },
    });

    res.status(200).json({
      message: "Available slots fetched successfully.",
      data: availableSlots,
      status: true,
      code: 200,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error retrieving available slots",
      error: error.message,
      status: false,
      code: 500,
    });
  }
};

// Book an Appointment as Student books a slot
export const bookAppointment = async (req, res) => {
  const { appointmentId, studentId } = req.body;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment)
      return res.status(404).json({
        message: "Appointment not found",
        status: false,
        code: 404,
      });

    if (appointment.studentId)
      return res.status(400).json({
        message: "Slot already booked by another student",
        status: false,
        code: 400,
      });

    appointment.studentId = studentId;
    appointment.status = "booked";
    await appointment.save();

    res.status(200).json({
      message: "Appointment Booked Successfully.",
      data: appointment,
      status: true,
      code: 200,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error booking appointment",
      error: error.message,
      status: false,
      code: 500,
    });
  }
};

// Cancel the Appointment
export const cancelAppointment = async (req, res) => {
  const { appointmentId } = req.body;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment)
      return res.status(404).json({
        message: "Appointment not found.",
        status: false,
        code: 404,
      });

    appointment.status = "cancelled";
    appointment.studentId = null;
    await appointment.save();

    res.status(200).json({
      message: "Appointment cancelled successfully.",
      data: appointment,
      status: true,
      code: 200,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error cancelling appointment",
      error: error.message,
      status: false,
      code: 500,
    });
  }
};

// Now get to view the Students Appointments.
export const getStudentAppointments = async (req, res) => {
  const { studentId } = req.params;
  try {
    const appointments = await Appointment.find({
      studentId,
    });

    res.status(200).json({
      message: "Appointments retreived successfully.",
      data: appointments,
      status: true,
      code: 200,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching appointments.",
      error: error.message,
      status: false,
      code: 500,
    });
  }
};
