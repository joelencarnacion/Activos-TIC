import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintTrasladoComponent } from './print-traslado.component';

describe('PrintTrasladoComponent', () => {
  let component: PrintTrasladoComponent;
  let fixture: ComponentFixture<PrintTrasladoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintTrasladoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrintTrasladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
