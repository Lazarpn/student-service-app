import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EngagementsComponent } from './engagements.component';

describe('EngagementsComponent', () => {
  let component: EngagementsComponent;
  let fixture: ComponentFixture<EngagementsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EngagementsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngagementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
