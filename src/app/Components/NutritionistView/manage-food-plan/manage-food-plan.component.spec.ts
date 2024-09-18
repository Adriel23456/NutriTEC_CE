import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFoodPlanComponent } from './manage-food-plan.component';

describe('ManageFoodPlanComponent', () => {
  let component: ManageFoodPlanComponent;
  let fixture: ComponentFixture<ManageFoodPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageFoodPlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageFoodPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
