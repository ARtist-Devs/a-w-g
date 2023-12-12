import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ErrorComponent } from "./error/error.component";
import { LoadingComponent } from "./loading/loading.component";
import { TweetComponent } from "./tweet/tweet.component";

@NgModule({
	declarations: [TweetComponent, ErrorComponent, LoadingComponent],
	imports: [CommonModule],
	exports: [TweetComponent, ErrorComponent, LoadingComponent],
})
export class SharedModule {}
