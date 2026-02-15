import CalendarEvent from "../models/calendar.js";
import Course from "../models/course.js";
import Assignment from "../models/assignment.js";
import Opportunity from "../models/opportunity.js";

/*
   FACULTY CREATE EVENT
*/

export const createFacultyEvent = async (req, res) => {
    try {
        const { title, description, startDate, endDate, eventType, course } = req.body;
 
        if (!course) {
            return res.status(400).json({
                message: "Course is required for faculty events"
            });
        }

        
        const courseData = await Course.findById(course);
        
        if (!courseData) {
            return res.status(404).json({ message: "Course not found" });
        }
        
        // Ensure faculty owns this course
        if (courseData.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You can only create events for your own course"
            });
        }

        const event = await CalendarEvent.create({
            title,
            description,
            startDate,
            endDate,
            eventType,
            course,
            createdBy: req.user._id,
        });

        res.status(201).json(event);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* 
   ADMIN CREATE EVENT
*/

export const createAdminEvent = async (req, res) => {
    try {
        const { title, description, startDate, endDate, eventType, course } = req.body;

        const event = await CalendarEvent.create({
            title,
            description,
            startDate,
            endDate,
            eventType,
            course: course || null,
            createdBy: req.user._id,
        });

        res.status(201).json(event);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const updated = await CalendarEvent.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json(updated);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* 
   FACULTY UPDATE EVENT
 */

export const updateFacultyEvent = async (req, res) => {
  try {
    const event = await CalendarEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Faculty cannot update global events
    if (!event.course) {
      return res.status(403).json({
        message: "Faculty cannot update global events"
      });
    }

    const course = await Course.findById(event.course);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Ensure faculty owns the course
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only update events of your own course"
      });
    }

    const updated = await CalendarEvent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
    try {
        const event = await CalendarEvent.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ message: "Event deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Transform assignment/opportunity to calendar event shape
function toCalendarEventShape(doc, eventType, dateField) {
  const date = doc[dateField];
  if (!date) return null;
  return {
    _id: `ext-${eventType}-${doc._id}`,
    title: doc.title,
    description: doc.description || "",
    eventType,
    startDate: date,
    endDate: date,
    course: doc.course || null,
    createdBy: doc.uploadedBy || doc.postedBy,
    __source: eventType,
  };
}

// Get Calendar (manual events + assignments + opportunities)
export const getCalendar = async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;

    let calendarEvents;
    let courseIds = [];

    if (user.role === "admin") {
      calendarEvents = await CalendarEvent.find();
      courseIds = null; // admin sees all assignments
    } else if (user.role === "faculty") {
      const courses = await Course.find({ instructor: userId });
      courseIds = courses.map((c) => c._id);
      calendarEvents = await CalendarEvent.find({
        $or: [{ course: { $in: courseIds } }, { course: null }],
      });
    } else {
      const courses = await Course.find({ students: userId });
      courseIds = courses.map((c) => c._id);
      calendarEvents = await CalendarEvent.find({
        $or: [{ course: { $in: courseIds } }, { course: null }],
      });
    }

    // Fetch assignments as calendar events (dueDate)
    const assignmentFilter = courseIds === null ? {} : { course: { $in: courseIds } };
    const assignments = await Assignment.find(assignmentFilter)
      .populate("course", "courseCode title")
      .lean();
    const assignmentEvents = assignments
      .map((a) => toCalendarEventShape(a, "assignment", "dueDate"))
      .filter(Boolean);

    // Fetch opportunities as calendar events (deadline) - visible to all
    const opportunities = await Opportunity.find().lean();
    const opportunityEvents = opportunities
      .map((o) => toCalendarEventShape(o, "opportunity", "deadline"))
      .filter(Boolean);

    const manualEvents = calendarEvents.map((e) => ({
      ...e.toObject ? e.toObject() : e,
      __source: "calendar",
    }));

    const allEvents = [...manualEvents, ...assignmentEvents, ...opportunityEvents];
    res.status(200).json(allEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};