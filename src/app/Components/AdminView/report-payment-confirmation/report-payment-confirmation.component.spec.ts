import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPaymentConfirmationComponent } from './report-payment-confirmation.component';

describe('ReportPaymentConfirmationComponent', () => {
  let component: ReportPaymentConfirmationComponent;
  let fixture: ComponentFixture<ReportPaymentConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportPaymentConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportPaymentConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
