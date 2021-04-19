import { groq } from 'next-sanity'

export const getAllSpeakersQuery = groq`*[_type=="conference" && slug == "jsworld-conference-africa-2021"][0]{
  ...{
    'slots': coalesce(coalesce(schedule, [])[0],{}).slots + coalesce(coalesce(schedule, [])[1].slots, []) + coalesce(coalesce(schedule, [])[2].slots, []) + coalesce(coalesce(schedule, [])[3].slots, []) + coalesce(coalesce(schedule, [])[4].slots, [])
  }
}{
  slots[] {
    _id,
    ...coalesce(talk->, freestyleitem){
      ...,
      'speakers': select(
        defined(speakers) && (count(speakers) > 0) && defined(speaker) && speaker._ref => (speakers + [speaker]),
        defined(speakers) && (count(speakers) > 0) && (!defined(speaker) || !defined(speaker._ref)) => speakers,
        (!defined(speakers) || count(speakers) == 0) && (defined(speaker) || defined(speaker._ref)) => [speaker],
        []
      )
    }
  }
}{
  slots[] {
    'talk': {
      description,
      'title': coalesce(shortTitle, title)
    },
    '_id': coalesce(_id, 'free-form-item-id'),
    (speakers)[]->{
      'company': company->.name,
      bio,
      'slug': slug.current,
      image,
      name,
      description,
      twitter,
      github,
      'title': title  + select(
        _type == 'colleague' => ' at Passionate People',
        defined(client) => select(isFounderOrCreator => " of ", " at ") + client->name,
        defined(company) => select(isFounderOrCreator => " of ", " at ") + company->name,
        ''
      )
    }
  }
}{
  slots[count(speakers) > 0]{
    ...{
      talk,
     ...speakers[0]
    }
  }
}.slots | order(slots)`

export const getAllJobsQuery = groq`*[_type=="job" &&
  ('jsworld' match tags || 'jsworld' in tags) &&
  ('africa' match tags || 'africa' in tags) &&
  ('job-board' match tags || 'job-board' in tags)
] {
  'id': _id,
  title,
  description,
  'link': url,
  'companyName': client->.name,
  discord,
  rank,
  'image': image.asset->,
} | order (date desc)|[0...100]`

export const getAllSponsorsQuery = groq`*[_type=="conference" && slug == "jsworld-conference-africa-2021"][0]{
  sponsors[]{
    'tier': title,
    items[]{
      ...company->{
      	name,
        description,
        'slug': slug.current,
        website,
        callToAction,
     		callToActionLink,
        discord,
        youtubeSlug,
      	'cardImage': logo,
        logo,
        links[]{
      	'text': label,
      	'url': destination
    }
    	}
    }
  }
}.sponsors
`;
export const getAllStagesQuery = groq`*[_type == "stage"]{
        name,
        "slug": slug.current,
        stream,
        discord,
        schedule[]->{
          title,
          start,
          end,
          speakers[]->{
            name,
            "slug": slug.current,
            image
          }
        }
      }`