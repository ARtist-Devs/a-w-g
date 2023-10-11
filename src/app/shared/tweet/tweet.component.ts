import { Component, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'art-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss']
})
export class TweetComponent {
  // public tweetHref: string = 'https://twitter.com/intent/tweet?text=Checkout%20Angular%20WebXR%20Art%20Gallery!&hashtags=Angular,WebXR,AngularSignals&url=https://webxr.art&image=https://raw.githubusercontent.com/ARtist-Devs/a-w-g/main/src/assets/images/thumbnail.png';
  // onTweet (e: Event) {
  // }

  baseUrl: string = 'https://twitter.com/intent/tweet';
  hashtags: string = 'Angular,WebXR,AngularSignals';
  text: string = 'Checkout Angular WebXR Art Gallery!';
  imageUrl: string = 'https://github.com/ARtist-Devs/a-w-g/blob/main/src/assets/images/thumbnail.jpg?raw=true';

  public tweetHref: WritableSignal<string> = signal(`${this.baseUrl}?text=${encodeURIComponent(this.text)}&hashtags=${this.hashtags}&url=https://webxr.art&image=${this.imageUrl}`);
  constructor() { }

  onTweet (ops?: any) {
    this.tweetHref.set(`${this.baseUrl}?text=${encodeURIComponent(this.text)}&hashtags=${this.hashtags}`);
  }
}
