import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDonacionComponent } from './print-donacion.component';

describe('PrintDonacionComponent', () => {
  let component: PrintDonacionComponent;
  let fixture: ComponentFixture<PrintDonacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintDonacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrintDonacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
