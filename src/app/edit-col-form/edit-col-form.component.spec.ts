import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditColFormComponent } from './edit-col-form.component';

describe('EditColFormComponent', () => {
  let component: EditColFormComponent;
  let fixture: ComponentFixture<EditColFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditColFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditColFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
