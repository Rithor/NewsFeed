import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ArticlePage.css';
import { categoryNames, formatDate, repeat } from '@app/utils';
import { ArticleCard } from '@components/ArticleCard/ArticleCard';
import classNames from 'classnames';
import { Hero } from '@components/Hero/Hero';
import { SidebarArticleCard } from '@components/SidebarArticleCard/SidebarArticleCard';
import { Title } from '@components/Title/Title';
import {
  useAdaptive,
  useAppDispatch,
  useAppSelector,
} from '@app/hooks';
import { fetchArticleItem } from '../actions';
import { fetchSamePlaceArticles } from '@features/samePlaceArticles/actions';
import { HeroSkeleton } from '@components/Hero/HeroSkeleton';
import { SkeletonText } from '@components/SkeletonText/SkeletonText';
import { ArticleCardSkeleton } from '@components/ArticleCard/ArticleCardSkeleton';
import { SidebarArticleCardSkeleton } from '@components/SidebarArticleCard/SidebarArticleCardSkeleton';
import { IArticle } from '@app/types';

export const ArticlePage = () => {
  const { id } = useParams();
  if (id == undefined) return null;

  const dispatch = useAppDispatch();
  const { articleItem, isLoading, error } = useAppSelector(
    (state) => state.articleItem
  );
  // todo: как то ограничить количество загружаемых элементов
  // так как отображается в мобильной версии всего 3 статьи
  // а грузится большее число данных
  const {
    samePlaceArticles,
    samePlaceArticlesIsLoading,
    samePlaceArticlesID,
  } = useAppSelector((state) => state.samePlaceArticles);

  useEffect(() => {
    dispatch(fetchArticleItem(id));
  }, [id]);
  useEffect(() => {
    if (articleItem.place?.id) {
      dispatch(fetchSamePlaceArticles(articleItem.place.id));
    }
  }, [articleItem]);

  const { isDesktop } = useAdaptive();

  // todo: сделать отдельную страницу c ошибкой
  if (error) {
    return <div>{error}</div>;
  }

  if (articleItem.id == 0) return null;

  let relatedArticles: IArticle[] = [];
  let relatedSidebarArticles: IArticle[] = [];
  if (samePlaceArticlesID === articleItem.place?.id) {
    const filtredSamePlaceArticles = samePlaceArticles?.filter(
      ({ id }) => id !== articleItem.id
    );
    relatedArticles = filtredSamePlaceArticles?.slice(0, 3);
    relatedSidebarArticles = filtredSamePlaceArticles?.slice(3, 9);
  }

  return (
    <article className="articlePage-wr">
      {isLoading ? (
        <HeroSkeleton hasImage />
      ) : (
        <Hero
          title={articleItem.title}
          image={articleItem.images[0].image}
        />
      )}

      <div className="container hero__info">
        {isLoading ? (
          <SkeletonText />
        ) : (
          <>
            <div className="hero__category">
              {categoryNames[articleItem.categories[0]]}
            </div>
            <div className="hero__date">
              {formatDate(articleItem.dates)}
            </div>
            <div className="hero__place">
              {articleItem.place?.title}
            </div>
          </>
        )}
      </div>

      <section className="articlePage grid container">
        <div
          className={classNames('articlePage__body', {
            'articlePage__body--whSidebarCards':
              !relatedSidebarArticles?.length &&
              !samePlaceArticlesIsLoading,
          })}
        >
          <div className="articlePage__description">
            {isLoading ? (
              <SkeletonText rowsCount={3} />
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html: articleItem.description,
                }}
              ></div>
            )}
          </div>

          <div className="articlePage__text">
            {isLoading ? (
              <SkeletonText rowsCount={18} />
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html: articleItem.body_text,
                }}
              ></div>
            )}
          </div>

          <div className="articlePage__tags-wr">
            {isLoading ? (
              <SkeletonText rowsCount={1} />
            ) : (
              articleItem.tags.map((tag) => (
                <div key={tag} className="articlePage__tags">
                  {tag}
                </div>
              ))
            )}
          </div>
        </div>

        {/* show Skeleton */}
        {isDesktop && samePlaceArticlesIsLoading && (
          <div className="relatedSidebarArticles">
            {repeat((i) => {
              return (
                <SidebarArticleCardSkeleton
                  key={i}
                  className="articlePage__sidebar-item sidebar-article-card--skeleton"
                />
              );
            }, 6)}
          </div>
        )}

        {/* show uploaded data */}
        {isDesktop && relatedSidebarArticles?.at(0) && (
          <div className="relatedSidebarArticles">
            {relatedSidebarArticles.map((article) => {
              return (
                <SidebarArticleCard
                  className="articlePage__sidebar-item"
                  key={article.id}
                  article={article}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* show Skeleton */}
      {samePlaceArticlesIsLoading && (
        <div className="relatedArticles container">
          <Title Component={'h2'} className="relatedArticles__header">
            смотрите также:
          </Title>
          <div className="grid">
            {repeat((i) => {
              return (
                <ArticleCardSkeleton
                  key={i}
                  hasImage={false}
                  className="articlePage__related-articles-item"
                />
              );
            }, 3)}
          </div>
        </div>
      )}

      {/* show uploaded data */}
      {relatedArticles?.at(0) && (
        <div className="relatedArticles container">
          <Title Component={'h2'} className="relatedArticles__header">
            смотрите также:
          </Title>
          <div className="grid">
            {relatedArticles.map((article) => {
              return (
                <ArticleCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  shortTitle={article.short_title}
                  category={article.categories[0]}
                  description={article.description}
                  dates={article.dates}
                  className="articlePage__related-articles-item"
                />
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
};
