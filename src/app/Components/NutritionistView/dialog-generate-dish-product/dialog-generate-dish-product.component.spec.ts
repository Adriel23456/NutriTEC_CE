import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGenerateDishProductComponent } from './dialog-generate-dish-product.component';

describe('DialogGenerateDishProductComponent', () => {
  let component: DialogGenerateDishProductComponent;
  let fixture: ComponentFixture<DialogGenerateDishProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogGenerateDishProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogGenerateDishProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
