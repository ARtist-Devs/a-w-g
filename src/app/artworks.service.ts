import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, increment, getDoc, setDoc, DocumentData } from 'firebase/firestore';
import {
  EventEmitter,
  Injectable,
  OnInit,
  Output,
  Signal,
  WritableSignal,
  computed,
  effect,
  signal,
} from '@angular/core';
import { Artwork } from 'projects/three/src/lib/artwork';

/**
 * No three.js but only the database and app state.
 */
@Injectable({
  providedIn: 'root'
})
export class ArtworksService {
  private firebaseConfig = {
    apiKey: "AIzaSyAZtsaXYC5VSw1qssHszoLzOjgtDEM_kIc",
    authDomain: "art-3d-exhibit.firebaseapp.com",
    projectId: "art-3d-exhibit",
    storageBucket: "art-3d-exhibit.appspot.com",
    messagingSenderId: "652122924025",
    appId: "1:652122924025:web:8753742d36068d00149328"
  };
  app = initializeApp(this.firebaseConfig);
  db = getFirestore(this.app);
  private artworks = signal([
    {
      id: 0,
      title: "Self Portrait",
      audio: "assets/audio/1.mp3",
      date: "1887",
      description:
        "This self-portrait was one of about 32 produced over a 10-year period, and these were an important part of his work as a painter",
      height: 65,
      textureUrl:
        "assets/artworks/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project.jpg",
      votes: 0,
      width: 54,
      wiki: "https://wikipedia.org/wiki/Van_Gogh_self-portrait_(1889)",
    },
    {
      id: 1,
      title: "The Potato Eaters",
      audio: "assets/audio/2.mp3",
      date: "1887",
      description: "This is the second artwork",
      height: 82,
      textureUrl: "assets/artworks/potato-eaters.jpg",
      votes: 0,
      width: 114,
      wiki: "https://wikipedia.org/wiki/The_Potato_Eaters",
    },
    {
      id: 2,
      title: "The Bedroom",
      audio: "assets/audio/3.mp3",
      date: "1887",
      description: "This is the third artwork",
      height: 72.4,
      textureUrl: "assets/artworks/bedroom.jpg",
      votes: 0,
      width: 91.3,
      wiki: "https://wikipedia.org/wiki/Bedroom_in_Arles",
    },
    {
      id: 3,
      title: "Sunflowers",
      audio: "assets/audio/1.mp3",
      date: "1887",
      description:
        "This is one of five versions of Sunflowers on display in museums and galleries across the world. Van Gogh made the paintings to decorate his house in Arles in readiness for a visit from his friend and fellow artist, Paul Gauguin.'The sunflower is mine', Van Gogh once declared, and it is clear that the flower had various meanings for him. The different stages in the sunflower's life cycle shown here, from young bud through to maturity and eventual decay, follow in the vanitas tradition of Dutch seventeenth-century flower paintings, which emphasise the transient nature of human actions. The sunflowers were perhaps also intended to be a symbol of friendship and a celebration of the beauty and vitality of nature.",
      height: 95,
      textureUrl: "assets/artworks/sunflowers.jpg",
      votes: 0,
      width: 73,
      download:
        "https://commons.wikimedia.org/wiki/File:Vincent_Willem_van_Gogh_127.jpg",
      wiki: "https://wikipedia.org/wiki/Sunflowers_(Van_Gogh_series)",
    },
    {
      id: 4,
      title: "Irises",
      audio: "assets/audio/1.mp3",
      date: "1890",
      description:
        "Fifth: Van Gogh painted this still life in the psychiatric hospital in Saint-Remy. For him, the painting was mainly a study in colour. He set out to achieve a powerful colour contrast. By placing the purple flowers against a yellow background, he made the decorative forms stand out even more strongly. The irises were originally purple. But as the red pigment has faded, they have turned blue. Van Gogh made two paintings of this bouquet. In the other still life, he contrasted purple and pink with green.",
      height: 93,
      textureUrl: "assets/artworks/irises.jpg",
      votes: 0,
      width: 74,
      wiki: "https://wikipedia.org/wiki/Irises_(painting)",
    },
  ]);

  upvoted: number[] = [];
  artworksLength: number = this.artworks.length;

  constructor() { }

  getArtworks(): any {
    let dbArtworks = collection(this.db, 'artworks');
    let artList: DocumentData[] = []
    getDocs(dbArtworks)
      .then((artSnaps) => {
        artList = artSnaps.docs.map(doc => doc.data());
        let artMap = new Map<number, DocumentData>();
        for (let artData of artList) {
          artMap.set(artData['id'], artData)
        }
        this.artworks.mutate(value => {
          for (let i = 0; i < value.length; i++) {
            value[i].votes = artList[i]['vote_count'];
          }
        })
      });
    return this.artworks();
  }

  upvoteArtwork(i: number) {
    if (this.upvoted.indexOf(i) === -1) {
      let docDB = doc(this.db, "artworks", i.toString())
      getDoc(docDB)
        .then((docSnap) => {
          if (docSnap.exists()) {
            console.log("Upvoting", docSnap.data())
            this.artworks.mutate((artworks: Artwork[]): void => {
              artworks[i].votes = docSnap.data()['vote_count'] + 1;
            });
            console.log('Mutated', i, this.artworks()[i].votes);
          } else {
            console.log('No such document!');
          }
        })
        .catch((error) => {
          console.error('Error getting document:', error);
        });
      setDoc(docDB, { vote_count: increment(1) }, { merge: true })
        .then(() => {
          console.log('Incremented vote count field by 1.');
        })
        .catch((error) => {
          console.error('Error incrementing count field:', error);
        });
      this.upvoted.push(i);
    }
    else {
      console.log('Upvoted already!');
    }
  }
}
