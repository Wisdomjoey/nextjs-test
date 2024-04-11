/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */

export const publicRoutes: string[] = [
	"/",
	"/auth/new-verification",
	"/auth/new-password",
];

/**
 * An array of routes that used for authentication
 * These routes redirects already logged in users
 * @type {string[]}
 */

export const authRoutes: string[] = [
	"/auth/login",
	"/auth/register",
	"/auth/error",
	"/auth/reset"
];

/**
 * The prefix for API authentication routes
 * These routes are only used for authentication purposes only
 * @type {string}
 */

export const apiAuthPrefix: string = "/api/auth";

/**
 * The default redirect after logging in
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT: string = "/settings";
