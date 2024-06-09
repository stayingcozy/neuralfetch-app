import { getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore, collection } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  YOUR_FIREBASE_CONFIG
};


if (!getApps.length) {
    const app = initializeApp(firebaseConfig);
} 

export const auth = getAuth();
export const googleAuthProvider = new GoogleAuthProvider();
export const db = getFirestore();


// Storage exports
export const storage = getStorage();

/// Helper functions
/**`
 * Gets a users/{uid} document with username
 * @param {string} username
 */
export async function getUserWithUsername(username) {

  // gets user collection
  const usersRef = collection('users');
  // query to get user name of username input
  const query = usersRef.where('username','==', username).limit(1);
  // make query - get first doc
  const userDoc = (await query.get()).docs[0];
  return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };
}