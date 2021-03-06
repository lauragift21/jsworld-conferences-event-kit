export const SITE_URL = 'https://africa-jsworld-conference.vercel.app';
export const CONFERENCE_URL = 'https://africa.jsworldconference.com';
export const SITE_ORIGIN = process.env.SITE_ORIGIN || new URL(SITE_URL).origin;
export const TWITTER_USER_NAME = 'frontend_love';
export const BRAND_NAME = 'JSWorld Conference Africa';
export const SITE_NAME_MULTILINE = ['JSWorld Conference', 'Africa'];
export const SITE_NAME = 'JSWorld Conference';
export const META_DESCRIPTION =
  'JSworld Conference Africa will be the road to a more diverse future within the JavaScript industry.';
export const SITE_DESCRIPTION =
  'A Free Online JavaScript conference for a more Diverse and Equal future supported by Companies willing to invest.';
export const DATE = 'June 11, 2021';
export const SHORT_DATE = 'June 11 - 1:00pm WAT';
export const FULL_DATE = 'June 11th 1pm West Africa Time (GMT+1)';
export const TWEET_TEXT = META_DESCRIPTION;
export const COOKIE = 'user-id';
export const NEWSLETTER_ID = 'a0b95d59288c559f9a9089963c8f5543';
export const CREATESEND_USERNAME = 'ic0pHkOqZZsSOE9CFjYAPMhYo3PH2H7JuiQKkbd1mp3mZLBUnI01jNwRQQ7TIEKTXtdWVntDG0F1P2vp0P2HHpgcRldO9pg7DGiKHh9UozuKP+cKriVvBfIeLbH4H6a4yqGi+sL+4zq/Y49DcRvCFQ==';

// Remove process.env.NEXT_PUBLIC_... below and replace them with
// strings containing your own privacy policy URL and copyright holder name
export const LEGAL_URL = 'https://africa.jsworldconference.com/privacy-policy/';
export const COPYRIGHT_HOLDER = '';

export const CODE_OF_CONDUCT =
  'https://africa.jsworldconference.com/code-of-conduct';
export const REPO = 'https://github.com/sanity-io/sanity-template-nextjs-event';
export const SAMPLE_TICKET_NUMBER = 1234;
export const NAVIGATION = [
  {
    name: 'Stage A',
    route: '/stage/stage-a'
  },
  {
    name: 'Stage B',
    route: '/stage/stage-b'
  },
  {
    name: 'Schedule',
    route: '/schedule'
  },
  {
    name: 'Speakers',
    route: '/speakers'
  },
  {
    name: 'Expo',
    route: '/expo'
  },
  {
    name: 'Jobs',
    route: '/jobs'
  }
];

export type TicketGenerationState = 'default' | 'loading';
