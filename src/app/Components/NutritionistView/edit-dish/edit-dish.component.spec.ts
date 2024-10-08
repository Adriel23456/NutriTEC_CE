import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDishComponent } from './edit-dish.component';

describe('EditDishComponent', () => {
  let component: EditDishComponent;
  let fixture: ComponentFixture<EditDishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDishComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
