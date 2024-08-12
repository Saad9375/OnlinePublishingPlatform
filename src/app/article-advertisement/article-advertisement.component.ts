import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Article } from '../shared/models/article.model';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { StateManagementService } from '../shared/services/state-management/state-management.service';

@Component({
  selector: 'app-article-advertisement',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './article-advertisement.component.html',
  styleUrl: './article-advertisement.component.scss',
})
export class ArticleAdvertisementComponent {
  @Input() signedInUser!: any;
  @Input() article!: Article;
  @Output() toggleEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private stateMnagementService: StateManagementService,
    private router: Router
  ) {}
  toggleBookmark() {
    this.toggleEvent.emit(this.article.id);
  }

  get isBookmark(): boolean {
    let isBookmark = false;
    if (this.article) {
      isBookmark = !!this.signedInUser?.bookmarks?.includes(this.article.id);
    }
    return isBookmark;
  }

  articleSelected() {
    this.stateMnagementService.selectedArticle.set(this.article);
    this.router.navigate(['/article-details']);
  }
}
