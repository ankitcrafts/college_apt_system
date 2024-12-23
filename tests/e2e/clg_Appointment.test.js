import request from "supertest";
import app from "../../index.js";
import mongoose from "mongoose";
import connectToDatabase from "../../src/config/dbConfig.js";
import  User  from "../../src/models/userModel.js";
import Appointment from "../../src/models/appointmentModel.js";

describe("College Appointment System - E2E Tests", () => {
  let professorToken;
  let studentToken;
  let professorId;
  let studentId;
  let appointmentId;

  beforeAll(async () => {
    // Synchronize database models
    await connectToDatabase();

    // Create the collections
    await User.deleteMany({});
    await Appointment.deleteMany({});

    // Create Professor and Student users
    const professor = await User.create({
      username: "Professor P1",
      email: "professor1@example.com",
      password: "password@123",
      role: "professor",
    });
    const student = await User.create({
      username: "Student A1",
      email: "student1@example.com",
      password: "password@123",
      role: "student",
    });

    professorId = professor._id.toString();
    studentId = student._id.toString();

    // Authenticate both users to get their tokens
    const professorRes = await request(app).post("/api/users/auth/login").send({
      email: "professor1@example.com",
      password: "password@123",
    });
    professorToken = professorRes.body.token;

    const studentRes = await request(app).post("/api/users/auth/login").send({
      email: "student1@example.com",
      password: "password@123",
    });
    studentToken = studentRes.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close(); //Close the Database
  });

//Testing the Appointment Functionality
  test("Professor should specify availability", async () => {
    const response = await request(app)
      .post("/api/appointments/availability")
      .set("Authorization", `Bearer ${professorToken}`)
      .send({
        professorId,
        times: ["2024-12-23T10:00:00.000Z", "2024-12-23T11:00:00.000Z"],
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Availability created Successfully");

    // Save one of the appointment IDs
    appointmentId = response.body.data[0]._id;
  });

  test("Student should view available slots for the professor", async () => {
    const response = await request(app)
      .get(`/api/appointments/availability/${professorId}`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Available slots fetched successfully");
    expect(response.body.data).toHaveLength(2);
  });

  test("Student should book an appointment", async () => {
    const response = await request(app)
      .post("/api/appointments/book-appointment")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        appointmentId,
        studentId,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Appointment Booked Successfully.");
    expect(response.body.data.studentId).toBe(studentId);
  });

  test("Professor should cancel the appointment", async () => {
    const response = await request(app)
      .post("/api/appointments/cancel-appointment")
      .set("Authorization", `Bearer ${professorToken}`)
      .send({
        appointmentId,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Appointment cancelled successfully.");
    expect(response.body.data.status).toBe("cancelled");
  });

  test("Student should view their appointments", async () => {
    const response = await request(app)
      .get(`/api/appointments/student/${studentId}`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Appointments retrieved successfully");
    expect(response.body.data).toHaveLength(0);
  });
});
