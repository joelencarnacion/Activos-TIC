import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintAsignacionComponent } from './print-asignacion.component';

describe('PrintAsignacionComponent', () => {
  let component: PrintAsignacionComponent;
  let fixture: ComponentFixture<PrintAsignacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintAsignacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrintAsignacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
