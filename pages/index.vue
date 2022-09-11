<template lang="html">
  <main v-if="loaded">
  <section :class="attr['section']">
    <div :class="attr['section__controller']">
      <div :class="attr['section__title']">
        <a href="#"@click.prevent="prevMonth(calendar[1].days[0])" :class="attr['section__title--small']">Prev</a> 
        {{ getMonth(calendar[1].days[0]) }}
        <a href="#"@click.prevent="nextMonth(calendar[1].days[0])" :class="attr['section__title--small']">Next</a>
      </div>

      <div :class="attr['section__todo-container']">
        <span :class="attr['section__label']">Input Todo</span>
        <input :class="attr['section__input-todo']" type="text" name="todo">
      </div>
      
      <div :class="attr['section__date-picker']">
        <div :class="attr['section__left']">
          <span>Start Date</span>
          <input type="date" name="end">
        </div>
        <div :class="attr['section__right']">
          <span>End Date</span>
          <input type="date" name="end">
        </div>
      </div>

      <div :class="attr['section__button-container']">
        <button :class="attr['section__button']"> Save</button>
        <button :class="[attr['section__button'], attr['section__button--override']]"> Override</button>
      </div>
      
    </div>
    <div :class="attr['section__calendar']">
      <table>
        <thead :class="attr['section__table-head']">
          <tr>
            <th :class="attr['section__table-head-cell']">Week</th>
            <th :class="attr['section__table-head-cell']">Sun</th>
            <th :class="attr['section__table-head-cell']">Mon</th>
            <th :class="attr['section__table-head-cell']">Tue</th>
            <th :class="attr['section__table-head-cell']">Wed</th>
            <th :class="attr['section__table-head-cell']">Thu</th>
            <th :class="attr['section__table-head-cell']">Fri</th>
            <th :class="attr['section__table-head-cell']">Sat</th>
          </tr>
        </thead>
        <tbody :class="attr['section__table-body']">
          <tr v-for="(weeks, key) in calendar">
            <td :class="attr['section__table-body-cell']">{{ weeks.week }}</td>
            <td v-for="(days, key) in weeks.days" :class="[
              attr['section__table-body-cell'],
              monthValidate(days._d, calendar[1].days[0]) == true && attr['section__table-body-cell--active'],
              dateValidate(days._d) == 'current' && attr['section__table-body-cell--current'],
              ]
            "> 
              {{ getDate(days._d) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  </main>
</template>

<script>
  import moment from 'moment'
  export default {
    // components: {
    //   PageContent: () => import('~/components/home/PageContent')
    // },
    data: () => ({
      loaded: false,
      records: null,
      page: {
        title: "Home",
      },
      calendar: []
    }),
    updated() {
      this.$nuxt.$emit("toggle-footer", "image", true);
    },
    methods: {
      monthValidate($date, $month){
        let current = this.getMonth($month),
            date    = this.getMonth($date)

        if(current != date) {
          return true
        } 
        return false
      },
      dateValidate($date){
        let current = moment().format('DD-MM').toString(),
            date    = moment($date).format('DD-MM').toString()
        if(current == date) {
          return 'current'
        } 
      },
      getDate($date) {
        return moment($date).format('D').toString()
      },
      getMonth($month) {
        let date = moment($month).format('MMMM').toString() + ' ' + moment($month).year()
        return date
      },
      prevMonth($date) {
        let month_count  = moment($date).month() + 1
        const startWeek = moment($date).subtract(1, "month").startOf('month').week()
        const endWeek = moment($date).subtract(1, "month").endOf('month').week() + 1

        if(month_count == 1 ) {
          const date = moment($date).subtract(1, "year")
          const start = moment(date).add(10, "month").startOf('month').week() + 4
          const end = moment(date).add(10, "month").endOf('month').week() + 5
          this.setCalendar(start, end, date)
        } else {
          this.setCalendar(startWeek, endWeek, $date)
        }
      },
      nextMonth($date) {
        let month_count  = moment($date).month() + 1
        const startWeek = moment($date).add(1, "month").startOf('month').week()
        const endWeek = moment($date).add(1, "month").endOf('month').week() + 1
        if(month_count == 12) {
          const date = moment($date).add(1, "year")
          const start = 1
          const end = 6
          this.setCalendar(start, end, date )
        } else if (month_count == 11) {
          const startWeek = moment($date).add(1, "month").startOf('month').week()
          const endWeek = moment($date).add(1, "month").endOf('month').week()
          this.setCalendar(startWeek, endWeek, $date )
        } else {
          this.setCalendar(startWeek, endWeek, $date)
        }
        
      },
      calendarSet() {
        const startWeek = moment().startOf('month').week()
        const endWeek = moment().endOf('month').week() + 1
        this.setCalendar(startWeek, endWeek)
      }, 
      setCalendar($startWeek, $endWeek, $date = moment(), $set) {
        let calendar = [],
            date     = $date

        for(var week = $startWeek; week<$endWeek;week++){
          calendar.push({
            week:week,
            days:Array(7).fill(0).map((n, i) => moment($date).week(week).startOf('week').clone().add(n + i, 'day'))
          })
        }
        this.calendar = calendar

      }
    },
    mounted() {
      setTimeout(() => {
        this.toggleModalStatus({
          type: "loader",
          status: true,
          item: { start: false },
        });
        this.calendarSet()
        this.loaded = true;
      }, 500);
    },
    asyncData({ $axios, store, error }) {
      store.commit("global/modal/toggleModalStatus", {
        type: "loader",
        status: true,
        item: { start: true },
      });

      // return $axios.$get('web/page/landing/home').then(({
      //   records
      // }) => {

      // }).catch(() => {
      //   error({ statusCode: 500 })
      // })
    },
    head() {
      let host = process.env.BASE_URL;

      return {
        title: `Propan | ${this.page.title}`,
        link: [
          {
            rel: "canonical",
            href: `${host}${this.$route.fullPath}`,
          },
        ],
        // meta: [
        //   { hid: 'description', name: 'description', content: `${this.page.metadata.meta_description}` },
        //   { hid: 'og:title', property: 'og:title', content: `${this.page.metadata.meta_title}` },
        //   { hid: 'og:description', property: 'og:description', content: `${this.page.metadata.meta_description}` },
        //   { hid: 'og:url', property: 'og:url', content: `${host}${this.$route.fullPath}` },
        //   { hid: 'og:image', property: 'og:image', content: `${host}/logo.svg` },
        //   { hid: 'og:image:alt', property: 'og:image:alt', content: this.page.title },
        //   { hid: 'og:type', property: 'og:type', content: 'website' },
        //   { hid: 'og:site_name', property: 'og:site_name', content: 'C! Magazine' },
        // ]
      };
    },
  };
</script>

<style lang="stylus" module="attr">
  .section
    display: flex
    justify-content: space-between
    flex-flow: row wrap
    width: 100%
    max-width: 1280px
    margin: 100px auto 0
    padding: 80px 20px 60px 20px
    background-color: #efefef
    border-radius: 10px
    box-shadow: -4px 10px 21px -4px rgba(0,0,0,0.46)
    
    &__controller
      flex: 0 0 calc((40%) - 20px)
      & ^[0]__title
        display: flex
        justify-content: space-between
        align-items: center
        font-size: 30px
        margin-bottom: 30px
        &--small
          font-size: 18px
          color: #000
        &--small:hover
          text-decoration: underline
      & ^[0]__todo-container
        & ^[0]__input-todo
          border: 1px solid #000     
          padding: 0px 10px
          width: 100%     
          height: 40px
          font-size: 18px
        & ^[0]__label
          font-size: 18px
          margin-bottom: 15px
      & ^[0]__date-picker
        display: flex
        flex-flow: row wrap
        justify-content: space-between
        padding-top: 25px
        & ^[0]__left, & ^[0]__right
          flex: 0 0 calc((100% / 2) - 10px)
          input
            width: 100%
            padding-left: 10px
            border: 1px solid #000
            height: 40px
            font-size: 18px
      & ^[0]__button-container
        display: flex
        flex-flow: row wrap
        justify-content: space-between
        margin-top: 30px
        
        & ^[0]__button
          flex: 0 0 calc((100% / 2 ) - 10px)
          width: 100%
          height: 35px
          border: 1px solid #000
          background-color: #FFFAE7
          &--override
            background-color: #CDF0EA
        
        & ^[0]__button:hover
          background-color: #59CE8F
          color: #fff
          box-shadow: 1px 6px 25px -4px rgba(0,0,0,0.39)     
             
    &__calendar
      position: relative
      flex: 0 0 60%
      & ^[0]__table-head, & ^[0]__table-body
        border: 1px solid #000
        & ^[0]__table-head-cell
          width: 90px
          padding: 10px 0
          fonts-size: 18px
          font-weight: 500
          border: 1px solid #000
          color: red
        & ^[0]__table-body-cell
          width: 90px
          padding: 15px 10px 45px
          border: 1px solid #000
          font-size: 16px
          font-weight: 700
          &--active
            background-color: #DFDFDE
          
          &--current
            background-color: #CDF0EA
    
</style>