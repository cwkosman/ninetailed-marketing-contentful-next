/* eslint-disable @typescript-eslint/ban-ts-comment */
import get from 'lodash/get';

import { BlockRenderer } from '@/components/Renderer';
import { getPagesOfType, getPage } from '@/lib/api';
import { PAGE_CONTENT_TYPES } from '@/lib/constants';
import { IPage } from '@/types/contentful';

/* eslint-disable @typescript-eslint/ban-ts-comment */
import { previewData } from 'next/headers';

export default async function Page({ params }: { params: { slug: string } }) {
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

  if (!pageData) {
    return null;
  }
  const {
    banner,
    navigation,
    sections = [],
    footer,
  } = pageData.fields.content.fields;

  return (
    <div className="w-full h-full flex flex-col">
      {/* @ts-ignore */}
      {banner && <BlockRenderer block={banner} />}
      {/* @ts-ignore */}
      {navigation && <BlockRenderer block={navigation} />}
      <main className="grow">
        {/* @ts-ignore */}
        <BlockRenderer block={sections} />
      </main>
      {/* @ts-ignore */}

      {footer && <BlockRenderer block={footer} />}
    </div>
  );
}

export const generateStaticParms = async () => {
  const pages = await getPagesOfType({
    pageContentType: PAGE_CONTENT_TYPES.PAGE,
    childPageContentType: PAGE_CONTENT_TYPES.LANDING_PAGE,
  });

  const slugs = pages
    .filter((page) => {
      return page.fields.slug !== '/';
    })
    .map((page) => {
      return {
        slug: page.fields.slug.split('/')[1],
      };
    });
  return slugs;
};
