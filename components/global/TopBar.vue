<template>
  <nav :class="attr['nav']" :id="__nav">
    <div :class="attr['nav__wrapper']">
      <nuxt-link :class="attr['nav__icon']" to="/">
        <h1>Propan</h1>
      </nuxt-link>
      <!-- Wep top bar -->
      <template v-if="!getMobile">
        <ul :class="attr['nav__links']">
          <li
            v-for="(link, key) in populateLinks"
            :key="key"
            :class="attr['nav__links-item']"
          >
            <nuxt-link
              custom
              :to="link.href"
              v-slot="{ href, navigate, isActive, isExactActive }"
            >
              <a
                :class="[
                  attr['nav__item'],
                  (isActive || isExactActive) && attr['nav__item--active'],
                ]"
                :href="href"
                @click="navigate"
              >
                {{ link.name }}
              </a>
            </nuxt-link>
          </li>
        </ul>
      </template>
      <template v-if="!getMobile">
        <div :class="attr['nav__search']">
          <form :class="attr['nav__search-container']">
            <input type="text" placeholder="" v-model="search" />
            <button :class="attr['nav__search_icon']">
              <nuxt-img format="png" src="/assets/search.png" />
            </button>
          </form>
        </div>
      </template>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  data: () => ({
    toggle: {
      burger: false,
    },
    search: "",
    children: [],
    to_return: [],
  }),
  computed: {
    ...mapGetters({
      populateLinks: "global/topbar/populateLinks",
    }),
  },
};
</script>

<style lang="stylus" module="attr">
.nav
  position: absolute
  top: 0
  left: 0
  right: 0
  z-index: 9999
  background-color: var(--theme_primary)
  &__wrapper
    display: flex
    flex-flow: row wrap
    align-items: center
    width: 100%
    max-width: 1280px
    padding: 20px 0
    margin: 0 auto
    & ^[0]__icon
      //for icons css here
      color: white
    & ^[0]__links
      display: flex
      flex-flow: row wrap
      justify-content: flex-end
      align-items: center
      flex: 1 0 5%
      padding: 0
      list-style: none
      & ^[0]__links-item
        margin: 0 25px
        &:first-child
          margin: 0 25px 0 0
        &:last-child
          margin: 0 0 0 25px
        & ^[0]__item
          position: relative
          font-family: var(--gotham)
          font-size: 14px
          letter-spacing: -0.4px
          color: var(--theme_white)
          transition: 0.4s ease-in-out
          &::before
            content: ''
            position: absolute
            top: 50%
            left: -15px
            width: 8px
            height: 8px
            border-radius: 50%
            background-color: var(--theme_primary)
            opacity: 0
            visibility: hidden
            transform: translateY(-50%) scale(0)
            transition: 0.4s ease-in-out
          &:hover
            color: violet
          &--active
            color: violet
            &::before
              opacity: 1
              visibility: visible
              transform: translateY(-50%) scale(1)

    & ^[0]__search
      margin-left: 35px
      padding: 5px
      background: var(--theme_white)
      border-radius: 25px
    & ^[0]__search_icon
      position: relative
      left: -200px

  @media (max-width: 1380px) and (min-width: 1025px)
    &__wrapper
      max-width: 100%
      padding: 20px 100px
</style>