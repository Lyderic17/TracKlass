import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WheelOfNamesComponent } from './wheel-of-names.component';

describe('WheelOfNamesComponent', () => {
  let component: WheelOfNamesComponent;
  let fixture: ComponentFixture<WheelOfNamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WheelOfNamesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WheelOfNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
