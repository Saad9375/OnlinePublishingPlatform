import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { Article } from '../shared/models/article.model';
import { StateManagementService } from '../shared/services/state-management/state-management.service';
import _ from 'lodash';
import { AuthService } from '../shared/services/auth/auth.service';

@Component({
  selector: 'app-article-details',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './article-details.component.html',
  styleUrl: './article-details.component.scss',
})
export class ArticleDetailsComponent implements OnInit {
  article!: Article;
  userExtraInfo!: any;

  constructor(
    private stateManagementService: StateManagementService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.article = this.stateManagementService.selectedArticle();
    this.userExtraInfo = JSON.parse(
      sessionStorage.getItem('userExtraInfo') as string
    );
  }

  get isBookmark(): boolean {
    let isBookmark = false;
    if (this.article) {
      isBookmark = !!this.userExtraInfo?.bookmarks?.includes(this.article.id);
    }
    return isBookmark;
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
        'firebase:authUser:AIzaSyBuE8Z8rhoJubTRcIq_ZrJ4Qz11cbu2H48:[DEFAULT]'
      ) as string
    );
    this.authService
      .insertUserData(
        this.userExtraInfo,
        user.uid,
        user.stsTokenManager.accessToken
      )
      .subscribe({
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
