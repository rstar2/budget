/* eslint-disable no-console */
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createStandaloneToast } from "@chakra-ui/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { FirebaseError } from "firebase/app";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            networkMode: "always",
        },
        mutations: {
            networkMode: "always",
        },
    },
    queryCache: new QueryCache({
        // onSuccess(data, query) {},
        // onError(error, query) {},

        // one combined callback
        onSettled(_data, error, query) {
            const { meta } = query;

            if (error) console.error("Failed query: ", error);
            showNotification(meta as CacheMeta, error);
            // if (queryKey[0] === "admin")

            // show success notification - only for mutations with meta key
            if (meta) showNotification(meta as CacheMeta, error);
        },
    }),

    mutationCache: new MutationCache({
        // onSuccess(data, variables, context, mutation) {},
        // onError(error, variables, context, mutation) {},

        // one combined callback
        onSettled(_data, error, _variables, _context, mutation) {
            if (error) console.error("Failed mutation: ", error);

            const { meta } = mutation;

            // show success notification - only for mutations with meta key
            if (meta) showNotification(meta as CacheMeta, error);
        },
    }),
});

type CacheMeta = { action: string | string[] };

const { toast } = createStandaloneToast();
const showNotification = (meta: CacheMeta, error?: Error | null) => {
    let { action } = meta;
    if (!Array.isArray(action)) action = [action];

    let description;
    if (error) {
        if (error instanceof FirebaseError) {
            const { code } = error;
            switch (code) {
                case "auth/user-not-found":
                    description = "Invalid username";
                    break;
                case "auth/wrong-password":
                    description = "Invalid password";
                    break;
            }
        }
        if (!description) description = "Failed action";
    }

    toast({
        title: action.join(" "),
        description,
        status: error ? "error" : "success",
        duration: 3000,
        isClosable: true,
    });
};

/**
 * The cache react-query provider component.
 * Any component that will use any of the cache hooks must be wrapped in such a provider component.
 */
export const CacheProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
    <QueryClientProvider client={queryClient}>
        <>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </>
    </QueryClientProvider>
);
