import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintAdicionComponent } from './print-adicion.component';

describe('PrintAdicionComponent', () => {
  let component: PrintAdicionComponent;
  let fixture: ComponentFixture<PrintAdicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintAdicionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrintAdicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
