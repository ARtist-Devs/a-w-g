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

  @ViewChild( '#bar', { static: true } )
  bar!: ElementRef<HTMLElement>;

}
