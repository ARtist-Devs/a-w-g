import { Component } from '@angular/core';

@Component({
  selector: 'art-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss']
})
export class TweetComponent {
  public tweetHref: string = 'https://twitter.com/intent/tweet?text=Checkout%20Angular%20WebXR%20Art%20Gallery!&hashtags=Angular,WebXR,AngularSignals&url=https://webxr.art&image=https://raw.githubusercontent.com/ARtist-Devs/a-w-g/main/src/assets/images/thumbnail.png';
  onTweet (e: Event) {

  }
}
