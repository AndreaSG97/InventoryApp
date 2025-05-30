import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './modules/transactions/transactions.component';

const routes: Routes = [
 { path: 'products', loadChildren: () => import('./modules/products/products.module').then(m => m.ProductsModule) },
  { path: 'transactions', loadChildren: () => import('./modules/transactions/transactions.module').then(m => m.TransactionsModule) },
  { path: '', redirectTo: 'products', pathMatch: 'full' }, 
  { path: '**', redirectTo: 'products' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
