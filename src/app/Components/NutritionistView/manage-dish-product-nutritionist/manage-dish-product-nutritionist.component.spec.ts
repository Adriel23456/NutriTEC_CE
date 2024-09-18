import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDishProductNutritionistComponent } from './manage-dish-product-nutritionist.component';

describe('ManageDishProductNutritionistComponent', () => {
  let component: ManageDishProductNutritionistComponent;
  let fixture: ComponentFixture<ManageDishProductNutritionistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageDishProductNutritionistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDishProductNutritionistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
