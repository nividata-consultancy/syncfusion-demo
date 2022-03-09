import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRowModalComponent } from './add-edit-row-modal.component';

describe('AddEditRowModalComponent', () => {
  let component: AddEditRowModalComponent;
  let fixture: ComponentFixture<AddEditRowModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditRowModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditRowModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
