import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebxrButtonComponent } from './webxr-button.component';

describe('WebxrButtonComponent', () => {
  let component: WebxrButtonComponent;
  let fixture: ComponentFixture<WebxrButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebxrButtonComponent]
    });
    fixture = TestBed.createComponent(WebxrButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
