import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { TransactionListComponent } from './modules/transactions/components/transaction-list/transaction-list.component';
import { TransactionFormComponent } from './modules/transactions/components/transaction-form/transaction-form.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    HttpClientModule       
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
