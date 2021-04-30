import fs from 'fs';
import request from 'request';
import path from 'path';

import sanityClient from '@sanity/client';
import localClient from 'part:@sanity/base/client';
import slugify from 'slugify';

const BlocksToPlainText = (blocks = []) =>
  blocks
    .map(block => {
      // if it's not a text block with children,
      // return nothing
      if (block._type !== 'block' || !block.children) {
        return '';
      }
      // loop through the children spans, and join the
      // text strings
      return block.children.map(child => child.text).join('');
    })
    .join('\n\n');

const ppClient = sanityClient({
  projectId: 'ta7mxbws',
  dataset: 'production',
  useCdn: true
});

const updateCompanies = async ({ localCompanies, existingTalks }) => {
  // let's accumulate all companies
  console.log('Updating companies');
  const companies = (
    await ppClient.fetch(
      `
    *[_type=="client" && _id in $companies]{
      ...,
      'logo': logo.asset->
    }`,
      {
        companies: [
          ...new Set(
            existingTalks
              .reduce((allCompanies, talk) => {
                const talkCompanies = talk.speakers.map(speaker => speaker.companyId);
                return [...allCompanies, ...talkCompanies];
              }, [])
              .filter(company => !!company)
          )
        ]
      }
    )
  ).map(async company => {
    // Here we need to check if we already have this company or not
    // if we have it then we update it =>
    //    caveat: we may not be able to update the logo (https://www.sanity.io/docs/assets#41e1c8101a47)
    // if we don't then we create it but first we need to upload its logo
    const id = company._id;
    const existingCompany = localCompanies.find(({ _id }) => _id === id);

    if (existingCompany) {
      return localClient
        .patch(id)
        .set({
          name: company.name,
          slug: {
            current: slugify(company.name).toLowerCase()
          },
          ...(company.website ? { website: company.website } : {})
        })
        .commit();
    } else {
      const filePath = path.join(__dirname, 'tmp', company.logo.originalFilename);
      await new Promise((resolve, reject) => {
        // push an operation to upload the logo
        request.head(company.logo.url, (err, path) => {
          request(company.logo.url).pipe(fs.createWriteStream(filePath)).on('close', resolve);
        });
      });
      const logoId = (
        await localClient.assets.upload('image', fs.createReadStream(filePath), {
          filename: path.basename(filePath),
          test: 'foo'
        })
      )._id;
      return localClient.createIfNotExists({
        _type: 'company',
        _id: id,
        name: company.name,
        slug: {
          current: slugify(company.name).toLowerCase()
        },
        ...(company.website ? { website: company.website } : {}),
        logo: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: logoId
          }
        },
        cardImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: logoId
          }
        }
      });
    }
  });
};

const updateSpeakers = async ({ localSpeakers, existingTalks }) => {
  // Accumulate all speakers
  console.log('Updating speakers');
  const speakers = (
    await ppClient.fetch(
      `
      *[_id in $speakers]{
        ...,
        'image': image.asset->
      }
  `,
      {
        speakers: existingTalks
          .reduce((allSpeakers, { speakers }) => [...allSpeakers, ...speakers], [])
          .map(({ speakerId }) => speakerId)
      }
    )
  ).map(async speaker => {
    const id = speaker._id;
    const existingSpeaker = localSpeakers.find(({ _id }) => _id === id);

    if (existingSpeaker) {
      return localClient
        .patch(id)
        .set({
          name: speaker.name,
          bio: BlocksToPlainText(speaker.bio),
          slug: {
            current: slugify(speaker.name).toLowerCase()
          },
          title: speaker.title,
          ...(speaker.twitter ? { twitter: speaker.twitter } : {}),
          ...(speaker.github ? { github: speaker.github } : {}),
          ...(speaker.company
            ? {
                company: {
                  _type: 'reference',
                  _ref: speaker.company._ref
                }
              }
            : {})
        })
        .commit();
    } else {
      const filePath = path.join(__dirname, 'tmp', speaker.image.originalFilename);
      await new Promise((resolve, reject) => {
        // push an operation to upload the logo
        request.head(speaker.image.url, (err, path) => {
          request(speaker.image.url).pipe(fs.createWriteStream(filePath)).on('close', resolve);
        });
      });
      const imageId = (
        await localClient.assets.upload('image', fs.createReadStream(filePath), {
          filename: path.basename(filePath),
          test: 'foo'
        })
      )._id;
      return localClient.createIfNotExists({
        _type: 'speaker',
        _id: id,
        name: speaker.name,
        bio: BlocksToPlainText(speaker.bio),
        slug: {
          current: slugify(speaker.name).toLowerCase()
        },
        title: speaker.title,
        ...(speaker.twitter ? { twitter: speaker.twitter } : {}),
        ...(speaker.github ? { github: speaker.github } : {}),
        ...(speaker.company
          ? {
              company: {
                _type: 'reference',
                _ref: speaker.company._ref
              }
            }
          : {}),
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageId
          }
        }
      });
    }
  });
};

const updateTalks = async ({ localTalks, existingTalks }) => {
  // existingTalks contains all the talks from the next dataset
  // what we need to do: for Each talk, check if we already have it or not, then if we do have it update it, if we don't create it
  // no need to upload stuff or create other things because by this time we already have all companies and all speakers that we need
  await Promise.all(
    existingTalks.map(talk => {
      const id = talk._id;
      const existingTalk = localTalks.find(({ _id }) => _id === id);

      if (existingTalk) {
        console.log(talk.speakers);
        return localClient
          .patch(id)
          .set({
            title: talk.title,
            description: BlocksToPlainText(talk.description),
            speakers: talk.speakers.map((speaker, idx) => ({
              _type: 'reference',
              _ref: speaker.speakerId,
              _key: `${idx}`
            }))
          })
          .unset(['speaker'])
          .commit();
      } else {
        return localClient.createIfNotExists({
          _type: 'talk',
          _id: id,
          title: talk.title,
          description: BlocksToPlainText(talk.description),
          speakers: talk.speakers
        });
      }
    })
  );
};

// fetch jobs from secondarySanity
const updateJobs = async () => {
  
}

const getLocalCompanies = async () =>
  await localClient.fetch(`*[_type=="company"]{
  ...,
  'logo': logo.asset->
}`);

const getLocalSpeakers = async () =>
  await localClient.fetch(`*[_type=="speaker"]{
  ...,
  'logo': logo.asset->
}`);

const getLocalTalks = async () => await localClient.fetch(`*[_type=="talk"]`);

const run = async () => {
  const localCompanies = await getLocalCompanies();
  const localSpeakers = await getLocalSpeakers();
  const localTalks = await getLocalTalks();

  // Here we need to do stuff
  //
  // 0. Get a snapshot of what we currently have
  // 1. Load the data to import DONE (missing Jobs)
  // 2. Find the entities we actually want to sync
  // 3. Upload their assets if not yet present
  // 4. Create or update the document and add a reference to that new asset
  //

  const existingTalks = await ppClient.fetch(
    (
      await ppClient.fetch(`*[_type == 'datasource' && slug.current == $datasource][0]`, {
        datasource: 'js-world-conference-africa-2021-or-talks'
      })
    ).query
  );

  // What do we want to sync?
  // - speaker -> Second
  // - talk -> Third

  const context = {
    localCompanies,
    localSpeakers,
    localTalks,
    existingTalks
  };
  await updateCompanies(context);
  await updateSpeakers(context);
  await updateTalks(context);

  console.log(await getLocalCompanies());
};

run();
