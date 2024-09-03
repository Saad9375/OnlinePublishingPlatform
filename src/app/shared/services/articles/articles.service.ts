import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Article } from '../../models/article.model';
import { firebaseConfig } from '../../../app.config';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  accessToken: string = '';
  constructor(private http: HttpClient) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(
        `firebase:authUser:${firebaseConfig.apiKey}:[DEFAULT]`
      ) as string
    ).stsTokenManager.accessToken;
  }

  getArticles() {
    return this.http.get<Article[]>(
      `${firebaseConfig.databaseURL}/articles.json`
    );
  }

  addNewArticle(article: Article) {
    return this.http.put(
      `${firebaseConfig.databaseURL}/articles/${article.id}.json`,
      article
    );
  }
}
