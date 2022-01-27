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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';


const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    EditColFormComponent,
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
    SocketIoModule.forRoot(config)
  ],
  providers: [ContextMenuService],
  bootstrap: [AppComponent]
})
export class AppModule { }
