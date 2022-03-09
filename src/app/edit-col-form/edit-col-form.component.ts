import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-col-form',
  templateUrl: './edit-col-form.component.html',
  styleUrls: ['./edit-col-form.component.scss']
})
export class EditColFormComponent implements OnInit {

  @Input() selectedColumn!: string;
  @Input() editColForm!: FormGroup;
  @Input() metaData!: any;
  dataTypeOptions: Array<string> = ['Text', 'Num', 'Date', 'Boolean', 'List'];  

  ngOnInit(): void {

  }

}
