import { derived, readable } from 'svelte/store';
import { fireauth } from '../utils/firebase';
import type firebase from 'firebase';
import { from } from 'rxjs';

type AuthState = firebase.User | null | undefined;

const auth = readable<AuthState>(undefined, set => fireauth.onAuthStateChanged(set));

export const user = derived(auth, $auth => $auth || null);

export const authReady = derived(auth, $auth => $auth !== undefined);

export const login = (email: string, password: string) =>
    from(fireauth.signInWithEmailAndPassword(email, password));

export const logout = () => from(fireauth.signOut());
