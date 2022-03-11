import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ContextMenuService, TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditColFormComponent } from './edit-col-form/edit-col-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ModalComponent } from './modal/modal.component';
import { AddRowFormComponent } from './add-row-form/add-row-form.component';
import { AddEditRowModalComponent } from './add-edit-row-modal/add-edit-row-modal.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { environment } from 'src/environments/environment';


const config: SocketIoConfig = { url: environment.api_url, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    EditColFormComponent,
    ModalComponent,
    AddRowFormComponent,
    AddEditRowModalComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TreeGridModule,
    HttpClientModule,
    DialogModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    SocketIoModule.forRoot(config),
    MatDialogModule,
  ],
  providers: [ContextMenuService],
  bootstrap: [AppComponent]
})
export class AppModule { }
