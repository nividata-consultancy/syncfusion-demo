import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { TreeGridComponent, VirtualScrollService, EditSettingsModel, extendArray } from '@syncfusion/ej2-angular-treegrid';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { DataService } from './data.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { EmitType } from '@syncfusion/ej2-base';
import { Socket } from 'ngx-socket-io';

const columnMenuItems = [
  { text: 'EditCol', target: '.e-headercontent', id: 'editcol' },
  { text: 'NewCol', target: '.e-headercontent', id: 'newcol' },
  { text: 'DelCol', target: '.e-headercontent', id: 'delcol' },
  { text: 'ChooseCol', target: '.e-headercontent', id: 'choosecol' },
  { text: 'FreezeCol', target: '.e-headercontent', id: 'freezecol' },
  { text: 'FilterCol', target: '.e-headercontent', id: 'filtercol' },
  { text: 'MultiSort', target: '.e-headercontent', id: 'multisort' },
];

const rowMenuItems = [
  { text: 'AddNext', target: '.e-content', id: 'addnext' },
  { text: 'MultiSelect', target: '.e-content', id: 'multiselect' },
  { text: 'CopyRows', target: '.e-content', id: 'copyrows' },
  { text: 'PasteNext', target: '.e-content', id: 'pastenext' },
  { text: 'PasteChild', target: '.e-content', id: 'pastechild' },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [VirtualScrollService]
})
export class AppComponent implements OnInit {
  title = 'syncfusion-tree-grid';

  @ViewChild('ejDialog') ejDialog!: DialogComponent;

  // Create element reference for dialog target element.
  @ViewChild('container', { read: ElementRef, static: true }) container!: ElementRef;

  public data!: Object[];
  public height!: number;
  public contextMenuItems!: Object[];
  public targetElement!: HTMLElement;

  @ViewChild('treegrid')
  public treeGridObj!: TreeGridComponent;
  public editSettings!: EditSettingsModel;
  public selectedColumn!: string;
  public selectedMenuItem!: string;
  public treegridColumns!: any[];
  public metaData!: any;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private dataService: DataService,
    private socket: Socket) { }

  ngOnInit(): void {
    this.height = window.innerHeight - 70;
    this.contextMenuItems = [...columnMenuItems, ...rowMenuItems];
    this.initilaizeTarget();

    this.dataService.sendGetRequest('/get-data').pipe(takeUntil(this.destroy$))
      .subscribe((gridData: any) => {
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
      });

    this.socket.on('getUpdatedData', (incomingData: any) => {
      const column = this.treeGridObj.getColumnByField(this.selectedColumn);
      const { formData, sampleData } = incomingData;
      const { colName, minColWidth, alignment, fontSize, fontColor, backgroundColor, textWrap } = formData;
      const selectedColIndex = this.treegridColumns.findIndex((item) => item.field == this.selectedColumn);
      if (selectedColIndex > -1) {
        this.treegridColumns[selectedColIndex] = {
          ...this.treegridColumns[selectedColIndex],
          width: minColWidth,
          headerText: colName,
          textAlign: alignment
        };
        setTimeout(() => {
          const headerCell = (document.getElementsByClassName('customize-headercell') as HTMLCollectionOf<HTMLElement>)[selectedColIndex]
          const wrapWord = textWrap ? 'word-break' : 'normal';
          headerCell.setAttribute(
            'style', `font-size: ${fontSize}px; color: ${fontColor}; background-color: ${backgroundColor}; font-size: ${wrapWord}`);         
        })
      }
      this.treeGridObj.dataSource = sampleData.data;
      this.treeGridObj.refreshColumns();
    })
  }

  initilaizeTarget: EmitType<object> = () => {
    this.targetElement = this.container.nativeElement.parentElement;
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
    this.ejDialog.hide();
  }

  openDialog(): void {
    this.ejDialog.show();
  }

  hideDialog = (): void => {
    this.ejDialog.hide();
  }

}
