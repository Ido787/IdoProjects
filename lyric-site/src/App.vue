<template>
  <div id="app">
    <img alt="Ido the champ" src="./assets/IdoParty.jpg" height="300" width="450">
    <div class="container">
      <input type="text" name="bandName" v-model="currBand" v-on:keyup.enter="onSearch" required>
      <label for="bandName"><b>:הכנס להקה</b></label>
      <br>
      <input type="text" name="songName" v-model="currSong" v-on:keyup.enter="onSearch" required>
      <label id="shortLabel" for="songName"><b>:הכנס שיר </b></label>
      <br>
      <button type="submit" @click="onSearch"
      >חפש</button>
    </div>

    <h1 id="title" class="songLines"><strong>{{ currTitle }}</strong></h1>
    <p v-if="shouldLyricsAppear" id="lyrics">{{ currLyrics }}</p>

    <go-top :size="50" :bottom="30"></go-top>
  </div>
</template>

<script>
import $ from "jquery";
import axios from 'axios';
import GoTop from '@inotom/vue-go-top';

export default {
  name: 'App',
  components: {
    GoTop
  },
  data() {
    return {
      currSong: 'clocks',
      currBand: 'coldplay',
      currLyrics: [],
      currTitle: '',
      currPage: {},
      unavailableSongMsgs: [
        'השיר לא נמצא במאגר. נסה שוב אח שלי הגיבור',
        'לא נורא חבר, ישנם שירים טובים יותר',
        '.ביפ בופ. לא מצאתי כלום. ביפ בופ',
        '?לא שמעת על שירונט',
        '.השיר לא נמצא במאגר או בכלל. אל תחפש אותו יותר בחיים',
        'רבּאבָּה (ربابة) הוא כלי נגינה בדואי, נחשב לכינור הבדואי והוא בעל מיתר יחיד. מוכר גם בשם סמסומיה (سمسم) שפירושו שומשום כיוון שבעת תחילת הנגינה ברבאבה אנשים מגיעים מכל עבר כדי להאזין כמו שומשום שמתפזר.  חח מעניין לא? נב השיר שלכם לא נמצא',
        '.הידעת? באתר זה הושקעו שעתיים לכתיבת הודעות למקרה והשיר לא נמצא. זאת אחת מהן',
        'BE HAPPY הו הו',
        'We couldn’t find your song, so we dispatched a team of highly trained monkeys to go find it',
        '!הצילו, חטף אותי מפתח האתר ואין לי איך לברוח',
        '找不到歌曲',
        'השיר הוא כמו אבא שלי, הלך להביא חלב ולא נראה מעולם לאחר מכן',
        'השיר שחיפשת לא נמצא, אולי תכתוב אותו בעצמך או משהו',
        'Africa by Toto את השיר הזה לא מצאתי, אבל תנסה את',
        'השיר שלך הוא כמו ג\'ון סינה, אני פשוט לא רואה אותו',
        'כי כבר בדקתי שם azlyricsהשיר לא נמצא, אבל אל תבדוק ב'
        ],
    }
  },
  methods: {
    onSearch() {
      this.getLyrics();
      this.updateTitle();
    },
    getLyrics() {
      axios.get(
        `https://www.azlyrics.com/lyrics/${this.currBand.toLowerCase().replace(/[ ']/g, '')}/${this.currSong.toLowerCase().replace(/[ ']/g, '')}.html`
      )
      .then(res => {
        $('#lyrics').empty();
        this.currPage = res.data;
        this.currLyrics = $(this.currPage).find('.ringtone').nextAll('div:first').text().split('\n');
        this.currLyrics.slice(2).forEach(lyric => {
          if(lyric == '') {
            $('</br>').appendTo('#lyrics');
          } else {
            $('<div></div>').text(lyric).addClass('songLines').appendTo('#lyrics');
          }
        })

      }, (err) => {
        console.log(err);
        this.currTitle = this.unavailableSongMsgs[Math.floor(Math.random() * this.unavailableSongMsgs.length)];
      })
      .catch(err => {
        console.log(err);
      });
    },
    updateTitle() {
      this.currTitle = `${this.currSong} by ${this.currBand}`;
    },
  },
  computed: {
    shouldLyricsAppear() {
      if(!this.currTitle) {
        return false;
      }
      let shouldAppear = true;
      this.unavailableSongMsgs.forEach((msg) => {
        if(this.currTitle === msg) {
          shouldAppear = false;
        }
      })
      return shouldAppear;
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
input, button {
  margin-top: 15px;
}
#shortLabel {
  margin-left: 14px;
}
.songLines {
  font-family: 'Comic Neue', cursive;
  color:black;
  font-size: 20px;
}
#title {
  font-size: 35px;
  text-transform: capitalize;
}
</style>
