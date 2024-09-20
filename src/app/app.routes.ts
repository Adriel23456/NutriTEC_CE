import { Routes } from '@angular/router';
import { AuthenticationComponent } from './Components/Authentication/authentication/authentication.component';
import { SidenavClientComponent } from './Components/ClientView/sidenav-client/sidenav-client.component';
import { authenticationClientGuard } from './Guards/Client/authentication-client.guard';
import { SidenavAdminComponent } from './Components/AdminView/sidenav-admin/sidenav-admin.component';
import { authenticationAdminGuard } from './Guards/Admin/authentication-admin.guard';
import { SidenavNutritionistComponent } from './Components/NutritionistView/sidenav-nutritionist/sidenav-nutritionist.component';
import { authenticationNutritionistGuard } from './Guards/Nutritionist/authentication-nutritionist.guard';
import { AdminRegisterComponent } from './Components/AdminView/admin-register/admin-register.component';
import { RegisterClientComponent } from './Components/Authentication/register-client/register-client.component';
import { RegisterNutritionistComponent } from './Components/Authentication/register-nutritionist/register-nutritionist.component';
import { StartInfoClientComponent } from './Components/ClientView/start-info-client/start-info-client.component';
import { StartInfoNutritionistComponent } from './Components/NutritionistView/start-info-nutritionist/start-info-nutritionist.component';
import { ConfirmProductComponent } from './Components/AdminView/confirm-product/confirm-product.component';
import { ReportPaymentComponent } from './Components/AdminView/report-payment/report-payment.component';
import { FoodPlanComponent } from './Components/ClientView/food-plan/food-plan.component';
import { DailyRegisterComponent } from './Components/ClientView/daily-register/daily-register.component';
import { AdvancementReportComponent } from './Components/ClientView/advancement-report/advancement-report.component';
import { AdviceClientComponent } from './Components/NutritionistView/advice-client/advice-client.component';
import { ManageFoodPlanComponent } from './Components/NutritionistView/manage-food-plan/manage-food-plan.component';
import { ManageDishProductComponent } from './Components/ClientView/manage-dish-product/manage-dish-product.component';
import { ManageDishProductNutritionistComponent } from './Components/NutritionistView/manage-dish-product-nutritionist/manage-dish-product-nutritionist.component';
import { GenerateProductComponent } from './Components/All/generate-product/generate-product.component';
import { GenerateDishComponent } from './Components/All/generate-dish/generate-dish.component';
import { EditProductComponent } from './Components/NutritionistView/edit-product/edit-product.component';
import { EditDishComponent } from './Components/NutritionistView/edit-dish/edit-dish.component';
import { ReportPaymentConfirmationComponent } from './Components/AdminView/report-payment-confirmation/report-payment-confirmation.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: AuthenticationComponent },
    { path: 'registerClient', component: RegisterClientComponent },
    { path: 'registerNutri', component: RegisterNutritionistComponent },
    {
      path: 'sidenavClient',
      component: SidenavClientComponent,
      canActivate: [authenticationClientGuard],
      children: [
        { path: '', redirectTo: 'startInfoClient', pathMatch: 'full' },
        { path: 'startInfoClient', component: StartInfoClientComponent },
        { path: 'manageDishProduct', component: ManageDishProductComponent },
        { path: 'foodPlan', component: FoodPlanComponent },
        { path: 'dailyRegister', component: DailyRegisterComponent },
        { path: 'advancementReport', component: AdvancementReportComponent },
        { path: 'generateProduct', component: GenerateProductComponent },
        { path: 'generateDish', component: GenerateDishComponent }
      ]
    },
    {
      path: 'sidenavAdmin',
      component: SidenavAdminComponent,
      canActivate: [authenticationAdminGuard],
      children: [
        { path: '', redirectTo: 'registerAdmin', pathMatch: 'full' },
        { path: 'registerAdmin', component: AdminRegisterComponent },
        { path: 'confirmProduct', component: ConfirmProductComponent },
        { path: 'reportPayment', component: ReportPaymentComponent },
        { path: 'reportPayment/confirmation/:id', component: ReportPaymentConfirmationComponent },
      ]
    },
    {
      path: 'sidenavNutri',
      component: SidenavNutritionistComponent,
      canActivate: [authenticationNutritionistGuard],
      children: [
        { path: '', redirectTo: 'startInfoNutri', pathMatch: 'full' },
        { path: 'startInfoNutri', component: StartInfoNutritionistComponent },
        { path: 'manageDishProduct', component: ManageDishProductNutritionistComponent },
        { path: 'adviceClient', component: AdviceClientComponent },
        { path: 'manageFoodPlan', component: ManageFoodPlanComponent },
        { path: 'generateProduct', component: GenerateProductComponent },
        { path: 'generateDish', component: GenerateDishComponent },
        { path: 'manageDishProduct/editProduct/:barCode', component: EditProductComponent },
        { path: 'manageDishProduct/editDish/:barCode', component: EditDishComponent },
      ]
    },
    { path: '**', redirectTo: '/sidenavClient' }
];
