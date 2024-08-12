import { Component, Input } from '@angular/core';
import { Article } from '../shared/models/article.model';
import { StateManagementService } from '../shared/services/state-management/state-management.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-featured-article',
  standalone: true,
  imports: [],
  templateUrl: './featured-article.component.html',
  styleUrl: './featured-article.component.scss',
})
export class FeaturedArticleComponent {
  @Input() article!: Article;

  constructor(
    private stateMnagementService: StateManagementService,
    private router: Router
  ) {}

  articleSelected() {
    this.stateMnagementService.selectedArticle.set(this.article);
    this.router.navigate(['/article-details']);
  }
}
