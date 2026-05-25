import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdicionListComponent } from './adicion-list.component';

describe('AdicionListComponent', () => {
  let component: AdicionListComponent;
  let fixture: ComponentFixture<AdicionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdicionListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdicionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
