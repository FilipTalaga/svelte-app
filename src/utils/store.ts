import { Observable, from, fromEventPattern } from 'rxjs';
import { map } from 'rxjs/operators';
import { derived, Readable } from 'svelte/store';
import { user } from '../stores/auth';
import { firestore } from './firebase';
import type firebase from 'firebase';

type Query =
    | firebase.firestore.CollectionReference<firebase.firestore.DocumentData>
    | firebase.firestore.Query<firebase.firestore.DocumentData>;

type QuerySnap = firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;

export const withUser = <T>(request: (user: firebase.User) => Observable<T>) =>
    derived<typeof user, T>(user, ($user, set) => {
        $user && request($user).subscribe(res => set(res));
    });

export const getDoc = <T>(path: string): Readable<T> =>
    withUser<T>(user =>
        from(firestore.doc(path.replace(/:user/, user.email as string)).get()).pipe(
            map(val => val.data() as T)
        )
    );

export const addToCollection =
    <T>(path: string) =>
    (id: string, data: T) =>
        new Observable(observer => {
            user.subscribe(user => {
                if (!user) {
                    return;
                }

                firestore
                    .collection(path.replace(/:user/, user.email as string))
                    .doc(id)
                    .set(data)
                    .then(res => {
                        observer.next(res);
                        observer.complete();
                    });
            });
        });

export const getCollection = <T>(path: string, query = (query: Query) => query): Readable<T[]> =>
    withUser<T[]>(user =>
        fromEventPattern<QuerySnap>(handler =>
            query(firestore.collection(path.replace(/:user/, user.email as string))).onSnapshot(
                handler
            )
        ).pipe(map(val => val.docs.map(item => item.data() as T)))
    );
