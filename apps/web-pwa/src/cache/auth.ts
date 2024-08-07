import { useQuery, useMutation } from "@tanstack/react-query";

import firebase from "../firebase";
import { queryClient } from "./index";
import { AuthUser } from "../types";

firebase.onAuthStateChanged((user) => {
    //console.warn("??? onAuthStateChanged", user);
    queryClient.setQueryData<AuthUser>(
        ["authUser"],
        user ? AuthUser.Auth : user === false ? AuthUser.Unknown : AuthUser.NotAuth,
    );
});

/**
 * Return if there's authorized user
 */
export function getAuthUser() {
    return queryClient.getQueryData<AuthUser>(["authUser"]) || AuthUser.Unknown;
}

/**
 * Query for the auth state.
 */
export function useAuthUser() {
    const { data } = useQuery({
        queryKey: ["authUser"],
        queryFn: () => Promise.reject(new Error("Not used")),
        enabled: false,
        staleTime: Infinity,
        initialData: AuthUser.Unknown,
    });
    return data;
}

/**
 * Mutation to login with email-&-password.
 * Could use directly the firebase.signInWithPassword(), but thus all is wrapped in one place,
 * and can reuse the mutations API to shown notifications and etc...
 */
export function useAuthLoginWithEmailAndPassword() {
    const mutation = useMutation({
        mutationFn: async (credential: { email: string; password: string }) =>
            firebase.signInWithCredential(credential),
        // meta is used for success/failed notification on mutation result
        meta: {
            action: "Login",
        },
    });

    // if needed can return the whole mutation, like loading, and error state
    return mutation.mutateAsync;
}

/**
 * Mutation to logout.
 * Could use directly the firebase.signOut(), but thus all is wrapped hin one place,
 * and can reuse the mutations API
 */
export function useAuthLogout() {
    const mutation = useMutation({
        mutationFn: async () => firebase.signOut(),
        // meta is used for success/failed notification on mutation result
        meta: {
            action: "Logout",
        },
    });

    // if needed can return the whole mutation, like loading, and error state
    return mutation.mutateAsync;
}
