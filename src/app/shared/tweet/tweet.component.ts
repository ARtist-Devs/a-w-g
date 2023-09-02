import { Component } from '@angular/core';

@Component({
  selector: 'art-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss']
})
export class TweetComponent {
  tweetHref = 'http://twitter.com/share??text=Something%20interesting%20art%20gallery!&hashtags=Angular,WebXR,AngularSignals&url=https://webxr.art&image=https://i.redd.it/hud8nnw3q6y71.jpg'
  // TODO Tweet Component is fixed position and does not show up in xr mode. 
  // Generate tweetHref
  onTweet(e: Event) {
  }

}
