'use strict';

import 'babel-polyfill'

module.exports.alert = (event, context, callback) => {

  const rp = require('request-promise');
  const parser = require('xml2json');
  const moment = require('moment')

  const sendHook = async (item) => {

    const options = {
      method: 'POST',
      uri: process.env.hookUrl,
      body: {
        title : item.title,
        text : 'CVSS Score is ' + item['sec:cvss'].score + '<br>' + item.title  + '<br>' + item['rdf:about']
      },
      json: true
    };

    await rp(options)
  }

  const main = async() => {

    const venderId = process.env.venderId
    
    const yesterday = moment().add(9,'hours').subtract(1, 'days'); // 9時間足してJSTにしてそこから1日ひく
    
    const url = 'http://jvndb.jvn.jp/myjvn?rangeDateFirstPublished=n&rangeDatePublic=n&rangeDatePublished=n&method=getVulnOverviewList&lang=ja' +
                '&dateFirstPublishedEndM=' + yesterday.get('month') + 
                '&dateFirstPublishedEndD=' + yesterday.get('date') + 
                '&dateFirstPublishedStartY=' + yesterday.get('year') + 
                '&dateFirstPublishedStartM=' + yesterday.get('month') + 
                '&dateFirstPublishedStartD=' + yesterday.get('date') + 
                '&dateFirstPublishedEndY=' + yesterday.get('year') + 
                '&vendorId=' + venderId
    
    const res = await rp(url)
    const obj = JSON.parse(parser.toJson(res))

    if (Array.isArray(obj['rdf:RDF'].item) === false){
      sendHook(obj['rdf:RDF'].item)
    } else {
      obj['rdf:RDF']['item'].map(item =>{
        sendHook(item)
      })      
    }
    callback();
  }
  
  main()
}
  