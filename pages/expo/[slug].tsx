/**
 * Copyright 2020 Vercel Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { GetStaticProps, GetStaticPaths } from 'next';

import Page from '@components/page';
import SponsorSection from '@components/sponsor-section';
import Layout from '@components/layout';

import { getAllSponsors } from '@lib/cms-api';
import { Sponsor, SponsorArray } from '@lib/types';
import { META_DESCRIPTION, BRAND_NAME } from '@lib/constants';

type Props = {
  sponsors: SponsorArray;
  sponsor: Sponsor
};

export default function SponsorPage({ sponsor }: Props) {
  const meta = {
    title: `Expo - ${BRAND_NAME}`,
    description: META_DESCRIPTION
  };

  return (
    <Page meta={meta}>
      <Layout>
        <SponsorSection sponsor={sponsor} />
      </Layout>
    </Page>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug;
  const expandedSponsors = await getAllSponsors()
  const sponsors = expandedSponsors.map((s: SponsorArray) => {
    return s.items.flatMap(item => {
      return item || null
    })
  })

  const sponsor = sponsors.flat().find((s: Sponsor) => s.slug === slug) || null;

  if (!sponsor) {
    return {
      notFound: true
    };
  }
  
  return {
    props: {
      sponsor,
      sponsors
    },
    revalidate: 60
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const sponsors = await getAllSponsors();
  const sponsor = sponsors.map((s: SponsorArray) => {
    return s.items.flatMap(item => {
      return item.slug || null
    })
  })
  let sponsored = sponsor.flat();
  const slugs = sponsored.map((s: Sponsor) => ({ params: { slug: JSON.stringify(s) } }));
  return {
    paths: slugs,
    fallback: 'blocking'
  };
};
