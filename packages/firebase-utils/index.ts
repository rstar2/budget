// Import the functionalities you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs,
    doc,
    addDoc,
    setDoc,
    deleteDoc,
    onSnapshot,
    Firestore,
    CollectionReference,
    Query,
    QuerySnapshot,
    Unsubscribe,
    WithFieldValue,
    DocumentData,
    Timestamp,
    QueryDocumentSnapshot,
} from "firebase/firestore";
import {
    getAuth,
    onAuthStateChanged,
    signOut,
    signInWithPopup,
    signInWithCredential,
    Auth,
    User,
    NextFn,
    GoogleAuthProvider,
    FacebookAuthProvider,
    EmailAuthProvider,
    getIdToken,
} from "firebase/auth";

export type FirebaseConfig = {
    apiKey: string;
    authDomain: string;
    projectId: string;
    messagingSenderId: string;
    appId: string;
};

export type AuthPopupProvider = "google" | "facebook";

class Firebase {
    private readonly auth: Auth;
    private readonly db: Firestore;

    private readonly authGoogleProvider: GoogleAuthProvider;
    private readonly authFacebookProvider: FacebookAuthProvider;

    constructor(firebaseConfig: FirebaseConfig) {
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);

        this.auth = getAuth(app);
        this.db = getFirestore(app);

        this.authGoogleProvider = new GoogleAuthProvider();
        // this will work and the returned Google access_token will be able to access Calendar API,
        // BUT the problem is that it's very short lived, so
        // this.authGoogleProvider.addScope(
        //   "https://www.googleapis.com/auth/calendar"
        // );

        this.authFacebookProvider = new FacebookAuthProvider();
        // this.authFacebookProvider.addScope("user_birthday");
        // this.authFacebookProvider.setCustomParameters({
        //   display: "popup",
        // });
    }

    // ---------- Auth ------------

    onAuthStateChanged(onNext: NextFn<User | null | false>): Unsubscribe {
        // return onAuthStateChanged(this.auth, onNext);

        return onAuthStateChanged(this.auth, (user) => {
            if (!user) return onNext(null);

            // force to refresh - e.g will call really Firebase service
            getIdToken(user, true)
                .then(() => {
                    console.log("???", "authorized");
                    onNext(user);
                })
                .catch((error) => {
                    console.log("???", "NOT authorized:", error.message);
                    onNext(false);
                });
        });
    }

    async signInWithPopup(provider: AuthPopupProvider = "google"): Promise<void> {
        // just try to sign-in - no matter the result is Promise<UserCredential>
        await signInWithPopup(
            this.auth,
            provider === "google" ? this.authGoogleProvider : this.authFacebookProvider,
        );
        //   .then((result) => {
        //     // This gives you a Google Access Token. You can use it to access the Google API.
        //     const credential = GoogleAuthProvider.credentialFromResult(result)!;
        //     const accessToken = credential.accessToken;
        //     // The signed-in user info.
        //     const user = result.user;

        //     console.log(`Logged user: ${JSON.stringify(user)} , token: ${accessToken}`);

        //     fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
        //       method: "GET",
        //       headers: {
        //         Authorization: `Bearer ${accessToken}`,
        //       },
        //     })
        //       .then((response) => response.json())
        //       .then((data) => console.log("???", data))
        //       .catch((error) => console.error(error));
        //   })
        //   .catch((error) => {
        //     // Handle Errors here.
        //     // const errorCode = error.code;
        //     // const errorMessage = error.message;
        //     // // The email of the user's account used.
        //     // const email = error.customData.email;
        //     // // The AuthCredential type that was used.
        //     // const credential = GoogleAuthProvider.credentialFromError(error);
        //     // ...

        //     throw error;
        //   });
    }

    async signInWithCredential({
        email,
        password,
    }: {
        email: string;
        password: string;
    }): Promise<void> {
        await signInWithCredential(this.auth, EmailAuthProvider.credential(email, password));
    }

    async signOut(): Promise<void> {
        return signOut(this.auth);
    }

    getCurrentUser(): User | undefined {
        return this.auth.currentUser ?? undefined;
    }

    /**
     * Allows to auth into Firebase if user is successfully authorized int Google
     * Only one of the tokens - ID or access has to be valid.
     */
    setGoogleCredential(idToken?: string, accessToken?: string): void {
        const credential = GoogleAuthProvider.credential(idToken, accessToken);
        signInWithCredential(this.auth, credential);
    }

    // ---------- Firestore ------------

    collection(nameCol: string): CollectionReference {
        return collection(this.db, nameCol);
    }

    async getDocs(query: Query): Promise<QuerySnapshot> {
        return getDocs(query);
    }

    async addDoc<AppModelType, DbModelType extends DocumentData>(
        collectionRef: CollectionReference<AppModelType, DbModelType>,
        data: WithFieldValue<AppModelType>,
    ) {
        return addDoc(collectionRef, data);
    }

    async deleteDoc(collectionRef: CollectionReference, docId: string) {
        const docRef = doc(collectionRef, docId);
        return deleteDoc(docRef);
    }

    async updateDoc<AppModelType, DbModelType extends DocumentData>(
        collectionRef: CollectionReference<AppModelType, DbModelType>,
        docId: string,
        data: WithFieldValue<AppModelType>,
    ) {
        const docRef = doc(collectionRef, docId);
        return setDoc(docRef, data);
    }

    onSnapshot(query: Query, onNext: (snapshot: QuerySnapshot) => void): Unsubscribe {
        return onSnapshot(query, onNext);
    }
}

export default Firebase;

// utilities

export type Doc = Readonly<{
    id: string;
    [key: string]: unknown;
}>;

/**
 * Parse a document
 */
export const parseDoc = (doc: QueryDocumentSnapshot): Doc => {
    return { id: doc.id, ...toJS(doc.data()) };
};

/**
 * Parse any documents
 */
export const parseDocs = (snapshot: QuerySnapshot): Doc[] => {
    const docs: Doc[] = [];
    snapshot.forEach((doc) => docs.push(parseDoc(doc)));
    return docs;
};

/**
 * Convert "Firestore" types to plain JS types (like Timestamp to Date)
 */
const toJS = (data: DocumentData) => {
    return Object.keys(data).reduce((res, key) => {
        const value = data[key];
        res[key] = value instanceof Timestamp ? value.toDate() : value;
        return res;
    }, {} as DocumentData);
};
