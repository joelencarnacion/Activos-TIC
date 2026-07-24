import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLevantamientoComponent } from './add-levantamiento.component';

describe('AddLevantamientoComponent', () => {
  let component: AddLevantamientoComponent;
  let fixture: ComponentFixture<AddLevantamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLevantamientoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddLevantamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
