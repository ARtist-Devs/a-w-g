import {
  Injectable, signal
} from '@angular/core';
import { environment } from 'src/environments/environment.development';
// import { Artwork } from 'projects/three/src/lib/artwork';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, increment, getDoc, setDoc, DocumentData } from 'firebase/firestore';
import { Artwork } from 'projects/three/src/lib/artwork';

/**
 * No three.js but only the database and app state.
 */
@Injectable({
  providedIn: 'platform'
})
export class ArtworksService {
  private artworks = signal([
    {
      id: 0,
      title: "Self Portrait",
      audio: "assets/audio/1.mp3",
      date: "1887",
      description:
        "This self-portrait was one of about 32 produced over a 10-year period, and these were an important part of his work as a painter; he painted himself because he often lacked the money to pay for models. Art historians are divided as to whether this painting is Van Gogh's final self-portrait or not. It is considered that it was painted in Arles following Van Gogh's admission to hospital after mutilating his ear. Van Gogh sent the picture to his younger brother, the art dealer Theo; an accompanying letter read: 'I hope you will notice that my facial expressions have become much calmer, although my eyes have the same insecure look as before, or so it appears to me.'",
      height: 65,
      textureUrl:
        "assets/artworks/selfportrait.webp",
      votes: 0,
      width: 54,
      wiki: "https://wikipedia.org/wiki/Van_Gogh_self-portrait_(1889)",
    },
    {
      id: 1,
      title: "Almond Blossom",
      audio: "assets/audio/2.mp3",
      date: "1890",
      description: "In mid-March 1888 van Gogh writes that the almond trees are coming into full flower, weather there is changeable, often windy with turbulent skies. Later on Theo wrote to his brother Vincent on January 31, 1890, to announce the birth of his son, Vincent Willem van Gogh. He was very close to his brother and he sought to symbolize new life in the flowers of the almond tree for the birth of baby Vincent.",
      height: 73.5,
      textureUrl: "assets/artworks/almond_blossom.webp",
      votes: 34,
      width: 92,
      wiki: "https://en.wikipedia.org/wiki/Almond_Blossoms",
    },
    {
      id: 2,
      title: "The Bedroom",
      audio: "assets/audio/3.mp3",
      date: "1887",
      description: "The painting depicts van Gogh's bedroom at 2, Place Lamartine in Arles, Bouches-du-Rhone, France, known as the Yellow House. The door to the right opened on to the upper floor and the staircase; the door to the left was that of the guest room he held prepared for Gauguin; the window in the front wall looked on to Place Lamartine and its public gardens. This room was not rectangular but trapezoid with an obtuse angle in the left hand corner of the front wall and an acute angle at the right.",
      height: 72.4,
      textureUrl: "assets/artworks/bedroom.webp",
      votes: 65,
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
      textureUrl: "assets/artworks/sunflowers.webp",
      votes: 72,
      width: 73,
      download:
        "https://en.wikipedia.org/wiki/File:Vincent_van_Gogh_-_Sunflowers_-_VGM_F458.jpg",
      wiki: "https://wikipedia.org/wiki/Sunflowers_(Van_Gogh_series)",
    },
    {
      id: 4,
      title: "Irises",
      audio: "assets/audio/1.mp3",
      date: "1889",
      description:
        "Van Gogh painted this still life in the psychiatric hospital in Saint-Remy. For him, the painting was mainly a study in color. He set out to achieve a powerful color contrast. By placing the purple flowers against a yellow background, he made the decorative forms stand out even more strongly. The irises were originally purple. But as the red pigment has faded, they have turned blue. Van Gogh made two paintings of this bouquet. In the other still life, he contrasted purple and pink with green.",
      height: 93,
      textureUrl: "assets/artworks/irises.webp",
      votes: 56,
      width: 74,
      wiki: "https://en.wikipedia.org/wiki/Vase_with_Irises_Against_a_Yellow_Background",
    },
  ]);
  config = environment;
  app = initializeApp(this.config);
  db = getFirestore(this.app);

  upvoted: number[] = [];
  artworksLength: number = this.artworks.length;
  dbArtworks = collection(this.db, 'artworks');

  constructor() {
    this.getArtworksFb();
  }

  getArtworks (): Artwork[] {
    return this.artworks();
  }

  getArtworksFb (): any {
    let artList: DocumentData[] = [];
    getDocs(this.dbArtworks)
      .then((artSnaps) => {
        // @ts-ignore
        this.artworks.update((artworks: Artwork[]) => {
          artworks.forEach((artwork: Artwork, i: number) => {
            artwork.votes = artSnaps.docs[i].data()['votes'];

          });
          return artworks;
        });
      });
  };

  upvoteArtwork (i: number) {
    if (this.upvoted.indexOf(i) === -1)
    {
      this.upvoted.push(i);
      //@ts-ignore
      this.artworks.update((artworks: any[]) => {
        artworks[i].votes = artworks[i].votes + 1;
      });
      this.updateUpvote(i);

    } else
    {
      console.log('Upvoted already!');
    }

    return this.artworks();
  }

  updateUpvote (i: number) {
    let docDB = doc(this.db, "artworks", i.toString());
    setDoc(docDB, { votes: increment(1) }, { merge: true })
      .then(() => {
        console.log('Incremented vote count field by 1.');
      })
      .catch((error) => {
        console.error('Error incrementing count field:', error);
      });
  }
};
