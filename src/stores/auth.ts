import { derived, readable } from 'svelte/store';
import { fireauth } from '../firebase';
import type firebase from 'firebase';

type AuthState = firebase.User | null | undefined;

const auth = readable<AuthState>(undefined, set => fireauth.onAuthStateChanged(set));

export const user = derived(auth, $auth => $auth || null);

export const authReady = derived(auth, $auth => $auth !== undefined);

export const login = (email: string, password: string) =>
    fireauth.signInWithEmailAndPassword(email, password);

export const logout = () => fireauth.signOut();
