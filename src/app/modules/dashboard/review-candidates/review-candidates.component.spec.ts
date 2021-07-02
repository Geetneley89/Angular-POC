import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewCandidatesComponent } from './review-candidates.component';

describe('ReviewCandidatesComponent', () => {
  let component: ReviewCandidatesComponent;
  let fixture: ComponentFixture<ReviewCandidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewCandidatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
