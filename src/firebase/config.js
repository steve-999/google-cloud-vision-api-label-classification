import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';

  var firebaseConfig = {
    apiKey: "AIzaSyDJhHR9DE0mwxmMUdq-JrtSl3qAyv_oI4A",
    authDomain: "cloud-vision-api-test-290115.firebaseapp.com",
    databaseURL: "https://cloud-vision-api-test-290115.firebaseio.com",
    projectId: "cloud-vision-api-test-290115",
    storageBucket: "cloud-vision-api-test-290115.appspot.com",
    messagingSenderId: "226961517000",
    appId: "1:226961517000:web:2b7d6bc9770772a97478fd"
  };
  firebase.initializeApp(firebaseConfig);

  const firebaseStorage = firebase.storage();
  const firestoreDB = firebase.firestore();
  const timestamp = firebase.firestore.FieldValue.serverTimestamp;

  export { firebaseStorage, firestoreDB, timestamp };
