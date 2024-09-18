import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDishProductComponent } from './manage-dish-product.component';

describe('ManageDishProductComponent', () => {
  let component: ManageDishProductComponent;
  let fixture: ComponentFixture<ManageDishProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageDishProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDishProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
