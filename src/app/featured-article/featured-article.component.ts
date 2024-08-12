import { Component, Input } from '@angular/core';
import { Article } from '../shared/models/article.model';

@Component({
  selector: 'app-featured-article',
  standalone: true,
  imports: [],
  templateUrl: './featured-article.component.html',
  styleUrl: './featured-article.component.scss',
})
export class FeaturedArticleComponent {
  @Input() article!: Article;
}
