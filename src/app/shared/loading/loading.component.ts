/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component( {
  selector: 'art-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
} )
export class LoadingComponent {
  public progress: number = 0;
  @Input() delta: number = 0;

  @ViewChild( '#loading-bar', { static: true } )
  div!: ElementRef<HTMLElement>;

  private get progressBar (): HTMLElement {
    return this.div?.nativeElement;
  }

  @ViewChild( '#bar', { static: true } )
  bar!: ElementRef<HTMLElement>;

  private get barEl (): HTMLElement {
    return this.bar?.nativeElement;
  }

  ngOnInit () {
    console.log( 'LoadingComponent this.delta, this.barEl, this.progressBar', this.delta, this.barEl, this.progressBar );
    this.visible( 0 );
  }

  ngOnChanges () {
    this.onProgress();
  }

  onProgress ( ops?: any ) {

    const progress = this.delta * 100;
    console.log( '*** LoadingComponent onProgress ops', this.delta );
    if ( progress == 100 ) {
      this.visible( 0 );
    }
    this.visible( progress );
    this.progress = progress;
  }


  visible ( value: any ) {
    console.log( 'DIV ', this.div );
    if ( value < 100 ) {
      this.progress = value;
    } else {
      this.progress = 100;
    }
  }
}
