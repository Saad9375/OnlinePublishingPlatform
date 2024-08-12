import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./sign-up/sign-up.component').then((m) => m.SignUpComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
    canActivate: [authGuard],
  },
  {
    path: 'article-details',
    loadComponent: () =>
      import('./article-details/article-details.component').then(
        (m) => m.ArticleDetailsComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'bookmark-articles',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
    canActivate: [authGuard],
  },
  {
    path: 'new-article',
    loadComponent: () =>
      import('./new-article/new-article.component').then(
        (m) => m.NewArticleComponent
      ),
    canActivate: [authGuard],
  },
];
