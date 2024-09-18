import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancementReportComponent } from './advancement-report.component';

describe('AdvancementReportComponent', () => {
  let component: AdvancementReportComponent;
  let fixture: ComponentFixture<AdvancementReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancementReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
