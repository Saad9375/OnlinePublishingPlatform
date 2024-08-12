import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleAdvertisementComponent } from './article-advertisement.component';

describe('ArticleAdvertisementComponent', () => {
  let component: ArticleAdvertisementComponent;
  let fixture: ComponentFixture<ArticleAdvertisementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleAdvertisementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArticleAdvertisementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
