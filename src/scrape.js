import cheerio from 'cheerio';
import _ from 'lodash';
import request from 'request';
import promisify from './promisify';
import timeout from './timeout';
import pmongo from 'promised-mongo';

const db = pmongo('schwab');
let indexCreated = false;

const prequest = promisify(request.defaults({
  timeout : 10000 // wait max of 8 seconds before hanging up
}));

const reOGProp = /^\w+[:\w]+\w+$/;
const reHTMLContent = /text\/html/;

const get = url => prequest({
  method : 'GET',
  followAllRedirects: true,
  jar: request.jar(),
  url : url,
  headers : {
    'User-Agent' : "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410."
  }
});

export async function scrape(site) {

  let siteName = site.url.match(/\/\/.+\.(.*)\./)[1];

  let col = db.collection(siteName);

  await col.createIndex({'link' : 1});

  let response = await get(site.url);

  let parse = response => {
    if (response.statusCode === 200 && reHTMLContent.test(response.headers['content-type'])) {

      let $ = cheerio.load(response.body);

      let posts = $(site.post.id).map((index, post) => {
        let attr, date = $(post).find(site.post.date);
        return {
          title : $(post).find(site.post.title).text(),
          date : (attr = site.post.dateAttribute) ? date.attr(attr) : date.text(),
          link : $(site.post.link).attr('href'),
          baseUrl : site.url
        }
      }).get();

      let nextUrl = $(site.next).attr('href');

      let hasNextUrl = !!nextUrl;

      if (site.addBaseUrl && hasNextUrl) {
        nextUrl = site.url + nextUrl;
      }

      return { posts, nextUrl };
    } else {
      return { posts : [] };
    }
  }

  let { posts, nextUrl } = parse(response);

  await* posts.map(::col.insert);

  while(nextUrl) {
    console.log('next page... ' + nextUrl);
    let next = parse(await get(nextUrl));
    console.log(next.posts.length);
    await* next.posts.map(::col.insert);
    nextUrl = next.nextUrl;
    await timeout(1000);
  }

}
