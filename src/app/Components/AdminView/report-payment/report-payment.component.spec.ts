import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPaymentComponent } from './report-payment.component';

describe('ReportPaymentComponent', () => {
  let component: ReportPaymentComponent;
  let fixture: ComponentFixture<ReportPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
