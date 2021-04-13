export const SITE_URL = 'https://usa-jsworld-conference.vercel.app';
export const SITE_ORIGIN = process.env.SITE_ORIGIN || new URL(SITE_URL).origin;
export const TWITTER_USER_NAME = 'frontend_love';
export const BRAND_NAME = 'JSWorld Conference USA';
export const SITE_NAME_MULTILINE = ['JSWorld Conference', 'USA'];
export const SITE_NAME = 'JSWorld Conference';
export const META_DESCRIPTION =
  'United States\'s Premier Javascript Conference of 2021.';
export const SITE_DESCRIPTION =
  'JSworld Conference USA Online is the Largest & Most Epic JavaScript Conference and Community Event of 2021. Learn & Talk directly with the JavaScript Frontend Developer Leaders from around the world on Friday May 21, 2021.';
export const DATE = 'May 21, 2021';
export const SHORT_DATE = 'May 21 - 2:00pm CET';
export const FULL_DATE = 'May 21st 2pm Central Eastern Time (GMT+2)';
export const TWEET_TEXT = META_DESCRIPTION;
export const COOKIE = 'user-id';

// Remove process.env.NEXT_PUBLIC_... below and replace them with
// strings containing your own privacy policy URL and copyright holder name
export const LEGAL_URL = 'https://usa.jsworldconference.com/privacy-policy/';
export const COPYRIGHT_HOLDER = '';

export const CODE_OF_CONDUCT =
  'https://usa.jsworldconference.com/code-of-conduct';
export const REPO = 'https://github.com/sanity-io/sanity-template-nextjs-event';
export const SAMPLE_TICKET_NUMBER = 1234;
export const NAVIGATION = [
  {
    name: 'Stage A',
    route: '/stage/a'
  },
  {
    name: 'Stage C',
    route: '/stage/c'
  },
  {
    name: 'Stage M',
    route: '/stage/m'
  },
  {
    name: 'Stage E',
    route: '/stage/e'
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
