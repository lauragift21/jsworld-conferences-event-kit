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

import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { format, isBefore, isAfter } from 'date-fns';
import { Talk } from '@lib/types';
import styles from './talk-card.module.css';
import { urlFor } from '@lib/cms-api';

type Props = {
  key: string;
  talk: Talk;
  showTime: boolean;
};

const formatDate = (date: Date) => {
  // https://github.com/date-fns/date-fns/issues/946
  return format(date, "h:mmaaaaa'm'");
};

export default function TalkCard({ talk: { title, speaker, start, end }, showTime }: Props) {
  const [isTalkLive, setIsTalkLive] = useState(false);
  const [startAndEndTime, setStartAndEndTime] = useState('');

  useEffect(() => {
    const now = Date.now();
    setIsTalkLive(isAfter(now, start) && isBefore(now, end));
    setStartAndEndTime(`${formatDate(start)} – ${formatDate(end)}`);
  }, []);
  
  const talkLink = speaker ? `/speakers/${speaker.slug}` : '';

  return (
    <div key={title} className={styles.talk}>
      {showTime && <p className={styles.time}>{startAndEndTime || <>&nbsp;</>}</p>}
      <Link href={talkLink}>
        <a
          className={cn(styles.card, {
            [styles['is-live']]: isTalkLive
          })}
        >
          <div className={styles['card-body']}>
            <h4 title={title} className={styles.title}>
              {title}
            </h4>
            <div className={styles.speaker}>
              <div className={styles['avatar-group']}>
                <div key={speaker.slug} className={styles['avatar-wrapper']}>
                  <Image
                    loading="lazy"
                    alt={speaker.slug}
                    className={styles.avatar}
                    src={urlFor(speaker.image).width(24).height(24).url() || ''}
                    title={speaker.slug}
                    width={24}
                    height={24}
                  />
                </div>
              </div>
              <h5 className={styles.name}>
                {speaker.name}
              </h5>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
}
