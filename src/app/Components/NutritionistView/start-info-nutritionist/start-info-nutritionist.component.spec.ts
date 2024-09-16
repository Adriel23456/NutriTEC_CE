import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartInfoNutritionistComponent } from './start-info-nutritionist.component';

describe('StartInfoNutritionistComponent', () => {
  let component: StartInfoNutritionistComponent;
  let fixture: ComponentFixture<StartInfoNutritionistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartInfoNutritionistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartInfoNutritionistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
