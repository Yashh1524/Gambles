import { Router } from "express";
import {
    googleOAuthController,
    googleOAuthCallbackController,
    githubOAuthController,
    githubOAuthCallbackController,
} from "../controllers/oauth.controller.js";

const oauthRoutes = Router();

oauthRoutes.get("/google", googleOAuthController);
oauthRoutes.get("/google/callback", googleOAuthCallbackController);

oauthRoutes.get("/github", githubOAuthController);
oauthRoutes.get("/github/callback", githubOAuthCallbackController);

export default oauthRoutes;
