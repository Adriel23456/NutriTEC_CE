import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdviceClientComponent } from './advice-client.component';

describe('AdviceClientComponent', () => {
  let component: AdviceClientComponent;
  let fixture: ComponentFixture<AdviceClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdviceClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdviceClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
