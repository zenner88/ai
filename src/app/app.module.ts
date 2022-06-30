import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { UpperCasePipe, registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id'; 
import { GlobalService } from './global.service';
import { AppComponent } from './app.component';
import { MainComponent } from './pages/main/main.component';
import { FotoListComponent } from './pages/foto-list/foto-list.component';

registerLocaleData(localeId, 'id'); 

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    FotoListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: "id-ID" }, UpperCasePipe, GlobalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
