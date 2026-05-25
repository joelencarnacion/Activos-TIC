import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoManageComponent } from './equipo-manage.component';

describe('EquipoManageComponent', () => {
  let component: EquipoManageComponent;
  let fixture: ComponentFixture<EquipoManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipoManageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EquipoManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
