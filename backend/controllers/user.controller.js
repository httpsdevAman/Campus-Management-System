import User from "../models/user.js";

/**
 * GET /api/users/count
 * Admin only. Returns total count of registered users.
 */
export const getUsersCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/users?role=student (optional)
 * Admin only. Returns all users, or filtered by role when role is provided.
 * Excludes password.
 */
export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = {};
    if (role) {
      const allowedRoles = ["student", "faculty", "authority", "admin"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      filter.role = role;
    }

    const users = await User.find(filter)
      .select("name instituteEmail role department studentId employeeId")
      .sort({ role: 1, name: 1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
