import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EngagementModalComponent } from './engagement-modal.component';

describe('EngagementModalComponent', () => {
  let component: EngagementModalComponent;
  let fixture: ComponentFixture<EngagementModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EngagementModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngagementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
