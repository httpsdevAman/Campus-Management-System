# 🎓 Campus Management System

A secure and scalable **Campus Management System** built with **Node.js, Express, MongoDB, and JWT Authentication**.

This system allows only pre-authorized institute members (students, faculty, authorities, admins) to register and access the platform.

---

## 🚀 Features

- 🔐 Secure Authentication (JWT + HTTP-only cookies)
- 🧂 Password Hashing using bcrypt
- 🏫 Pre-approved user validation via Master Database
- 👥 Role-based Access Control (Student / Faculty / Authority / Admin)
- 🛡 Protected Routes Middleware
- 🗃 MongoDB Database with Mongoose ODM
- 🔑 Login / Register / Logout functionality

---

## 🏗 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT (JSON Web Token)
- **Password Security:** bcryptjs
- **API Testing:** Postman

---

## 📂 Project Structure

```
Campus-Management-System/
│
├─ backend/
│   ├── controllers/
│   │    ├── application.controller.js
│   │    ├── assignment.controller.js
│   │    ├── attendance.controller.js
│   │    ├── auth.controller.js
│   │    ├── calender.controller.js
│   │    ├── course.controller.js
│   │    ├── grievance.controller.js
│   │    ├── opportunity.controller.js
│   │    ├── resource.controller.js
│   │    ├── submission.controller.js
│   │    └── user.controller.js
│   │
│   ├── models/
│   │    ├── application.js
│   │    ├── assignment.js
│   │    ├── attendance.js
│   │    ├── calender.js
│   │    ├── course.js
│   │    ├── grievance.js
│   │    ├── master.js
│   │    ├── opportunity.js
│   │    ├── resource.js
│   │    ├── submission.js
│   │    ├── user.jsmodels/
│   │    ├── application.js
│   │    ├── assignment.js
│   │    ├── attendance.js
│   │    ├── calender.js
│   │    ├── course.js
│   │    ├── grievance.js
│   │    ├── master.js
│   │    ├── opportunity.js
│   │    ├── resource.js
│   │    ├── submission.js
│   │    └── user.js
│   │
│   ├── routes/
│   │    ├── assignment.route.js
│   │    ├── attendance.route.js
│   │    ├── auth.routes.js
│   │    ├── calender.route.js
│   │    ├── course.route.js
│   │    ├── grievance.route.js
│   │    ├── opporunity.route.js
│   │    ├── resource.routes.js
│   │    ├── submission.route.js
│   │    └── user.route.js
│   │ 
│   ├── middleware/
│   │    ├── auth.middleware.js
│   │    ├── role.middleware.js
│   │    └── upload.middleware.js
│   │
│   ├── config/
│   │    └── db.js
│   │
│   ├── masterData.json
│   ├── server.js
│   ├── .env
│   ├── package.json
│   └── package-lock.json
│
├─ frontend/
│   ├── public/
│   │    ├── iitmandi.webp
│   │    ├── iitmandidarklogo.png
│   │    └── iitmandilightlogo.png
│   │
│   ├── src/
│   │    ├── components/
│   │    │    ├── calender/
│   │    │    │    └── CalendarCard.jsx
│   │    │    │ 
│   │    │    ├── common/    
│   │    │    │    ├── ApiErrorState.jsx
│   │    │    │    ├── ConfirmModal.jsx
│   │    │    │    └── Toast.jsx
│   │    │    │ 
│   │    │    ├── courses/
│   │    │    │    ├── AssignmentDrawer.jsx
│   │    │    │    ├── AssignmentList.jsx
│   │    │    │    ├── AvailableCourseCard.jsx
│   │    │    │    ├── CourseAccordion.jsx
│   │    │    │    ├── CourseCard.jsx
│   │    │    │    ├── CourseChips.jsx
│   │    │    │    ├── CourseTable.jsx
│   │    │    │    ├── CourseTabs.jsx
│   │    │    │    ├── EnrolledCourseCard.jsx
│   │    │    │    ├── MaterialList.jsx
│   │    │    │    ├── SectionContentRenderer.jsx
│   │    │    │    ├── SectionEditorModal.jsx
│   │    │    │    └── TagPill.jsx
│   │    │    │ 
│   │    │    ├── dashboard/
│   │    │    │    ├── DashboardLayout.jsx
│   │    │    │    ├── KpiCard.jsx
│   │    │    │ 
│   │    │    ├── grievances/
│   │    │    │    ├── FilterChips.jsx
│   │    │    │    ├── GrievanceTable.jsx
│   │    │    │    ├── StatusBadge.jsx
│   │    │    │    ├── StatusProgress.jsx
│   │    │    │    └── Timeline.jsx
│   │    │    │ 
│   │    │    ├── layout/
│   │    │    │    ├── Sidebar.jsx
│   │    │    │    ├── TopBar.jsx
│   │    │    │    ├── TopNavbar.jsx
│   │    │    │    └── UserMenu.jsx
│   │    │    │ 
│   │    │    ├── opportunities/
│   │    │    │    ├── OpportunityCard.jsx
│   │    │    │    └── StatusPill.jsx
│   │    │    │ 
│   │    │    ├── settings/
│   │    │    │    ├── AcademicSettings.jsx
│   │    │    │    ├── BrandingSettings.jsx
│   │    │    │    ├── CalenderSettings.jsx
│   │    │    │    ├── GrievanceSettings.jsx
│   │    │    │    ├── OpportunitySettings.jsx
│   │    │    │    ├── SettingsPanel.jsx
│   │    │    │    ├── SettingsTabs.jsx
│   │    │    │    └── UserPolicySettings.jsx
│   │    │    │  
│   │    │    └── users/
│   │    │         ├── RolePill.jsx
│   │    │         ├── StatusPill.jsx
│   │    │         ├── UserCard.jsx
│   │    │         ├── UserEditModal.jsx
│   │    │         └── UserTable.jsx
│   │    │    
│   │    ├── config/
│   │    │    ├── api.js
│   │    │    ├── navConfig.js
│   │    │    └── roles.js
│   │    │
│   │    ├── context/
│   │    │    └── AuthContext.jsx
│   │    │    
│   │    ├── layouts/
│   │    │    └── AppShell.jsx
│   │    │
│   │    ├── pages/
│   │    │    ├── admin/
│   │    │    │    ├── AcademicSettings.jsx
│   │    │    │    ├── BrandingSettings.jsx
│   │    │    │    ├── CalenderSettings.jsx
│   │    │    │    ├── GrievanceSettings.jsx
│   │    │    │    ├── OpportunitySettings.jsx
│   │    │    │    ├── SettingsPanel.jsx
│   │    │    │    ├── SettingsTabs.jsx
│   │    │    │    └── UserPolicySettings.jsx
│   │    │    │ 
│   │    │    ├── authority/
│   │    │    │    ├── AuthorityDashboard.jsx
│   │    │    │    ├── AuthorityGrievanceDetail.jsx
│   │    │    │    └── AuthorityGrievances.jsx
│   │    │    │ 
│   │    │    ├── common/
│   │    │    │    ├── NotFound.jsx
│   │    │    │    └── Unauthorized.jsx
│   │    │    │ 
│   │    │    ├── faculty/
│   │    │    │    ├── FacultyCourseDetail.jsx
│   │    │    │    ├── FacultyCourses.jsx
│   │    │    │    ├── FacultyDashboard.jsx
│   │    │    │    ├── FacultyGrievanceDetail.jsx
│   │    │    │    ├── FacultyGrievances.jsx
│   │    │    │    ├── FacultyOpportunities.jsx
│   │    │    │    ├── FacultyOppotunitiesDetail.jsx
│   │    │    │    ├── NewCourse.jsx
│   │    │    │    ├── NewFacultyGrievance.jsx
│   │    │    │    └── NewOpportunity.jsx
│   │    │    │ 
│   │    │    ├── student/
│   │    │    │    ├── NewGrievance.jsx
│   │    │    │    ├── StudentCourseDetail.jsx
│   │    │    │    ├── StudentCourses.jsx
│   │    │    │    ├── StudentDashboard.jsx
│   │    │    │    ├── StudentGrievanceDetail.jsx
│   │    │    │    ├── StudentGrievances.jsx
│   │    │    │    ├── StudentOpportunities.jsx
│   │    │    │    └── StudentOpportunityDetail.jsx
│   │    │    │ 
│   │    │    ├── Login.jsx
│   │    │    ├── Profile.jsx
│   │    │    └── Register.jsx
│   │    │
│   │    ├── routes/
│   │    │    ├── AppRoutes.jsx
│   │    │    ├── ProtectedRoute.jsx
│   │    │    └── RoleRedirect.jsx
│   │    │
│   │    ├── services/
│   │    │    ├── adapters/
│   │    │    │    ├── calenderAdapter.jsx
│   │    │    │    ├── courseAdapter.jsx
│   │    │    │    ├── grievanceAdapter.jsx
│   │    │    │    ├── opportunityAdapter.jsx
│   │    │    │    └── userAdapter.jsx
│   │    │    │
│   │    │    ├── authService.js
│   │    │    ├── calenderService.js
│   │    │    ├── capabilities.js
│   │    │    ├── courseService.js
│   │    │    ├── grievanceService.js
│   │    │    ├── http.js
│   │    │    ├── opportunityService.js
│   │    │    ├── profileService.js
│   │    │    ├── settingsService.js
│   │    │    └── userService.js
│   │    │
│   │    ├── utils/
│   │    │    ├── date.js
│   │    │    ├── string.js
│   │    │    └── validation.js
│   │    ├── App.jsx
│   │    ├── index.css
│   │    └── main.jsx
│   │
│   ├── .gitignore
│   ├── esling.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── vite.config.js
├── .gitignore
└── README.md 

```

---

## 🔐 Authentication Flow

### Registration
1. User enters institute email & password.
2. System checks if email exists in `Master` collection.
3. If authorized:
   - User is created
   - Password is hashed
   - JWT is generated
   - Token stored in HTTP-only cookie

### Login
1. User provides email & password.
2. Password is compared using bcrypt.
3. If valid:
   - JWT is generated
   - Stored in secure cookie

### Logout
- JWT cookie is cleared.
- Set current user to null

### Application 

- Data Structure: The application acts as a link between a Student and an Opportunity, storing a reference to both via their unique database IDs.

- Application States: Each entry tracks a status field, which defaults to pending but can be transitioned to accepted or rejected by faculty members.

- Submission Process: When a student applies, the system first verifies that the target Opportunity exists before creating a new record containing the student's ID and their statementOfPurpose.

- Role-Based Access Control: The retrieval logic uses a dynamic filter; faculty members can view all applicants for a specific opportunity, whereas students are restricted to viewing only their own submission.

- Data Population: When fetching applications, the system automatically "populates" the student field to include their name and instituteEmail for easier identification by faculty.

- Status Updates: Faculty members can finalize an application by updating its status, which directly modifies the record to reflect the decision (Accept/Reject).

- Timestamping: Every application record automatically includes createdAt and updatedAt timestamps to track when a student applied and when a final decision was made.

### Assignment 

- Role-Based Upload Restrictions: Only users with the "faculty" role are authorized to create new assignments, ensuring that academic materials are managed by verified staff.

- Mandatory File Handling: The system requires a PDF file upload for every assignment; if a file is missing from the request, the creation process is automatically terminated with an error.

- Data Structure: Each assignment is linked to a specific Course and the User (faculty member) who uploaded it via unique database identifiers.

- Flexible Metadata: Assignments include a title and description, with the system defaulting to "Untitled" and an empty string respectively if these fields are not explicitly provided during upload.

- Automated Deadlines: If a specific dueDate is not provided by the faculty member, the system automatically calculates a default deadline set to seven days from the moment of creation.

- Secure Storage: Uploaded PDF files are stored on the server, and the relative file path is saved within the assignment record for later retrieval.

- Course-Specific Retrieval: Users can fetch all assignments associated with a particular course, which are then returned in reverse chronological order so that the most recent tasks appear first.

- Enhanced Visibility: When retrieving assignments, the system "populates" the uploader’s information to display their name and instituteEmail, providing students with direct contact details for their instructors.

- Access Protection: All assignment routes are protected by authentication middleware, requiring a valid user session to either view or upload materials.

### Attendance 

- Instructor Authorization: Only the specific instructor assigned to a course is permitted to mark attendance, preventing unauthorized modifications by other faculty members.

- Automated Record Creation: The system automatically generates a new attendance document for any enrolled student who does not yet have an existing record for that specific course.

- Duplicate Prevention: To maintain data integrity, the system checks if attendance has already been recorded for a specific date and ignores duplicate entries for that same day.

- Bulk Processing: Faculty can mark multiple students as present simultaneously by providing an array of student IDs; students not included in this array are automatically marked as absent.

- State Management: Every student record maintains an attendance array tracking specific dates and their status (Present/Absent), alongside a totalAttendance counter for rapid calculation.

- Student Dashboard: Students can access a personalized summary for each course, providing transparency regarding their total classes held and total classes attended.

- Real-time Analytics: The system dynamically calculates an attendance percentage for students, providing a precise figure rounded to two decimal places.

- Automated Warning System: A built-in logic triggers a warning message if a student’s attendance falls below the 75% threshold, helping them monitor their eligibility requirements.

- Secure Route Protection: Attendance routes are strictly enforced with role-based access, ensuring students can only view their own data while faculty handle administrative updates.

### Calender

- Hierarchical Event Creation: The system differentiates between administrative and academic events, allowing for both global institutional scheduling and course-specific updates.

- Administrative Authority: Administrators can create global events (such as holidays) or assign events to specific courses, with full permissions to update or delete any entry in the calendar.

- Faculty Restrictions: Faculty members are restricted to creating and updating events solely for courses they are currently instructing; they cannot modify global events or events belonging to other instructors.

- Mandatory Course Association: For faculty-level events, the system enforces a requirement that a valid course ID be provided and verified against the instructor's ownership.

- Event Categorization: Every calendar entry is classified under a specific eventType, such as assignment, exam, holiday, or custom, to help users filter and prioritize their schedules.

- Timeline Management: Each event record captures mandatory startDate and endDate fields, ensuring clear duration visibility for all participants.

- Dynamic Role-Based Retrieval: The calendar view is personalized based on the user's role:

   - Admins: View all events across the entire platform.

   - Faculty: View events for the courses they teach plus all global events.

   - Students: View events for courses they are enrolled in plus all global events.

- Data Integrity and Ownership: Every event is linked to the user who created it (createdBy), and the system performs ownership checks before allowing any modifications.

- Route Protection: All calendar functionalities are secured behind authentication and role-based middleware, ensuring that only authorized users can manage or view specific scheduling data.

### Course 

- Course Creation: Faculty members are authorized to establish new courses by defining essential attributes such as a unique courseCode, title, credits, semester, and department.

- Automatic Instructor Assignment: When a faculty member creates a course, the system automatically assigns their user ID as the instructor for that record.

- Student Enrollment Management: Students can browse a list of available courses they are not currently enrolled in and initiate an enrollment request, which adds their ID to the course's students array.

- Unenrollment and Data Cleanup: Students have the option to unenroll from a course; upon doing so, the system removes them from the course record and optionally deletes their associated Attendance records to maintain database hygiene.

- Credit Tracking: The system includes a dedicated utility to calculate a student's total academic load by aggregating the credits of every course in which they are enrolled.

- Role-Specific Course Visibility: The system provides tailored views for different users: students see their enrolled and available courses, faculty see courses they instruct, and administrators can access a comprehensive list of all courses.

- Data Enrichment: To provide a complete overview, course listings are "populated" with detailed instructor information (name, email, department) and student rosters (name, ID, email).

- Integrity Constraints: The courseCode is strictly unique within the database to prevent duplicate course entries.

- Secure Access: All course-related operations are protected by authentication and role-based middleware, ensuring that actions like creating or unenrolling from courses are performed only by authorized users.

### Grievance

- Multirole Submission: Both students and faculty members can submit grievances by providing a title, description, and choosing from predefined categories like Infrastructure, Academic, Hostel, IT, or Mess.

- Priority and Identity Control: Submitters can flag the urgency of an issue (from Low to Urgent) and have the option to remain anonymous to protect their identity while reporting.

- Administrative Assignment: Administrators hold the exclusive authority to assign specific grievances to an Authority user for resolution or to clear existing assignments.

- Lifecycle Management: Grievances progress through a structured status workflow: Submitted, Under Review, In Progress, Resolved, and finally Closed.

- Audit Trail with Remarks: When an Authority or Admin updates the status of a grievance, they must provide a mandatory remark; the system maintains an array of these remarks, including who added them and when, to create a transparent history of the resolution process.

- Restricted Visibility: Access to grievance data is strictly controlled based on the user's relationship to the ticket:

    - Students/Faculty: Can only view grievances they personally submitted.

    - Authority: Can only view and manage grievances specifically assigned to them.

    - Admins: Have comprehensive access to view, filter, and delete any grievance in the system.

- Dynamic Filtering: The system allows for advanced searching of grievances based on their current status, priority, or category, enabling administrative users to prioritize their workload effectively.

- Reference System: Upon successful submission, the system generates a unique Grievance ID, which users can use for future tracking and correspondence.

- Data Enrichment: Every grievance record is automatically "populated" with relevant user details for the submitter and the assigned authority, as well as the roles of those providing remarks.

### Opportunity

- Creation of Listings: Faculty members are authorized to post new opportunities by defining the title, description, type (such as Internship, Scholarship, Hackathon, or Project), and a mandatory deadline.

- Automated Ownership Tracking: Every posted opportunity is automatically linked to the instructor who created it via the postedBy field, ensuring clear accountability for the listing.

- Universal Visibility: All authenticated users, regardless of their role as student or faculty, can view the full list of active opportunities to stay informed about current offerings.

- Strict Modification Controls: Faculty members can update or delete only the opportunities they personally posted; the system performs an ownership check to block unauthorized modifications by other users.

- Integrated Application Entry: Students can directly initiate an application for a specific opportunity through the provided entry point, which links their student profile to the listing.

- Applicant Oversight: Faculty members have access to view all students who have applied for an opportunity they posted, while students can check their own specific application status for that entry.

- Selection Workflow: The instructor who posted the opportunity is empowered to accept or reject applicants, effectively moving each application through the decision-making lifecycle.

- Data Enrichment: When listing opportunities, the system "populates" the creator's information to display their name, facilitating easier communication between students and instructors.

- Access Integrity: All opportunity-related routes are secured by authentication and role-based middleware, ensuring students can apply while administrative actions remain restricted to faculty.

### Resource

- Faculty-Led Uploads: Only users with the "faculty" role are authorized to upload educational materials, ensuring that all shared content is verified by an instructor.

- Mandatory File Requirements: The system enforces the inclusion of a file in the upload request; if no file is detected, the process is terminated with a 400 error.

- Course Validation: Before a resource is created, the system verifies that the target courseId exists in the database to maintain data integrity.

- Automated Data Linking: Each resource record automatically captures the uploader's ID and inherits the correct semester directly from the associated course data.

- Secure Storage and Paths: Uploaded files are saved to a specific server directory, and the relative fileUrl is stored in the database for future access.

- Organized Course Retrieval: Users can fetch all materials associated with a specific course, with results sorted in reverse chronological order to display the most recent resources first.

- Individual Resource Access: A dedicated endpoint allows users to retrieve a single resource, providing detailed metadata about the file, the course it belongs to, and the uploader.

- Detailed Metadata Population: When retrieving resources, the system "populates" the record with the uploader’s name and instituteEmail, along with the course code and title.

- File and Record Cleanup: Faculty members have the authority to delete resources; the system automatically removes the physical file from server storage before deleting the database entry.

- Authenticated Route Security: All resource operations are protected by middleware that requires a valid user session and specific role permissions for administrative actions.

### Submission

- Enrollment and Deadline Validation: Before accepting a submission, the system verifies that the student is officially enrolled in the course and that the current date has not exceeded the assignment’s dueDate.

- Mandatory File Format: Students are required to upload their work as a zipFile, and the system stores the resulting file path within the submission record.

- Automatic Resubmission Logic: If a student uploads a file for an assignment they have already submitted, the system automatically detects the existing record and updates the file path and submittedAt timestamp instead of creating a duplicate entry.

- Ownership and Privacy Checks: Faculty access is restricted so that instructors can only view submissions for assignments belonging to courses they personally teach.

- Student Tracking: Students can retrieve a personalized list of all their past submissions, which includes nested data for the assignment title and the specific courseCode.

- Faculty Review Interface: When an instructor views submissions, the system "populates" student details like name and instituteEmail, sorting entries by the most recent submission date.

- Grading and Feedback Fields: The data model includes dedicated fields for marks and feedback, allowing for future academic evaluation and instructor comments.

- Role-Based Routing: Operations are strictly partitioned; only students can submit or view their own history, while only faculty can view the full list of submissions for a specific assignment.

- Submission Accountability: Every record captures an immutable student ID and an assignment ID to ensure work is correctly attributed and linked to the right academic task.
---

## 🗃 Database Design

Some examples:

### Master Collection
Stores official institute records (whitelist).

```
{
  "_id": {
    "$oid": "699039e46618c4afa5cb8f5b"
  },
  "name": "Aarav Sharma",
  "studentId": "CSE2021001",
  "instituteEmail": "aarav.sharma@iitmandi.ac.in",
  "role": "student",
  "department": "CSE"
}
```

### Applications
Stores intership applications

```
{
  "opportunity": {
    "$oid": "6992049b59af8200c2520f50"
  },
  "student": {
    "$oid": "6990619fa318363389b2e9b6"
  },
  "status": "accepted",
  "createdAt": {
    "$date": "2026-02-15T17:39:01.425Z"
  },
  "updatedAt": {
    "$date": "2026-02-15T17:39:22.112Z"
  },
  "__v": 0
}
```

### Assignments
Stores assignments uploaded by faculty

```
{
  "_id": {
    "$oid": "69920ca0ed084b83bb2d128c"
  },
  "title": "assignment1",
  "description": "No-Description",
  "course": {
    "$oid": "6991e83f173fce267603ce7a"
  },
  "uploadedBy": {
    "$oid": "69907332c660f50e11ce39a5"
  },
  "pdfFile": "/uploads/assignments/1771179168883.pdf",
  "dueDate": {
    "$date": "2026-02-20T18:12:00.000Z"
  },
  "createdAt": {
    "$date": "2026-02-15T18:12:48.928Z"
  },
  "updatedAt": {
    "$date": "2026-02-15T18:12:48.928Z"
  },
  "__v": 0
}
```

### Courses
Stores courses offered

```
{
  "_id": {
    "$oid": "6990996f0a59b806b64acafc"
  },
  "courseCode": "CSE101",
  "title": "Data Structures",
  "credits": 4,
  "semester": 3,
  "department": "CSE",
  "instructor": {
    "$oid": "69907332c660f50e11ce39a5"
  },
  "students": [
    {
      "$oid": "6990619fa318363389b2e9b6"
    }
  ],
  "createdAt": {
    "$date": "2026-02-14T15:49:03.954Z"
  },
  "updatedAt": {
    "$date": "2026-02-15T18:14:43.932Z"
  },
  "__v": 5
}
```

### Users
Stores users registered

```
{
  "_id": {
    "$oid": "6990996f0a59b806b64acafc"
  },
  "courseCode": "CSE101",
  "title": "Data Structures",
  "credits": 4,
  "semester": 3,
  "department": "CSE",
  "instructor": {
    "$oid": "69907332c660f50e11ce39a5"
  },
  "students": [
    {
      "$oid": "6990619fa318363389b2e9b6"
    }
  ],
  "createdAt": {
    "$date": "2026-02-14T15:49:03.954Z"
  },
  "updatedAt": {
    "$date": "2026-02-15T18:14:43.932Z"
  },
  "__v": 5
}
```

Other databases are stored in a similar way.

### How to Login or Register
Note that only the members of the institute can Register of Login
Below are some registered Users which can login

Role: Student
Email: aarav.mehta@iitmandi.ac.in
Passowrd: 456

Role: Faculty 
Email: vikram.singh@iitmandi.ac.in
Passowrd: vikram

Role: Authority 
Email: priya.nair@iitmandi.ac.in
Passowrd: priya

Role: Admin
Email: rohan.mehta@iitmandi.ac.in
Passowrd: 12345