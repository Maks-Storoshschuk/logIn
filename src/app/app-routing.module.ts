import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {HomeComponent} from "./components/home/home.component";
import {LogInComponent} from "./components/log-in/log-in.component";
import {CarsComponent} from "./components/cars/cars.component";


const routes: Routes = [
  {
    path: '', component: HomeComponent, children: [
      {path:'',redirectTo:'login',pathMatch:'full'},
      {path: 'login', component: LogInComponent},
      {path: 'cars', component: CarsComponent},
      {path: 'admin', loadChildren: () => import('./components/admin/admin.module').then(value => value.AdminModule)}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
