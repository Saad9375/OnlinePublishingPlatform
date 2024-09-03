import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { Article } from '../shared/models/article.model';
import { StateManagementService } from '../shared/services/state-management/state-management.service';
import _ from 'lodash';
import { AuthService } from '../shared/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ArticlesService } from '../shared/services/articles/articles.service';
import { firebaseConfig } from '../app.config';

@Component({
  selector: 'app-article-details',
  standalone: true,
  imports: [HeaderComponent, RouterLink, FormsModule],
  templateUrl: './article-details.component.html',
  styleUrl: './article-details.component.scss',
})
export class ArticleDetailsComponent implements OnInit {
  article!: Article;
  userExtraInfo!: any;
  comments: Array<{ user: string; comment: string }> = [];
  newComment: string = '';
  user: any;

  constructor(
    private stateManagementService: StateManagementService,
    private authService: AuthService,
    private router: Router,
    private articlesService: ArticlesService
  ) {}

  ngOnInit() {
    this.article = this.stateManagementService.selectedArticle();
    if (!this.article.comments) {
      this.article.comments = [];
    }
    this.userExtraInfo = JSON.parse(
      sessionStorage.getItem('userExtraInfo') as string
    );
    this.user = JSON.parse(
      sessionStorage.getItem(
        `firebase:authUser:${firebaseConfig.apiKey}:[DEFAULT]`
      ) as string
    );
  }

  get isBookmark(): boolean {
    let isBookmark = false;
    if (this.article) {
      isBookmark = !!this.userExtraInfo?.bookmarks?.includes(this.article.id);
    }
    return isBookmark;
  }

  /**
   * @description used to submit a new comment
   * @memberOf PropertyDetailsComponent
   */
  submitComment() {
    if (this.newComment) {
      this.article.comments.push({
        user: this.user,
        comment: this.newComment,
      });
    }
    this.newComment = '';
    this.articlesService.addNewArticle(this.article).subscribe(() => {});
  }

  toggleBookmark() {
    let userBookmarkInfo = _.cloneDeep(this.userExtraInfo);
    if (this.isBookmark) {
      this.userExtraInfo.bookmarks = this.userExtraInfo.bookmarks.filter(
        (bookmarkId: number) => bookmarkId !== this.article?.id
      );
    } else {
      this.userExtraInfo.bookmarks.push(this.article?.id);
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

  edit() {
    this.stateManagementService.selectedArticle.set(this.article);
    this.router.navigate(['/edit-article'], { queryParams: { isEdit: true } });
  }
}
