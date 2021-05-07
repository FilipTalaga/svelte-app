import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { derived, Readable } from 'svelte/store';
import { user } from '../stores/auth';
import { firestore } from './firebase';
import type firebase from 'firebase';

export const withUser = <T>(request: (user: firebase.User) => Observable<T>) =>
    derived<typeof user, T>(user, ($user, set) => {
        $user && request($user).subscribe(res => set(res));
    });

export const get = <T>(path: string): Readable<T> =>
    withUser<T>(user =>
        from(firestore.doc(path.replace(/:user/, user.email as string)).get()).pipe(
            map(val => val.data() as T)
        )
    );
