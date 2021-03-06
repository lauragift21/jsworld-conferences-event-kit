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

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Stage, Talk } from '@lib/types';
import { addMinutes } from 'date-fns';
import styles from './styles.module.css';
import Select from '../Select';
import TalkCard from '../TalkCard';
import { SHORT_DATE } from '@lib/constants';

type Props = {
  allStages: Stage[];
};

export default function ScheduleSidebar({ allStages }: Props) {
  const router = useRouter();
  const [currentStageSlug, setCurrentStageSlug] = useState(router.query.slug);
  const currentStage = allStages.find((s: Stage) => s.slug === currentStageSlug) as Stage;
  
  useEffect(() => {
    setCurrentStageSlug(router.query.slug);
  }, [router.query.slug]);
  
  let startDate = new Date(currentStage.date);
  const timeBlocks = currentStage.schedule.reduce((allBlocks: any, talk) => {
    talk.start = startDate
    talk.end = addMinutes(talk.start, talk.duration || 0)
    startDate = talk.end;
    let talkStart = (startDate).toISOString();
    allBlocks[talkStart] = [...(allBlocks[talkStart] || []), talk];
    return allBlocks;
  }, {});

  return (
    <div className={styles.schedule}>
      <h3 className={styles.header}>Schedule</h3>
      <p className={styles.shortdate}>{SHORT_DATE}</p>
      <Select
        aria-label="Select a stage"
        value={currentStageSlug}
        onChange={e => {
          const slug = e.target.value;
          setCurrentStageSlug(slug);
          router.push(`/stage/${slug}`);
        }}
      >
        {allStages.map(stage => (
          <option key={stage.slug} value={stage.slug}>
            {stage.name}
          </option>
        ))}
      </Select>
      <div className={styles.talks}>
        {Object.keys(timeBlocks).map((startTime: string) => (
        <div key={startTime}>
            {timeBlocks[startTime].map((talk: Talk, index: number) => (
              <TalkCard key={talk.title} talk={talk} showTime={index === 0} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
