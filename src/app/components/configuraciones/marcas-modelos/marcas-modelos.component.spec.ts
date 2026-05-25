import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcasModelosComponent } from './marcas-modelos.component';

describe('MarcasModelosComponent', () => {
  let component: MarcasModelosComponent;
  let fixture: ComponentFixture<MarcasModelosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarcasModelosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MarcasModelosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
