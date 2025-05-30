import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { TransactionsComponent } from './transactions.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { TransactionsRoutingModule } from './transactions-routing.module';

@NgModule({
    declarations: [
        TransactionsComponent,
        TransactionListComponent,
        TransactionFormComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TransactionsRoutingModule,
        GridModule,
    ]
})
export class TransactionsModule { }
