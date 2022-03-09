import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-row-modal',
  templateUrl: './add-edit-row-modal.component.html',
  styleUrls: ['./add-edit-row-modal.component.scss']
})
export class AddEditRowModalComponent implements OnInit {
  @Output() addEditChildRow = new EventEmitter<{formData: Object, isForEdit: boolean}>();

  constructor(
    public dialogRef: MatDialogRef<AddEditRowModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  public addEditRowForm!: FormGroup;

  ngOnInit(): void {
    const { metaData } = this.data;
    const formFields: any = {};
    if (this.data.isForEdit) {
      for (const key in metaData) {
        const value = this.data.selectedRow[key];
        formFields[key] = new FormControl(value);
      }  
    } else {
      for (const key in metaData) {
        formFields[key] =  new FormControl('');
      }
    }    
    this.addEditRowForm = new FormGroup(formFields);
  }

  onSubmit = () => {        
    this.addEditChildRow.emit({
      formData: this.addEditRowForm.value,
      isForEdit: this.data.isForEdit
    });
    this.dialogRef.close();
  }

}
