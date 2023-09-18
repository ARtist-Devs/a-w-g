import { Component } from '@angular/core';

@Component({
  selector: 'art-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss']
})
export class TweetComponent {
  public tweetHref: string = 'https://twitter.com/intent/tweet?text=Checkout%20Angular%20art%20gallery!&hashtags=Angular,WebXR,AngularSignals&url=https://webxr.art&image=assets/image/gallery.png';
  // TODO Tweet Component is fixed position and does not show up in xr mode. 
  // Generate tweetHref
  onTweet (e: Event) {

  }

}
