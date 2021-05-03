import firebase from 'firebase/app';
import config from '../configs/firebase.config';
import 'firebase/auth';
import 'firebase/firestore';

firebase.initializeApp(config);

export const fireauth = firebase.auth();

export const firestore = firebase.firestore();
