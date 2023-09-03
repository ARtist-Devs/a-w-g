import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebXRButtonComponent } from './webxr-button.component';

describe('WebXRButtonComponent', () => {
  let component: WebXRButtonComponent;
  let fixture: ComponentFixture<WebXRButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebXRButtonComponent]
    });
    fixture = TestBed.createComponent(WebXRButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
