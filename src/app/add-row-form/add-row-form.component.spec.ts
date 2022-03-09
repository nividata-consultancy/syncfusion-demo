import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRowFormComponent } from './add-row-form.component';

describe('AddRowFormComponent', () => {
  let component: AddRowFormComponent;
  let fixture: ComponentFixture<AddRowFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRowFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRowFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
