import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDwhyyFNV6ud9puMCTJuFFqfQRybb5e3yk",
  authDomain: "dripyard-bdfea.firebaseapp.com",
  projectId: "dripyard-bdfea",
  storageBucket: "dripyard-bdfea.appspot.com",
  messagingSenderId: "114298823031739516117",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
