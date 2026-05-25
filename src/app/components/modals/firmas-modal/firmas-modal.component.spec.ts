import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmasModalComponent } from './firmas-modal.component';

describe('FirmasModalComponent', () => {
  let component: FirmasModalComponent;
  let fixture: ComponentFixture<FirmasModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirmasModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FirmasModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
