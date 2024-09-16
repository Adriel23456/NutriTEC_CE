import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartInfoClientComponent } from './start-info-client.component';

describe('StartInfoClientComponent', () => {
  let component: StartInfoClientComponent;
  let fixture: ComponentFixture<StartInfoClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartInfoClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartInfoClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
