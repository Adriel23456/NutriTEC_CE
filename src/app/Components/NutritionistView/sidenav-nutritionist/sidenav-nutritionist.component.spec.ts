import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavNutritionistComponent } from './sidenav-nutritionist.component';

describe('SidenavNutritionistComponent', () => {
  let component: SidenavNutritionistComponent;
  let fixture: ComponentFixture<SidenavNutritionistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidenavNutritionistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidenavNutritionistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
