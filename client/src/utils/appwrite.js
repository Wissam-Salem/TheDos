// appwrite.js
import { Client, Account } from "appwrite";

let client = new Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
    .setProject("671cdefd003a8324933b"); // Replace with your project ID

let account = new Account(client);

let signUp = async (email, password, name) => {
    try {
        let response = await account.create("unique()", email, password, name);
        console.log("User created:", response);
    } catch (error) {
        console.error("Error in sign-up:", error.message);
    }
};

let login = async (email, password) => {
    try {
        let response = await account.createEmailPasswordSession(email, password);
        window.location.pathname = "/home"
        console.log("Logged in:", response);
    } catch (error) {
        console.error("Error in login:", error.message);
    }
};

let logout = async () => {
    try {
        await account.deleteSession("current");
        console.log("User logged out");
        window.localStorage.removeItem("cookieFallback");
        window.location.pathname = "/"
    } catch (error) {
        console.error("Error in logout:", error.message);
    }
};

let getUserSession = async () => {
    try {
        const user = await account.get();
        console.log("User session:", user);
        return user;
    } catch (error) {
        console.log("No active session");
    }
};


export { client, account, signUp, login, logout, getUserSession };
