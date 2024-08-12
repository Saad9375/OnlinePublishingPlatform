import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Article } from '../../models/article.model';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  accessToken: string = '';
  constructor(private http: HttpClient, private authService: AuthService) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(
        'firebase:authUser:AIzaSyBuE8Z8rhoJubTRcIq_ZrJ4Qz11cbu2H48:[DEFAULT]'
      ) as string
    ).stsTokenManager.accessToken;
  }

  getArticles() {
    return this.http.get<Article[]>(
      `https://online-publishing-platfo-417f1-default-rtdb.firebaseio.com/articles.json?auth=${this.accessToken}`
    );
  }

  addNewArticle(id: number, article: Article) {
    return this.http.put(
      `https://online-publishing-platfo-417f1-default-rtdb.firebaseio.com/articles/${id}.json?auth=${this.accessToken}`,
      article
    );
  }
}
