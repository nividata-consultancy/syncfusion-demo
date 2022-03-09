import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-row-form',
  templateUrl: './add-row-form.component.html',
  styleUrls: ['./add-row-form.component.scss']
})
export class AddRowFormComponent implements OnInit {
  @Input() metaData!: Object;
  @Input() addEditRowForm!: FormGroup;

  constructor() { }

  ngOnInit(): void {
    // this.addEditRowForm.get('col1')?.disable();
  }

}
