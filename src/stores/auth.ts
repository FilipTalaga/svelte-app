import { derived, readable } from 'svelte/store';
import { fireauth } from '../firebase';
import type firebase from 'firebase';

export const user = readable<firebase.User | null>(undefined, set =>
    fireauth.onAuthStateChanged(set)
);

export const authReady = derived(user, $user => $user !== undefined);

export const login = (email: string, password: string) =>
    fireauth.signInWithEmailAndPassword(email, password);

export const logout = () => fireauth.signOut();
