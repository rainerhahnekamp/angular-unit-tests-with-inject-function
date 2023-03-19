import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './core/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidemenuComponent } from './core/sidemenu/sidemenu.component';
import { RequestInfoComponent } from './request-info/request-info.component';

@Component({
  selector: 'eternal-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    SidemenuComponent,
    MatToolbarModule,
    MatSidenavModule,
    RequestInfoComponent
  ]
})
export class AppComponent {}
