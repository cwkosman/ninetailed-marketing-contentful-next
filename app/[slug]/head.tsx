/* eslint-disable @typescript-eslint/ban-ts-comment */
import get from 'lodash/get';
import { getPage } from '@/lib/api';
import { previewData } from 'next/headers';
import { PAGE_CONTENT_TYPES } from '@/lib/constants';

export default async function Head({ params }: { params: { slug: string } }) {
  const preview = previewData();
  const isPreviewMode = !!preview && preview.key === process.env.PREVIEW_SECRET;

  const rawSlug = get(params, 'slug', []) as string[];
  const slug = rawSlug.join('/');

  // @ts-ignore: 'await' expressions are only allowed within async functions
  const pageData = await getPage<IPage>({
    preview: isPreviewMode,
    slug: slug === '' ? '/' : slug,
    pageContentType: PAGE_CONTENT_TYPES.PAGE,
    childPageContentType: PAGE_CONTENT_TYPES.LANDING_PAGE,
  });

  const index = (pageData.fields.seo?.fields.no_index as boolean)
    ? 'noindex'
    : 'index';
  const follow = (pageData.fields.seo?.fields.no_follow as boolean)
    ? 'nofollow'
    : 'follow';

  return (
    <>
      <title>
        {pageData.fields.seo?.fields.title || pageData.fields.title}
      </title>
      <meta
        name="description"
        content={pageData.fields.seo?.fields.description}
      />
      <meta name="robots" content={`${index}${follow}`} />
    </>
  );
}
