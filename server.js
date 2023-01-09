const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
const server = http.Server(app);
const fs = require('fs');
const sensor = require('node-dht-sensor');
// const axios = require('axios');
// const cheerio = require('cheerio');

// Configuration
const DRIK_URL = "https://www.drikpanchang.com/panchang/month-panchang.html";
const DRIK_TELUGU_URL = 'https://www.drikpanchang.com/telugu/panchanga/telugu-month-panchanga.html';
server.listen(process.env.PORT || 8000, () => {
  console.log(`[ server.js ] Listening on port ${server.address().port}`);
  //var days = getPanchangamForYear(2023);
});
function getTrimmedText(text) {
    if (text.indexOf(',') !== -1) {
        return text.substring(text.indexOf(',') + 1).trim();
    }
    return text.trim();
}
var dpHeaderId = '#dpPHeaderId';
var masa_selector = '#dpPHeaderId > div.dpPHeaderContent.dpFlex > div.dpPHeaderLeftWrapper > div.dpPHeaderLeftContent.dpFlex > div:nth-child(2) > div.dpPHeaderLeftTitle';
var tithi_selector ='#dpPHeaderId > div.dpPHeaderContent.dpFlex > div.dpPHeaderLeftWrapper > div.dpPHeaderLeftContent.dpFlex > div:nth-child(2) > div:nth-child(2)';
var year_selector = '#dpPHeaderId > div.dpPHeaderContent.dpFlex > div.dpPHeaderLeftWrapper > div.dpPHeaderLeftContent.dpFlex > div:nth-child(2) > div:nth-child(3)';




/*
async function getPanchangamForDay(dt) {
    var sDate = dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear();
    var obj = {};
    //var myPromise =  new Promise(async function(resolve, reject){
        var response = await axios(DRIK_TELUGU_URL + '?date=' + sDate);
            const html_data = response.data;
            const $ = cheerio.load(html_data);

            var header = $(dpHeaderId);
            var month_ele_text = header.find(masa_selector).text();

            var masa_name = getTrimmedText(month_ele_text);
            // console.log('masa',masa_name);

            var paksha_ele_text = header.find(tithi_selector).text();
            // console.log('paksha_ele_text', paksha_ele_text);
            var paksha = paksha_ele_text.substring(0, paksha_ele_text.indexOf(' ')).trim();
            // paksha.replace('Pakshamulu','');
            var tithi = paksha_ele_text.substring(paksha_ele_text.indexOf(',') + 1).trim();
            // console.log('paksha', paksha)
            // console.log('tithi',  tithi)

            var year_ele_text = header.find(year_selector).text().trim();
            // console.log('year_ele_text', year_ele_text);
            var year = year_ele_text.substring(year_ele_text.indexOf(' '), year_ele_text.indexOf(',') - 1);
            // console.log('year', year);
            
            var focused_day = $('body').find($('.dpFocusedDay'));
            var sunrise = $(focused_day).find($('.dpSunriseTiming')).text();
            var sunset = $(focused_day).find($('.dpSunsetTiming')).text();
            var rashi = $(focused_day).find($('.dpMoonTiming')).text();
            if (rashi.indexOf(' ') != -1) {
                rashi = rashi.substring(0, rashi.indexOf(' ')-1).trim();
            }
            var nakshatra = $(focused_day).find($('.dpNakshatra')).text();
            //console.log("nakshatra", nakshatra)
            nakshatra = nakshatra.substring(0, nakshatra.indexOf(' ')).trim();
            // console.log('dpSunriseTiming', sunrise)
            // console.log('dpSunsetTiming', sunset);
            // console.log('rashi', rashi);
            // console.log('dpNakshatra', nakshatra);

            obj.date = new Date(dt);
            obj.year = year;
            obj.masa = masa_name;
            obj.paksha = paksha;
            obj.thiti = tithi;
            obj.sunrise = sunrise;
            obj.sunset = sunset;
            obj.raasi = rashi;
            obj.nakshatra = nakshatra;
            
       // });
    // });

    return obj;
    
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function getPanchangamForMonth(dt) {
    var days=[];
    var ndt = new Date(dt);
    ndt.setDate(1);
    var sameMonth=true;

    while (sameMonth) {
        console.log("Getting panchang for date", ndt);
        var pday = await getPanchangamForDay(ndt);

        //await pday.then(async o=> {
            //console.log(o);
            days.push(pday);
            //console.log("waiting....")
            await delay(5000);
    
            ndt.setDate(ndt.getDate() + 1);
            if (dt.getMonth() != ndt.getMonth()) {
                sameMonth = false;
            }
        //})
     //   console.log(ndt);
    }
    
    return days;
}

async function getPanchangamForYear(year) {
    console.log("year", year);
    var dt = new Date();
    var years = [];
    dt.setFullYear(year);
    dt.setMonth(0);
    dt.setDate(1);
    for (var i = 0; i < 12; i++) {
        console.log(new Date(), "getting panchangam for month ", i);
        dt.setMonth(i);
        dt.setDate(1);
        var panchangam = await getPanchangamForMonth(dt)
        var obj = {
            month : i + 1,
            panchangam : panchangam
        }
        years.push(obj);

    }
    var jsonContent = JSON.stringify(years);
    fs.writeFileSync(`./data/${year}.json`, jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("JSON file has been saved.");
    });
}

*/


app.get('/temp', async (req, res) => {
    //await new Promise((resolve, reject) => {
        res.setHeader('Content-Type', 'application/json');
        var resp = {};
        var sensorData = sensor.read(11, 4) //, function(err, temperature, humidity) {
            // console.log(temperature, humidity)
            if (sensorData) {
              resp.success = true;
              resp.temperature=sensorData.temperature;
              resp.humidity=sensorData.humidity;
            } else {
                resp.success = false;
            }
            res.json(resp);
//            resolve(resp)
 //       });
    // }).then(resp=> {
    //     //console.log("sending resp", resp)
    //     res.setHeader('Content-Type', 'application/json');
    //     res.send(JSON.stringify(resp))
    // })

})
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});
app.get('/masam.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'data/masam.json'));
});
app.get('/test.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/test.html'));
});
app.get('/panchang.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/panchang.js'));
});
app.get('/suncalc.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/suncalc.js'));
});

app.get('/lunarphase.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/lunarphase.js'));
});
app.get('/jquery.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/jquery.js'));
});
app.get('/popper.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/popper.js'));
});
app.get('/popper.min.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/popper.js'));
});
app.get('/bootstrap.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/bootstrap.js'));
});
app.get('/bootstrap.min.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/bootstrap.js'));
});
app.get('/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/styles.css'));
});
app.get('/bootstrap.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/bootstrap.css'));
});
app.get('/new.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/new.css'));
});
app.get('/reset.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/reset.css'));
});

var imagesRootPath = '/home/rammohanyadavalli/Pictures/slideshow';
app.get('/images', (req, res) => {
    imagesRootPath = path.join(__dirname, 'slideshow_images');
    let iPath = req.query.folder;
    let files = getFiles(imagesRootPath + '/' + iPath);
    res.send(files);
});
app.get('/showimage', function (req, res) {
//    console.log(`file path `, JSON.stringify(req.query))
     res.sendFile(req.query.imagePath);
});
function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}
