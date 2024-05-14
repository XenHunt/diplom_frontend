import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAndEditComponent } from './show-and-edit.component';

describe('ShowAndEditComponent', () => {
  let component: ShowAndEditComponent;
  let fixture: ComponentFixture<ShowAndEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowAndEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowAndEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
