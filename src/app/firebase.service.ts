import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  // firestore: Firestore = inject(Firestore);
  // artworks$: Observable<any[]>;

  constructor() {
    // const aCollection = collection(this.firestore, 'items');
    // this.artworks$ = collectionData(aCollection);
    // console.log('Firebase ', this.artworks$);
  }
}
