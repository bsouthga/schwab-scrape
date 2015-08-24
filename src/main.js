import { scrape } from './scrape';

// const sites = [
//   ,
//   '',
//   '',
//   '',
//   '',
//   'http://stephanieevergreen.com/',
//   'http://annkemery.com/',
//   'http://dataremixed.com/',
//   'http://fellinlovewithdata.com/',
//   'http://www.perceptualedge.com/blog/',
//   'http://vizwiz.blogspot.com/'
// ];

(async() => {

  await scrape({
    url : 'http://policyviz.com/',
    post : {
      id : 'article',
      date : '.entry-date',
      dateAttribute : 'datetime',
      title : '.entry-title',
      link : '.entry-title a'
    },
    next : '.next.page-numbers'
  }).catch(error => {throw error});


  // await scrape({
  //   url : 'http://www.storytellingwithdata.com',
  //   post : {
  //     id : '.post',
  //     date : '.date time.published',
  //     dateAttribute : 'datetime',
  //     title : '.entry-title',
  //     link : '.entry-title a'
  //   },
  //   next : '#nextLink',
  //   addBaseUrl : true
  // }).catch(error => {throw error});


  // await scrape({
  //   url : 'http://www.thefunctionalart.com/',
  //   post : {
  //     id : '.date-outer',
  //     date : '.date-header',
  //     title : '.post-title.entry-title',
  //     link : '.post-title.entry-title a'
  //   },
  //   next : '.blog-pager-older-link'
  // }).catch(error => {throw error});

  // await scrape({
  //   url : 'https://www.eagereyes.org/',
  //   post : {
  //     id : '.post.type-post',
  //     date : '.entry-date',
  //     dateAttribute : 'datetime',
  //     title : '.entry-title',
  //     link : '.entry-title a'
  //   },
  //   next : '.next.page-numbers'
  // }).catch(error => {throw error});



})().catch(error => console.log(error.stack));
