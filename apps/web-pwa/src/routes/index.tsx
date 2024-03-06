import React from "react";
import {
    RouterProvider as RouterProvider_,
    createRoute,
    createRootRoute,
    createRouter,
    redirect,
    Outlet,
    Navigate,
} from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import HomeRoot from "./HomeRoot";
import Home from "./Home";
import Splash from "./Splash";
import Login from "./Login";
import { getAuthUser } from "../cache/auth";
import { AuthUser } from "../types";

// Vite (and Webpack) process the "process.env.NODE_ENV"
// by actually replacing it completely with value of the real NODE_ENV env-variable,
// which is otherwise only accessible in NodeJS (server) world

// This is the recommended way to load the "@tanstack/router-devtools" only in production,
// Note this is much better in contrast to "react-query" where its "@tanstack/react-query-devtools"
// are loaded always just in production are not used/shown in the UI
const TanStackRouterDevtools =
    process.env.NODE_ENV === "production"
        ? () => null // Render nothing in production
        : // Lazy load in development
          () => null;
//   React.lazy(
//       import("@tanstack/router-devtools").then((res) => ({
//           default: res.TanStackRouterDevtools,
//           // For Embedded Mode
//           // default: res.TanStackRouterDevtoolsPanel
//       })),
//   );

const rootRoute = createRootRoute({
    component: () => (
        <>
            <Outlet />
            <TanStackRouterDevtools />
        </>
    ),
    // if needed to overwrite the Router.defaultPendingComponent component
    //   pendingComponent: () => <div>Loading...</div>,
});

const loginRoute = createRoute({
    path: "/login",
    getParentRoute: () => rootRoute,
    component: Login,
    beforeLoad: () => {
        const authUser = getAuthUser();
        if (authUser === AuthUser.Unknown) {
            throw redirect({ to: "/splash" });
        } else if (authUser === AuthUser.Auth) {
            throw redirect({ to: "/home" });
        }
    },
});
const splashRoute = createRoute({
    path: "/splash",
    getParentRoute: () => rootRoute,
    component: Splash,
    beforeLoad: () => {
        if (getAuthUser() === AuthUser.Auth) {
            throw redirect({ to: "/home" });
        }
    },
});

const homeRootRoute = createRoute({
    path: "/home",
    getParentRoute: () => rootRoute,
    component: HomeRoot,
    beforeLoad: () => {
        const authUser = getAuthUser();
        if (authUser === AuthUser.Unknown) {
            throw redirect({ to: "/splash" });
        } else if (authUser === AuthUser.NotAuth) {
            throw redirect({ to: "/login" });
        }
    },
});

const homeRoute = createRoute({
    path: "/",
    getParentRoute: () => homeRootRoute,
    component: Home,
});

const routeTree = rootRoute.addChildren([
    loginRoute,
    splashRoute,
    homeRootRoute.addChildren([homeRoute]),
]);
const router = createRouter({
    routeTree,
    // this is actually the React.Suspense.fallback component
    defaultPendingComponent: Splash,
    defaultNotFoundComponent: () => <Navigate to="/splash" />,
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

/**
 * The router provider component.
 */
export const RouterProvider: React.FC = () => <RouterProvider_ router={router}></RouterProvider_>;
