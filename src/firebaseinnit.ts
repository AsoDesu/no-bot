import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

var firebaseConfig = {
    apiKey: "AIzaSyCWh_TPWmY1VKEksMFWPp2QkyDVja12caE",
    authDomain: "no-clan.firebaseapp.com",
    databaseURL: "https://no-clan.firebaseio.com",
    projectId: "no-clan",
    storageBucket: "no-clan.appspot.com",
    messagingSenderId: "635016930853",
    appId: "1:635016930853:web:90ad09cf3932db7ef341cc",
    measurementId: "G-1XFL79QRFB"
}

firebase.initializeApp(firebaseConfig);

firebase.auth().signInWithEmailAndPassword('no-bot@asodev.tk', process.env.PASSWORD)