import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit-col-form',
  templateUrl: './edit-col-form.component.html',
  styleUrls: ['./edit-col-form.component.scss']
})
export class EditColFormComponent implements OnInit {

  @Input() selectedColumn!: string;
  @Input() hideDialog!: () => void;
  @Input() updateColumn!: (arg: Object) => void;
  @Input() metaData!: any;
  dataTypeOptions: Array<string> = ['Text', 'Num', 'Date', 'Boolean', 'List'];

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


  ngOnInit(): void {    
   
  }

  onSubmit() {    
    this.updateColumn(this.editColForm.value);
  }

  ngOnChanges(changes: SimpleChanges): void {   
    if (Object.keys(changes).length > 0) {
      const { selectedColumn : { currentValue: colName }} = changes;
      this.editColForm.patchValue({ colName: this.metaData[colName].name })      
    }
  }

}
