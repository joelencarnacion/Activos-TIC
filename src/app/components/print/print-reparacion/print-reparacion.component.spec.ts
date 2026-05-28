import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintReparacionComponent } from './print-reparacion.component';

describe('PrintReparacionComponent', () => {
  let component: PrintReparacionComponent;
  let fixture: ComponentFixture<PrintReparacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintReparacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrintReparacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
