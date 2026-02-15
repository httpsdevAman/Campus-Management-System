import Grievance from "../models/grievance.js";

// CREATE GRIEVANCE (Student + Faculty)

export const createGrievance = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            priority,
            location,
            isAnonymous
        } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({
                message: "Title, description and category are required"
            });
        }

        const grievance = await Grievance.create({
            title,
            description,
            category,
            priority,
            location,
            isAnonymous,
            submittedBy: req.user._id
        });

        const populated = await Grievance.findById(grievance._id)
            .populate("submittedBy", "name instituteEmail role");

        res.status(201).json({
            message: `Grievance submitted successfully. Your Grievance ID is ${grievance._id}`,
            grievance: populated
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET MY GRIEVANCES (Student + Faculty)

export const getMyGrievances = async (req, res) => {
    try {
        
        const grievances = await Grievance.find({
            submittedBy: req.user._id
        })
            .populate("assignedTo", "name instituteEmail role employeeId")
            .sort({ createdAt: -1 });

        res.json(grievances);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



/*
    GET ALL GRIEVANCES
    - Admin: all grievances (with optional status/priority/category filters)
    - Authority: only grievances assigned to them
*/
export const getAllGrievances = async (req, res) => {
    try {

        const { status, priority, category } = req.query;

        let filter = {};

        if (req.user.role === "authority") {
            filter.assignedTo = req.user._id;
        }

        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (category) filter.category = category;

        const grievances = await Grievance.find(filter)
            .populate("submittedBy", "name instituteEmail role")
            .populate("assignedTo", "name instituteEmail role employeeId")
            .populate("remarks.addedBy", "name role")
            .sort({ createdAt: -1 });

        res.json(grievances);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



/*
   GET SINGLE GRIEVANCE
   - Student: only if they created it
   - Authority/Admin: any grievance
 */

export const getGrievanceById = async (req, res) => {
    try {

        const grievance = await Grievance.findById(req.params.id)
            .populate("submittedBy", "name instituteEmail role")
            .populate("assignedTo", "name instituteEmail role employeeId")
            .populate("remarks.addedBy", "name role");

        if (!grievance) {
            return res.status(404).json({ message: "Grievance not found" });
        }

        // If student/faculty, only if they created it
        if (
            (req.user.role === "student" || req.user.role === "faculty") &&
            grievance.submittedBy?._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        // If authority, only if the grievance is assigned to them
        if (req.user.role === "authority") {
            const assignedToId = grievance.assignedTo?._id?.toString() || grievance.assignedTo?.toString();
            if (assignedToId !== req.user._id.toString()) {
                return res.status(403).json({
                    message: "Access denied. This grievance is not assigned to you."
                });
            }
        }

        res.json(grievance);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// UPDATE STATUS (Authority + Admin)

export const updateGrievanceStatus = async (req, res) => {
    try {

        const { status, remark } = req.body;

        if (!status || !remark) {
            return res.status(400).json({
                message: "Status and remark are required"
            });
        }
        
        const allowedStatuses = [
            "Submitted",                                   
            "Under Review",
            "In Progress",
            "Resolved",
            "Closed"
        ];
        
        if (!allowedStatuses.includes(status)) {
            console.log("Error")
            return res.status(400).json({
                message: "Invalid status value"
            });
        }

        const grievance = await Grievance.findById(req.params.id);

        if (!grievance) {
            return res.status(404).json({
                message: "Grievance not found"
            });
        }

        grievance.status = status;

        grievance.remarks.push({
            remark,
            addedBy: req.user._id
        });

        await grievance.save();

        res.json({
            message: "Status updated successfully",
            grievance
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ASSIGN GRIEVANCE (Admin only)
export const assignGrievance = async (req, res) => {
    try {
        const { id } = req.params;
        const { assignedTo } = req.body;

        const grievance = await Grievance.findById(id);
        if (!grievance) {
            return res.status(404).json({ message: "Grievance not found" });
        }

        grievance.assignedTo = assignedTo || null;
        await grievance.save();

        const populated = await Grievance.findById(id)
            .populate("submittedBy", "name instituteEmail role")
            .populate("assignedTo", "name instituteEmail role employeeId")
            .populate("remarks.addedBy", "name role");

        res.json({
            message: "Assignment updated successfully",
            grievance: populated
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE GRIEVANCE (Admin Only - Optional)

export const deleteGrievance = async (req, res) => {
    try {

        const grievance = await Grievance.findById(req.params.id);

        if (!grievance) {
            return res.status(404).json({
                message: "Grievance not found"
            });
        }

        await grievance.deleteOne();

        res.json({
            message: "Grievance deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};