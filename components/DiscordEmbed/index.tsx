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


import WidgetBot from '@widgetbot/react-embed';
import { Client } from '@widgetbot/embed-api'
import { DISCORD_SERVER_ID, DISCORD_CHANNEL_ID } from '@lib/constants';
import styles from './styles.module.css';

const onAPI = (api: Client) => {
  api = api
  api.on('signIn', user => {
    console.log(`Signed in as ${user.name}`, user)
  })
}

export default function DiscordEmbed() {
  return (
      <WidgetBot
        server={DISCORD_SERVER_ID}
        channel={DISCORD_CHANNEL_ID}
        onAPI={onAPI}
        width={400}
        className={styles.container}
      />
  )
}
