import { Router } from "express";

import authenticate from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

import ROLES from "../constants/roles.js";

import {
    profile,
    getUsers,
    updateRole,
    assignLead,
    teamMembers,
} from "../controllers/user.controller.js";

import {
    userIdValidator,
    updateRoleValidator,
    assignTeamLeadValidator,
    validate,
} from "../validators/user.validator.js";

const router = Router();

router.use(authenticate);

/*  Profile  */
router.get("/profile", profile);

/*  Team Lead  */
router.get("/team-members", authorize(ROLES.TEAM_LEAD), teamMembers);

/*.  Manager.  */
router.get("/", authorize(ROLES.MANAGER), getUsers);
router.patch("/:id/role", authorize(ROLES.MANAGER), updateRoleValidator, validate, updateRole);
router.patch("/:id/team-lead", authorize(ROLES.MANAGER), assignTeamLeadValidator, validate, assignLead);

export default router;