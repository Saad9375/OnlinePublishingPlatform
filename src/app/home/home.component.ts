import { Component, computed, OnInit, signal } from '@angular/core';
import { ArticleAdvertisementComponent } from '../article-advertisement/article-advertisement.component';
import { HeaderComponent } from '../header/header.component';
import { ArticlesService } from '../shared/services/articles/articles.service';
import { Article } from '../shared/models/article.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StateManagementService } from '../shared/services/state-management/state-management.service';
import { AuthService } from '../shared/services/auth/auth.service';
import * as _ from 'lodash';
import { FeaturedArticleComponent } from '../featured-article/featured-article.component';
import { FormsModule } from '@angular/forms';
import { firebaseConfig } from '../app.config';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ArticleAdvertisementComponent,
    HeaderComponent,
    RouterLink,
    FeaturedArticleComponent,
    FormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  articles: Article[] = [];
  originalArticles: Article[] = [];
  featuredArticles: Article[] = [];
  userExtraInfo: any;
  bookmarkedArticles: Article[] = [];
  showBookmarks = false;
  searchCriteria = 'title';
  searchText = '';

  constructor(
    private articleService: ArticlesService,
    private stateManagementService: StateManagementService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.stateManagementService.selectedArticle.set(null);
    this.activatedRoute.queryParams.subscribe((params) => {
      this.showBookmarks = params['showBookmarks'];
    });

    this.userExtraInfo = JSON.parse(
      sessionStorage.getItem('userExtraInfo') as string
    );
    this.articleService.getArticles().subscribe({
      next: (response: Article[]) => {
        this.articles = _.cloneDeep(response);
        this.originalArticles = _.cloneDeep(response);
        this.featuredArticles = response.filter(
          (article: Article) => article.isFeatured
        );
        this.stateManagementService.articlesCount.set(this.articles.length);
        if (this.showBookmarks) {
          this.articles = this.articles.filter((article: Article) =>
            this.userExtraInfo.bookmarks?.includes(article.id)
          );
        }
        if (this.userExtraInfo.role === 'writer') {
          this.articles = this.articles.filter(
            (article: Article) =>
              article.authorEmail === this.userExtraInfo.email
          );
          this.originalArticles = _.cloneDeep(this.articles);
        }
      },
      error: () => {
        alert('Something went wrong !!');
      },
    });
  }

  search() {
    this.articles = this.originalArticles;
    if (this.searchText) {
      if (this.searchCriteria === 'title') {
        this.articles = this.articles.filter((article: Article) =>
          article.title.toUpperCase().includes(this.searchText.toUpperCase())
        );
      } else {
        this.articles = this.articles.filter((article: Article) =>
          article.author.toUpperCase().includes(this.searchText.toUpperCase())
        );
      }
    }
  }

  toggleBookmark(id: number) {
    this.changeUserExtraInfo(id);
  }

  private changeUserExtraInfo(id: number) {
    let userBookmarkInfo = _.cloneDeep(this.userExtraInfo);
    if (this.userExtraInfo.bookmarks?.includes(id)) {
      this.userExtraInfo.bookmarks = this.userExtraInfo.bookmarks?.filter(
        (bookmarkId: number) => bookmarkId !== id
      );
    } else {
      this.userExtraInfo.bookmarks?.push(id);
    }
    let user = JSON.parse(
      sessionStorage.getItem(
        `firebase:authUser:${firebaseConfig.apiKey}:[DEFAULT]`
      ) as string
    );
    this.authService.insertUserData(this.userExtraInfo, user.uid).subscribe({
      next: () => {
        sessionStorage.setItem(
          'userExtraInfo',
          JSON.stringify(this.userExtraInfo)
        );
      },
      error: () => {
        this.userExtraInfo = userBookmarkInfo;
        alert('Something went wrong!!');
      },
    });
  }
}
