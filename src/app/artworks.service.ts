import {
  Injectable, EventEmitter,
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
  private artworks = [
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
      textureUrl: "src/assets/artworks/ireses.jpg",
      votes: 0,
      width: 74,
      wiki: "https://wikipedia.org/wiki/Irises_(painting)",
    },
  ];
  artworksLength = this.artworks.length;

  public selectedArtwork: WritableSignal<Artwork> = signal(this.artworks[0]);

  constructor() { }

  getArtworks (): Artwork[] {
    return this.artworks;
  }

  // TODO: think about giving an index instead of string or index.
  changeSelected (i: number | string) {
    let ind = this.selectedArtwork().id;
    if (i === "next")
    {
      i = ind < (this.artworksLength - 1) ? (ind + 1) : 0;
    } else if (i === "prev")
    {
      i = (ind === 0) ? this.artworksLength - 1 : ind - 1;
    }
    // @ts-ignore
    this.selectedArtwork.set(this.artworks[i]);

  }

  // TODO: firebase increment
  upvoteSelected () {
    this.selectedArtwork.mutate((artwork: Artwork) => {
      artwork.votes += 1;
    });
    console.log(this.selectedArtwork());
  }
}
