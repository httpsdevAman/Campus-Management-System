import Opportunity from "../models/opportunity.js";

// Faculty creates opportunity
export const createOpportunity = async (req, res) => {
    try {
        const { title, description, type, deadline } = req.body;

        const opportunity = await Opportunity.create({
            title,
            description,
            type,
            deadline,
            postedBy: req.user.id
        });

        res.status(201).json(opportunity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all opportunities (students + faculty)
export const getAllOpportunities = async (req, res) => {
    try {
        const opportunities = await Opportunity.find().populate("postedBy", "name");
        res.json(opportunities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Faculty update own opportunity
export const updateOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity)
            return res.status(404).json({ message: "Opportunity not found" });

        if (opportunity.postedBy.toString() !== req.user.id)
            return res.status(403).json({ message: "Not allowed" });

        const updated = await Opportunity.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Faculty delete own opportunity
export const deleteOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity)
            return res.status(404).json({ message: "Opportunity not found" });

        if (opportunity.postedBy.toString() !== req.user.id)
            return res.status(403).json({ message: "Not allowed" });

        await opportunity.deleteOne();

        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};