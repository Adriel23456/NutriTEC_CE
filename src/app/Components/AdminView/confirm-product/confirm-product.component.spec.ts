import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmProductComponent } from './confirm-product.component';

describe('ConfirmProductComponent', () => {
  let component: ConfirmProductComponent;
  let fixture: ComponentFixture<ConfirmProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
