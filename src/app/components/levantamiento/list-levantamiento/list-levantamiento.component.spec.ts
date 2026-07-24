import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLevantamientoComponent } from './list-levantamiento.component';

describe('ListLevantamientoComponent', () => {
  let component: ListLevantamientoComponent;
  let fixture: ComponentFixture<ListLevantamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListLevantamientoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListLevantamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
