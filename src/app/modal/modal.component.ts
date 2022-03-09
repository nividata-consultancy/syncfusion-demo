import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Output() updateColumn = new EventEmitter<{ formData: Object, isForNewCol: boolean }>();
  formMenuItems = ['editcol', 'newcol'];

  editColForm = new FormGroup({
    colName: new FormControl(''),
    dataType: new FormControl(''),
    defaultValue: new FormControl(''),
    minColWidth: new FormControl(''),
    fontSize: new FormControl(''),
    fontColor: new FormControl(''),
    alignment: new FormControl(''),
    backgroundColor: new FormControl(''),
    textWrap: new FormControl(false)
  });

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    if (this.data.selectedMenuItem === 'editcol') {
      this.editColForm.patchValue({
        colName: this.data.metaData[this.data.selectedColumn].name,
        dataType: this.data.metaData[this.data.selectedColumn].dataType
      })
    }
  }

  onSubmit = () => {
    this.updateColumn.emit({ 
      formData: this.editColForm.value, 
      isForNewCol: this.data.selectedMenuItem === 'newcol' 
    });
    this.dialogRef.close();
  }

}
