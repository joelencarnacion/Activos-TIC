import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivoDetalleComponent } from './activo-detalle.component';

describe('ActivoDetalleComponent', () => {
  let component: ActivoDetalleComponent;
  let fixture: ComponentFixture<ActivoDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivoDetalleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
