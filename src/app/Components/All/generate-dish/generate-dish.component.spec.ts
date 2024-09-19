import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateDishComponent } from './generate-dish.component';

describe('GenerateDishComponent', () => {
  let component: GenerateDishComponent;
  let fixture: ComponentFixture<GenerateDishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateDishComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateDishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
