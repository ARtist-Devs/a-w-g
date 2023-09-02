import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TweetComponent } from './tweet/tweet.component';
import { ErrorComponent } from './error/error.component';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  declarations: [TweetComponent, ErrorComponent, LoadingComponent],
  imports: [
    CommonModule
  ],
  exports: [
    TweetComponent, ErrorComponent, LoadingComponent
  ]
})
export class SharedModule { }
