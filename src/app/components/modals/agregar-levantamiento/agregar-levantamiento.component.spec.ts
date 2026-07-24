import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarLevantamientoComponent } from './agregar-levantamiento.component';

describe('AgregarLevantamientoComponent', () => {
  let component: AgregarLevantamientoComponent;
  let fixture: ComponentFixture<AgregarLevantamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarLevantamientoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarLevantamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
