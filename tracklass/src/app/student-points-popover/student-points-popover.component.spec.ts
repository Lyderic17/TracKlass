import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPointsPopoverComponent } from './student-points-popover.component';

describe('StudentPointsPopoverComponent', () => {
  let component: StudentPointsPopoverComponent;
  let fixture: ComponentFixture<StudentPointsPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentPointsPopoverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentPointsPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
