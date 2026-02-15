function toParticipant(person, role) {
  if (!person) return null;
  const id = person._id || person.id || person;
  const name = person.name || (role === "Faculty" ? "Instructor" : "Student");
  const email = person.instituteEmail || person.email || "";
  const displayId = role === "Faculty" ? (person.employeeId || id) : (person.studentId || id);
  return { id, name, email, role, displayId };
}

export function mapBackendCourseToUI(c) {
  if (!c) return null;
  const instructor = c.instructor
    ? {
        id: c.instructor._id || c.instructor,
        name: c.instructor.name || "",
        email: c.instructor.email || c.instructor.instituteEmail || "",
        employeeId: c.instructor.employeeId,
      }
    : null;
  const students = c.students || [];
  const enrolledStudentIds = students.map((s) =>
    typeof s === "string" ? s : (s._id || s)
  );
  const participants = [
    ...(instructor ? [toParticipant({ ...instructor }, "Faculty")] : []),
    ...students
      .filter((s) => s && typeof s === "object")
      .map((s) =>
        toParticipant(
          {
            _id: s._id || s,
            name: s.name,
            instituteEmail: s.instituteEmail || s.email,
            studentId: s.studentId,
          },
          "Student"
        )
      ),
  ];
  return {
    id: c._id,
    code: c.courseCode || "",
    title: c.title || "",
    semester: String(c.semester ?? ""),
    department: c.department || "",
    credits: c.credits || 0,
    instructor,
    enrolledStudentIds,
    participants,
    schedule: { days: [], time: "", room: "" },
    description: c.description || "",
    tags: c.tags || [],
    materials: [],
    assignments: [],
    sections: [],
    createdAt: c.createdAt || "",
    updatedAt: c.updatedAt || "",
  };
}

export function mapBackendResourceToMaterial(r) {
  if (!r) return null;
  return {
    id: r._id,
    title: r.title || "Untitled",
    type: "FILE",
    url: r.fileUrl || "",
    description: r.description || "",
    by: r.uploadedBy
      ? { id: r.uploadedBy._id || r.uploadedBy, name: r.uploadedBy.name || "" }
      : null,
    at: r.createdAt || "",
  };
}

export function mapBackendAssignmentToUI(a) {
  if (!a) return null;
  return {
    id: a._id,
    title: a.title || "Untitled",
    description: a.description || "",
    dueAt: a.dueDate || "",
    pdfUrl: a.pdfFile || "",
    courseId: a.course?._id || a.course || "",
    by: a.uploadedBy
      ? { id: a.uploadedBy._id || a.uploadedBy, name: a.uploadedBy.name || "" }
      : null,
    at: a.createdAt || "",
  };
}

export function mapUICreateCourseToBackend(payload) {
  return {
    courseCode: payload.code || payload.courseCode,
    title: payload.title,
    credits: Number(payload.credits) || 3,
    semester: Number(payload.semester) || 1,
    department: payload.department || "",
    students: payload.students || [],
  };
}
