import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdicionAddComponent } from './adicion-add.component';

describe('AdicionAddComponent', () => {
  let component: AdicionAddComponent;
  let fixture: ComponentFixture<AdicionAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdicionAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdicionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
