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

import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';
import { SponsorArray } from '@lib/types';
import styles from './styles.module.css';
import { urlFor } from '@lib/cms-api';

function SponsorCard({ sponsors }: Props) {
  const iteratesponsors = sponsors[0].items;
  return (
    <div className={styles.grid}>
      {iteratesponsors.map(sponsor => (
        <Link key={sponsor.name} href={`/expo/${sponsor.slug}`}>
          <a
            role="button"
            tabIndex={0}
            className={cn(styles.card)}
          >
            <div className={styles.imageWrapper}>
              <Image
                alt={sponsor.name}
                src={urlFor(sponsor.cardImage).url() || ''}
                className={cn(styles.image)}
                loading="lazy"
                title={sponsor.name}
                width={900}
                height={500}
              />
            </div>
              <div className={styles.cardBody}>
                <div>
                  <h2 className={styles.name}>{sponsor.name}</h2>
                  <p className={styles.description}>{sponsor.description}</p>
                </div>
              </div>
          </a>
        </Link>
      ))}
    </div>
  );
}

type Props = {
  sponsors: SponsorArray[];
};

export default function SponsorsGrid({ sponsors }: Props) {

  const sponsorTier = sponsors.reduce((allTiers: any, sponsor) => {
    allTiers[sponsor.tier] = [...(allTiers[sponsor.tier] || []), sponsor];
    return allTiers;
  }, {});

  return (
    <>
      {Object.keys(sponsorTier).map((tier: string) => (
        <div key={tier} className={styles.sponsorRow}>
          <div className={styles.rowHeader}>
            <h2 className={styles.sponsorName}>{tier}</h2>
          </div>
          <SponsorCard sponsors={sponsorTier[tier]} />
        </div>
      ))}
    </>
  );
}
