import Application from "../models/application.js";
import Opportunity from "../models/opportunity.js";

// Student applies
export const applyToOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity)
      return res.status(404).json({ message: "Opportunity not found" });

    const application = await Application.create({
      opportunity: req.params.id,
      student: req.user.id,
      statementOfPurpose: req.body.statementOfPurpose
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Faculty views all applicants; Student views only their own application
export const getApplicants = async (req, res) => {
  try {
    const filter = { opportunity: req.params.id };
    if (req.user.role === "student") {
      filter.student = req.user._id;
    }
    const applications = await Application.find(filter)
      .populate("student", "name instituteEmail");

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Faculty accept / reject
export const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application)
      return res.status(404).json({ message: "Application not found" });

    application.status = req.body.status;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};