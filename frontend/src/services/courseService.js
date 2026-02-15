import { get, post } from "./http";
import {
  mapBackendCourseToUI,
  mapBackendResourceToMaterial,
  mapBackendAssignmentToUI,
  mapUICreateCourseToBackend,
} from "./adapters/courseAdapter";

const _courseCache = new Map();

async function enrichWithResourcesAndAssignments(course) {
  try {
    const [resourcesRes, assignmentsRes] = await Promise.all([
      get(`/api/resources/course/${course.id}`),
      get(`/api/assignment/course/${course.id}`).catch(() => []),
    ]);
    const resources = Array.isArray(resourcesRes) ? resourcesRes : [];
    const assignments = Array.isArray(assignmentsRes) ? assignmentsRes : [];
    course.materials = resources.map(mapBackendResourceToMaterial);
    course.assignments = assignments.map(mapBackendAssignmentToUI);
    const materialItems = course.materials.map((m) => ({
      id: m.id,
      kind: "MATERIAL",
      title: m.title,
      description: m.description || "",
      url: m.url,
      published: true,
      createdAt: m.at,
      updatedAt: m.at,
    }));
    const assignmentItems = assignments.map((a) => {
      const u = mapBackendAssignmentToUI(a);
      return {
        id: u.id,
        kind: "ASSIGNMENT",
        title: u.title,
        description: u.description || "",
        dueAt: u.dueAt,
        url: u.pdfUrl,
        published: true,
        meta: { dueAt: u.dueAt, submissionRequired: true, allowResubmission: true },
        submissions: [],
        createdAt: u.at,
        updatedAt: u.at,
      };
    });
    // Fetch current student's submissions to show Submitted status and enable edit
    try {
      const mySubs = await get("/api/submit/my").catch(() => []);
      if (Array.isArray(mySubs) && mySubs.length > 0) {
        for (const item of assignmentItems) {
          const sub = mySubs.find((s) => {
            const aid = s.assignment?._id || s.assignment;
            return aid && String(aid) === String(item.id);
          });
          if (sub) {
            const studentId = sub.student?._id || sub.student;
            item.submissions = [
              { student: { id: studentId }, submittedAt: sub.submittedAt },
            ];
          }
        }
      }
    } catch {
      // Not a student or 403 - skip
    }
    course.sections = [];
    course.sections.push({
      id: "sec-resources",
      name: "Resources",
      type: "MATERIAL",
      items: materialItems,
    });
    course.sections.push({
      id: "sec-assignments",
      name: "Assignments",
      type: "ASSIGNMENT",
      items: assignmentItems,
    });
  } catch {
    // ignore
  }
  return course;
}

function notSupported(msg) {
  const err = new Error(msg || "Not supported by the backend.");
  err.status = 501;
  err.unsupported = true;
  throw err;
}

// ── List for student ──

export async function listCoursesForStudent() {
  const data = await get("/api/courses/my");
  const courses = (data || []).map(mapBackendCourseToUI);
  courses.forEach((c) => _courseCache.set(c.id, c));
  return courses.sort((a, b) => (a.code || "").localeCompare(b.code || ""));
}

// ── List for faculty ──

export async function listCoursesForFaculty() {
  const data = await get("/api/courses/faculty");
  const courses = (data || []).map(mapBackendCourseToUI);
  courses.forEach((c) => _courseCache.set(c.id, c));
  return courses.sort((a, b) => (a.code || "").localeCompare(b.code || ""));
}

// ── List available (for student: courses they are NOT enrolled in, to browse and enroll) ──

export async function listAvailableCourses() {
  const data = await get("/api/courses/available");
  const list = Array.isArray(data) ? data : [];
  return list
    .map(mapBackendCourseToUI)
    .sort((a, b) => (a.title || "").localeCompare(b.title || ""));
}

// ── List all (admin) ──

export async function listAllCourses() {
  const data = await get("/api/courses");
  const courses = (data || []).map(mapBackendCourseToUI);
  courses.forEach((c) => _courseCache.set(c.id, c));
  return courses.sort((a, b) => (a.code || "").localeCompare(b.code || ""));
}

// ── Get by ID ──
// role: "student" | "faculty" | "admin" - only fetches from the matching endpoint to avoid 403s

export async function getCourseById(id, role) {
  if (_courseCache.has(id)) {
    return enrichWithResourcesAndAssignments({ ..._courseCache.get(id) });
  }
  const tryStudent = !role || role === "student";
  const tryFaculty = !role || role === "faculty";
  const tryAdmin = !role || role === "admin";
  if (tryAdmin) {
    try {
      await listAllCourses();
      if (_courseCache.has(id)) {
        return enrichWithResourcesAndAssignments({ ..._courseCache.get(id) });
      }
    } catch {
      // ignore
    }
  }
  if (tryFaculty) {
    try {
      await listCoursesForFaculty();
      if (_courseCache.has(id)) {
        return enrichWithResourcesAndAssignments({ ..._courseCache.get(id) });
      }
    } catch {
      // ignore
    }
  }
  if (tryStudent) {
    try {
      await listCoursesForStudent();
      if (_courseCache.has(id)) {
        return enrichWithResourcesAndAssignments({ ..._courseCache.get(id) });
      }
    } catch {
      // ignore
    }
  }
  throw new Error("Course not found");
}

// ── Enroll (student self-enroll) ──

export async function enrollCourse({ courseId }) {
  await post(`/api/courses/${courseId}/enroll`);
  _courseCache.delete(courseId);
  return { message: "Enrolled successfully" };
}

// ── Create course (faculty) ──

export async function createCourse(payload) {
  const result = await post("/api/courses", mapUICreateCourseToBackend(payload));
  return mapBackendCourseToUI(result);
}

// ── Add material (backend file upload) ──

export async function addMaterial({ courseId, material }) {
  if (!material.file) {
    throw notSupported("File upload is required to add a material.");
  }
  const formData = new FormData();
  formData.append("title", material.title || "Untitled");
  formData.append("description", material.description || "");
  formData.append("courseId", courseId);
  formData.append("file", material.file);
  await post("/api/resources/upload-resource", formData);
  _courseCache.delete(courseId);
  return getCourseById(courseId);
}

// ── Add assignment (backend PDF upload) ──

export async function addAssignment({ courseId, assignment }) {
  if (!assignment.file) {
    throw notSupported("PDF file is required to add an assignment.");
  }
  const formData = new FormData();
  formData.append("title", assignment.title || "Untitled");
  formData.append("description", assignment.description || "");
  formData.append("course", courseId);
  formData.append("dueDate", assignment.dueAt ? new Date(assignment.dueAt).toISOString() : "");
  formData.append("pdfFile", assignment.file);
  await post("/api/assignment/upload-assignment", formData);
  _courseCache.delete(courseId);
  return getCourseById(courseId);
}

// ── Section operations: no backend support; throw so UI can show message ──

export async function createSection() {
  throw notSupported(
    "Section management is not supported by the backend. Use Add Material or Add Assignment instead."
  );
}

export async function renameSection() {
  throw notSupported("Section management is not supported by the backend.");
}

export async function addSectionItem() {
  throw notSupported(
    "Use Add Material or Add Assignment above to add content. Section management is not supported by the backend."
  );
}

export async function updateSection() {
  throw notSupported("Section management is not supported by the backend.");
}

export async function deleteSection() {
  throw notSupported("Section management is not supported by the backend.");
}

export async function updateSectionItem() {
  throw notSupported("Section management is not supported by the backend.");
}

export async function deleteSectionItem() {
  throw notSupported("Section management is not supported by the backend.");
}

// ── Submit assignment (student) ──

export async function submitAssignment({
  courseId,
  assignmentId,
  files,
}) {
  if (!files || !files[0]) {
    throw notSupported("File upload is required to submit.");
  }
  const formData = new FormData();
  formData.append("zipFile", files[0]);
  await post(`/api/submit/upload-submission/${assignmentId}`, formData);
  _courseCache.delete(courseId);
  return getCourseById(courseId);
}

// ── Admin: assign instructor / enroll student — not in backend ──

export async function assignInstructor() {
  throw notSupported("Assigning instructor is not supported by the backend.");
}

export async function enrollStudent({ courseId, studentUser }) {
  // Backend only supports self-enroll. Admin enrolling another user is not supported.
  if (studentUser) {
    throw notSupported(
      "Admin enrollment of another user is not supported by the backend. Students must enroll themselves."
    );
  }
  throw notSupported("Enrollment is not supported by the backend.");
}

export async function unenrollStudent({ courseId, studentId }) {
  // Backend only supports current user unenrolling themselves. Admin unenrolling another user is not supported.
  if (studentId) {
    throw notSupported("Unenrolling another user is not supported by the backend. Students must unenroll themselves.");
  }
  await post(`/api/courses/${courseId}/unenroll`);
  _courseCache.delete(courseId);
  return { message: "Unenrolled successfully" };
}

// ── User lists for admin dropdowns (no backend endpoint; return empty until backend adds /api/users) ──

export async function listFacultyUsers() {
  try {
    const data = await get("/api/users?role=faculty");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function listStudentUsers() {
  try {
    const data = await get("/api/users?role=student");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
