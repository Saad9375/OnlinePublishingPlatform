import { computed, Injectable, signal } from '@angular/core';
import { Article } from '../../models/article.model';

@Injectable({
  providedIn: 'root',
})
export class StateManagementService {
  articlesCount = signal<number>(0);
  selectedArticle = signal<any>({});
  constructor() {}
}
