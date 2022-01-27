import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { TreeGridComponent, VirtualScrollService, EditSettingsModel } from '@syncfusion/ej2-angular-treegrid';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { DataService } from './data.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';
import { columnMenuItems, rowMenuItems } from 'src/lib/utilities';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [VirtualScrollService]
})
export class AppComponent implements OnInit {
  title = 'syncfusion-tree-grid';

  public data!: Object[];
  public height!: number;
  public contextMenuItems!: Object[];

  @ViewChild('treegrid')
  public treeGridObj!: TreeGridComponent;
  public editSettings!: EditSettingsModel;
  public selectedColumn!: string;
  public selectedMenuItem!: string;
  public treegridColumns!: any[];
  public metaData!: any;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private dataService: DataService,
    private socket: Socket, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.height = window.innerHeight - 70;
    this.contextMenuItems = [...columnMenuItems, ...rowMenuItems];

    this.dataService.sendGetRequest('/get-data').pipe(takeUntil(this.destroy$))
      .subscribe(this.initializeTreeGrid);

    this.socket.on('getUpdatedData', this.updatedBasedOnIncomingData)
  }

  initializeTreeGrid = (gridData: any) => {
    const { metaData, data } = gridData;
    this.data = [...data];
    this.metaData = { ...metaData };
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' }
    if (this.data.length > 0) {
      const treegridColumns = [];
      for (const key in metaData) {
        treegridColumns.push({
          field: key,
          headerText: metaData[key]['name'],
          width: 120,
          customAttributes: {
            class: 'customize-headercell'
          }
        })
      }
      this.treegridColumns = [...treegridColumns];
    }
  }

  updatedBasedOnIncomingData = (incomingData: any) => {
    const column = this.treeGridObj.getColumnByField(this.selectedColumn);
    const { formData, sampleData } = incomingData;
    const { colName, minColWidth, alignment, fontSize, fontColor, backgroundColor, textWrap } = formData;
    const selectedColIndex = this.treegridColumns.findIndex((item) => item.field == this.selectedColumn);
    
    if (selectedColIndex > -1) {
      this.treegridColumns[selectedColIndex] = {
        ...this.treegridColumns[selectedColIndex],
        width: minColWidth || 120,
        headerText: colName,
        textAlign: alignment
      };
      this.metaData = sampleData.metaData;
      setTimeout(() => this.changeStyleOfColumn(formData, selectedColIndex));
    }

    this.treeGridObj.dataSource = sampleData.data;
    this.treeGridObj.refreshColumns();
  }

  changeStyleOfColumn = (formData: any, selectedColIndex: number) => {
    const { colName, minColWidth, alignment, fontSize, fontColor, backgroundColor, textWrap } = formData;
      const headerCell = (document.getElementsByClassName('customize-headercell') as HTMLCollectionOf<HTMLElement>)[selectedColIndex]
      const wrapWord = textWrap ? 'word-break' : 'normal';
      headerCell.setAttribute(
        'style', `font-size: ${fontSize}px; color: ${fontColor}; background-color: ${backgroundColor}; font-size: ${wrapWord}`);    
  }

  contextMenuOpen(arg?: any): void {
    const elem: Element = arg.event.target as Element;
    const rowInfo = this.treeGridObj.getRowInfo(elem);
    if (rowInfo.rowData) {

    } else {
      if (arg.column) this.selectedColumn = arg.column.field;
    }
  }

  contextMenuClick(args?: MenuEventArgs): void {
    if (args && args.item.id) {
      this.selectedMenuItem = args.item.id;
      if (this.selectedColumn) {
        this.openDialog();
      }
    }
  }

  updateColumn = (formData: Object): void => {
    const modifiedFormData = { ...formData, selectedColumn: this.selectedColumn }
    this.socket.emit('editCol', modifiedFormData);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '500px',
      data: {
        selectedMenuItem: this.selectedMenuItem,
        selectedColumn: this.selectedColumn,
        metaData: this.metaData
      }
    });
    dialogRef.componentInstance.updateColumn.subscribe((formData) => {
      this.updateColumn(formData);
    })
  }

}
