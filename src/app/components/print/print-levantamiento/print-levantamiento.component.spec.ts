import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintLevantamientoComponent } from './print-levantamiento.component';

describe('PrintLevantamientoComponent', () => {
  let component: PrintLevantamientoComponent;
  let fixture: ComponentFixture<PrintLevantamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintLevantamientoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrintLevantamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
