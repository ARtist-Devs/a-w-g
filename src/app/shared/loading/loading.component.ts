import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'art-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {

  @Input() delta = 0;

  @ViewChild('#loading-bar', { static: true })
  div!: ElementRef<HTMLElement>;

  private get progressBar (): HTMLElement {
    return this.div?.nativeElement;
  }

  @ViewChild('#bar', { static: true })
  bar!: ElementRef<HTMLElement>;

  private get barEl (): HTMLElement {
    return this.bar?.nativeElement;
  }

  ngOnInit () {
    console.log('LoadingComponent this.delta, this.barEl, this.progressBar', this.delta, this.barEl, this.progressBar);
    this.visible = true;
  }

  onProgress (ops?: any) {
    const progress = this.delta * 100;
    if (progress == 100)
    {
      this.visible = false;
    }
    this.visible.set(progress);
    ops.loader.progressBar.style.width = `${progress}%`;
  }

  set progress (delta: any) {
    const percent = delta * 100;
    this.barEl.style.width = `${percent}%`;
  }

  set visible (value: any) {
    if (value)
    {
      // this.progressBar.style.display = 'flex';
    } else
    {
      // this.progressBar.style.display = 'none';
    }
  }
}
