import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {
  TreeGridComponent,
  VirtualScrollService,
  EditSettingsModel,
  ColumnChooserService,
  FreezeService,
  FilterService,
  SortService,
  SelectionSettingsModel,
  EditService,
  RowDDService
} from '@syncfusion/ej2-angular-treegrid';
import { SortEventArgs } from '@syncfusion/ej2-grids';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { DataService } from './data.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';
import { AddEditRowModalComponent } from './add-edit-row-modal/add-edit-row-modal.component';
import { changeStyleOfColumn, columnMenuItems, rowMenuItems } from 'src/lib/utilities';
import { createElement } from '@syncfusion/ej2-base';
import { ConfirmDialogModel, ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

const menuItemsNeedDialogToOpen = ['editcol', 'newcol'];
const menuItemNeedRowDialogToOpen = ['addchild', 'editrow', 'addnext'];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [VirtualScrollService, ColumnChooserService, FreezeService, FilterService, SortService, EditService, RowDDService]
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
  public selectedRow!: Object;
  public treegridColumns!: any[];
  public metaData!: any;
  public freezeColIndex: number = 0;
  public allowFiltering: boolean = false;
  public sortSettings!: Object;
  public allowSorting: boolean = false;
  public allowSelection: boolean = false;
  public copiedRows: Array<any> = [];
  public selectionOptions!: SelectionSettingsModel;
  public hasCutOperationPerformed: boolean = false;

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
    this.editSettings = { allowEditing: false, allowAdding: true, allowDeleting: true, mode: 'Dialog' }
    if (this.data.length > 0) {
      const treegridColumns = [];
      for (const key in metaData) {
        treegridColumns.push({
          field: key,
          headerText: metaData[key]['name'],
          width: 120,
          customAttributes: {
            class: 'customize-headercell'
          },
        })
      }
      this.treegridColumns = [...treegridColumns];

    }
  }

  updateRowDataBasedOnIncomingData = (incomingData: any): void => {
    const { sampleData } = incomingData;
    this.treeGridObj.dataSource = sampleData.data;
  }

  updatedBasedOnIncomingData = (incomingData: any): void => {
    const column = this.treeGridObj.getColumnByField(this.selectedColumn);
    const { formData, sampleData, isForNewCol, isForDeleteCol, isForRowUpdate } = incomingData;

    this.metaData = sampleData.metaData;

    if (isForRowUpdate) {
      this.updateRowDataBasedOnIncomingData(incomingData);
      return;
    }

    if (formData) {
      this.changeBehaviourOfColumn(formData, isForNewCol);
    }

    if (isForDeleteCol) {
      let selectedColIndex = this.treegridColumns.findIndex((item) => item.field == this.selectedColumn);
      this.treegridColumns.splice(selectedColIndex, 1);
    }

    this.treeGridObj.dataSource = sampleData.data;
    this.treeGridObj.refreshColumns();
  }

  changeBehaviourOfColumn = (formData: any, isForNewCol: boolean): void => {
    const { colName, minColWidth, alignment, selectedColumn } = formData;

    let selectedColIndex = this.treegridColumns.findIndex((item) => item.field == selectedColumn);

    if (!isForNewCol && selectedColIndex > -1) {
      this.treegridColumns[selectedColIndex] = {
        ...this.treegridColumns[selectedColIndex],
        width: minColWidth || 120,
        headerText: colName,
        textAlign: alignment
      };
    }

    if (isForNewCol) {
      const key = Object.keys(this.metaData)[Object.keys(this.metaData).length - 1]
      this.treegridColumns.push({
        field: key,
        headerText: this.metaData[key]['name'],
        width: minColWidth || 120,
        textAlign: alignment,
        customAttributes: {
          class: 'customize-headercell'
        }
      })
      selectedColIndex = this.treegridColumns.length - 1;
    }

    setTimeout(() => changeStyleOfColumn(formData, selectedColIndex));

  }

  attachedCheckboxToMenuItem = (arg: any): void => {
    let parentNode: Array<HTMLElement | null> = [];

    const customEle = arg.element.querySelectorAll('.c-custom');
    if (customEle.length) {

      customEle.forEach((innerEle: HTMLElement) => {
        parentNode.push(innerEle.parentElement);
      });

      parentNode.forEach((ele: any) => {

        let text = ele.textContent;

        ele.innerText = '';

        let inputEle: any = createElement('input');

        inputEle.type = 'checkbox'; //append checkbox on Contextmenu Open



        inputEle.setAttribute('class', 'e-checkbox');
        inputEle.setAttribute('id', `check-${ele.id}`);
        inputEle.getAttribute('listener') !== 'true' && inputEle.addEventListener('change', this.menuItemCheckboxChangeHandler);

        ele.prepend(inputEle);

        let labelElem = createElement('label');

        labelElem.textContent = text;

        labelElem.setAttribute('for', `check-${ele.id}`);

        labelElem.setAttribute('class', 'e-checkboxspan');

        ele.classList.add('checkbox-menu-item');

        ele.appendChild(labelElem);
      });

    }
  }

  contextMenuOpen(arg?: any): void {
    const elem: Element = arg.event.target as Element;
    const rowInfo = this.treeGridObj.getRowInfo(elem);

    this.attachedCheckboxToMenuItem(arg);

    if (rowInfo.rowData) {
      this.selectedRow = rowInfo.rowData;      
    } else {
      if (arg.column) this.selectedColumn = arg.column.field;
    }
  }

  contextMenuClick(args?: MenuEventArgs): void {
    if (args && args.item.id) {
      this.selectedMenuItem = args.item.id;
      if (this.selectedColumn) {
        this.menuItemForColumnClickHandler();
      } else {
        this.menuItemForRowDataClickHandler();
      }
    }
  }

  resetThingsOnUnchecked = (): void => {
    if (this.selectedMenuItem === 'filtercol') {
      this.allowFiltering = false;
    } else if (this.selectedMenuItem === 'multisort') {
      this.allowSorting = false;
    } else if (this.selectedMenuItem === 'multiselect') {
      this.allowSelection = false;
    }
  }

  performThingsOnChecked = (): void => {
    if (this.selectedMenuItem === 'filtercol') {
      this.treeGridObj.filterSettings = { type: 'Menu', hierarchyMode: 'Parent' };
      this.allowFiltering = true;
    } else if (this.selectedMenuItem === 'multisort') {

      this.allowSorting = true;
      // const sortColumns = this.treegridColumns.map((item) => ({
      //   field: item.field,
      //   direction: 'Ascending'
      // }));

      // this.sortSettings = {
      //   columns: sortColumns
      // };
      // this.treeGridObj.refreshColumns();            
    } else if (this.selectedMenuItem === 'multiselect') {
      this.selectionOptions = { cellSelectionMode: 'Box', type: 'Multiple', mode: 'Row' };
      this.allowSelection = true;
    }
  }

  menuItemCheckboxChangeHandler = (evt: Event) => {
    if (evt.target) {
      const target = evt.target as HTMLInputElement;

      if (target.checked) {
        this.performThingsOnChecked();
        return;
      }
      this.resetThingsOnUnchecked();
    }
  }

  menuItemForColumnClickHandler = () => {
    if (menuItemsNeedDialogToOpen.includes(this.selectedMenuItem)) this.openDialog();
    else if (this.selectedMenuItem === 'delcol') this.deleteColumn();
    else if (this.selectedMenuItem === 'choosecol') {
      const x = window.innerWidth / 2 - 100;
      const y = window.innerHeight / 2 - 100;
      this.treeGridObj.columnChooserModule.openColumnChooser(x, y);
    } else if (this.selectedMenuItem === 'freezecol') {
      let selectedColIndex = this.treegridColumns.findIndex((item) => item.field == this.selectedColumn);
      // this.treegridColumns[selectedColIndex].isFrozen = true;
      alert('This feature is temporarily not working, as it has some issue from syncfusion side\n Please check this link "https://www.syncfusion.com/feedback/31662/i-have-a-typeerror-when-column-is-frozen-and-i-refresh-columns" for reference');
      this.treeGridObj.refreshColumns();
    }
  }

  changeBackgroundColorOfCopyCutRows = (color: string) => {
    const selectedRowsTD = document.querySelectorAll('.e-row[aria-selected=true] td');
      if (selectedRowsTD.length) {
        selectedRowsTD.forEach((td) => {          
          td.setAttribute('style', `background-color: ${color}`);
        })
      }
      this.treeGridObj.clearSelection();
  }

  menuItemForRowDataClickHandler = () => {    
    if (menuItemNeedRowDialogToOpen.includes(this.selectedMenuItem)) {
      this.editSettings.allowEditing = true;
      this.openRowDialog();
    }
    else if (this.selectedMenuItem === 'delrow') {
      this.deleteRow();
    } else if (this.selectedMenuItem === 'copyrows') {     
      this.copiedRows = this.treeGridObj.getSelectedRecords();   
      this.changeBackgroundColorOfCopyCutRows('pink');         
    } else if (this.selectedMenuItem === 'pastechild') {      
      this.socket.emit('paste', this.selectedRow, this.copiedRows, true, this.hasCutOperationPerformed);
      this.changeBackgroundColorOfCopyCutRows('#fff');
      this.hasCutOperationPerformed = false;
    } else if (this.selectedMenuItem === 'pastenext') {
      this.socket.emit('paste', this.selectedRow, this.copiedRows, false, this.hasCutOperationPerformed);
    } else if (this.selectedMenuItem === 'cutrows') {
      this.hasCutOperationPerformed = true;
      this.copiedRows = this.treeGridObj.getSelectedRecords();            
      this.changeBackgroundColorOfCopyCutRows('pink');
    }
  }

  rowDB = (args: any) => { 
    if (this.copiedRows.length) {
      console.log(args.data);
    }
  } 

  updateColumn = (formData: Object, isForNewCol: boolean): void => {
    const modifiedFormData = { ...formData, selectedColumn: this.selectedColumn }
    if (!isForNewCol) this.socket.emit('editCol', modifiedFormData);
    else this.socket.emit('addNewCol', modifiedFormData);
  }

  deleteRow = () => {
    this.socket.emit('delRow', this.selectedRow)
  }

  confirmDialog = (): void => {
    const message = `Are you sure you want to do this?`;

    const dialogData = new ConfirmDialogModel("Confirm Action", message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
     if (dialogResult) {
      this.socket.emit('delCol', this.selectedColumn);
     }
    });
  }

  deleteColumn = () => {
    this.confirmDialog();
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
    dialogRef.componentInstance.updateColumn.subscribe(({ formData, isForNewCol }) => {
      this.updateColumn(formData, isForNewCol);
    })
  }

  public sort(args: SortEventArgs): void {
    if (args.requestType === 'sorting') {
      if (this.treeGridObj?.sortSettings?.columns) {
        for (let columns of this.treeGridObj.getColumns()) {
          for (let sortcolumns of this.treeGridObj?.sortSettings?.columns) {
            if (sortcolumns.field === columns.field) {
              // this.check(sortcolumns.field, true); break;
            } else {
              // this.check(columns.field, false);
            }
          }
        }
      }
    }

  }

  openRowDialog(): void {
    const dialogRef = this.dialog.open(AddEditRowModalComponent, {
      width: '500px',
      data: {
        selectedMenuItem: this.selectedMenuItem,
        metaData: this.metaData,
        isForEdit: this.selectedMenuItem === 'editrow' ? true : false,
        selectedRow: this.selectedRow
      }
    });
    dialogRef.componentInstance.addEditChildRow.subscribe(({ formData, isForEdit }) => {
      this.addEditRow(formData, isForEdit);
    })
  }

  addEditRow = (formData: any, isForEdit: boolean): void => {
    if (isForEdit) {
      this.socket.emit('editRow', this.selectedRow, formData);
    } else if (this.selectedMenuItem === 'addnext') {
      this.socket.emit('addNext', this.selectedRow, formData);
    } else {
      this.socket.emit('addChildRow', this.selectedRow, formData);
    }
  }

}
