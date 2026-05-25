import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerActivosComponent } from './ver-activos.component';

describe('VerActivosComponent', () => {
  let component: VerActivosComponent;
  let fixture: ComponentFixture<VerActivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerActivosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerActivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
