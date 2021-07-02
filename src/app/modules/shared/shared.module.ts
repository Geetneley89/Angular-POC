import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavigationComponent } from './side-navigation/side-navigation.component';
import { HeaderComponent } from './header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';



@NgModule({
  declarations: [
    SideNavigationComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    MatToolbarModule,
		MatButtonModule,
		MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatMenuModule,
    MatTabsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule
  ],
  exports: [
    SideNavigationComponent,
    HeaderComponent
  ],
  providers: [SideNavigationComponent]
})
export class SharedModule { }
