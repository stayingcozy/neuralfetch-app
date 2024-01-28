import { useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { UserAuth } from './AuthCheck';


export default function CaddyDataFetch({ setHttpsSrcURL }) {

    // Get user information
    const { user } = UserAuth();

    // get caddy server IP
    var serverIP = ""
    async function fetchCaddyServer() {
        const docRef = doc(db, "caddyServers", "server0");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            var docData = docSnap.data();
            serverIP = docData["ip"];
        }
        else {
            console.log("No caddyServers document");
            serverIP = "" // "45.33.96.171"
        }
    }
    fetchCaddyServer()


    useEffect(() => {
        async function fetchServerData() {

        // const uid = auth.currentUser.uid;
        const uid = user.uid;
        // console.log("uid: " + uid);
        if (uid !== undefined) {
            const q = query(collection(db, "mediaServers"), where("uid", "==", uid));

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // const serverData = doc.data();

                setHttpsSrcURL(`https://${serverIP}.nip.io/${uid}`); 
                // console.log("URL to be played:")
                // console.log(`https://${serverIP}.nip.io/${uid}`);
            });
        }

        }

        fetchServerData();
    }, [setHttpsSrcURL, user]);

    return <div></div>;
}
