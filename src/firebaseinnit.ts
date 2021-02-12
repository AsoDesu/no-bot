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

var firebaseConfigDev = {
    apiKey: "AIzaSyA14FPA54Joh7DLD5IzP-otqzHPV9Arxqo",
    authDomain: "no-clan-dev.firebaseapp.com",
    databaseURL: "https://no-clan-dev.firebaseio.com",
    projectId: "no-clan-dev",
    storageBucket: "no-clan-dev.appspot.com",
    messagingSenderId: "672258843290",
    appId: "1:672258843290:web:d83ecf59b5203dd28ab523",
    measurementId: "G-H09GE0E4M4"
}

if (process.env.DEV == '1') {
    firebase.initializeApp(firebaseConfigDev);
} else {
    firebase.initializeApp(firebaseConfig);
}

firebase.auth().signInWithEmailAndPassword('no-bot@asodev.tk', process.env.PASSWORD)