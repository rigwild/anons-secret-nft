<script setup>
import AnonComponent from '../components/Anon.vue'

import anonsFixed from '../../_anons.json'
import rarity from '../../_rarity.json'

const props = defineProps({ anonId: String })

const anonId = +props.anonId
const isValidAnonId = !Number.isNaN(anonId) && anonId >= 1 && anonId <= 580
const anon = isValidAnonId && anonsFixed.filter(x => x.id === anonId)[0]
</script>

<template>
  <div v-if="!isValidAnonId">
    <h2 class="text-center">Invalid Anon ID!</h2>
  </div>
  <div v-else>
    <div>
      <AnonComponent
        :anon="anon"
        :totalAnonsCount="anonsFixed.length"
        :rarityAnon="rarity.anons[anon.id]"
        :rarityCategoriesBackgroundsCountsAnon="rarity.categories.backgrounds.counts[anon.backgrounds]"
        :rarityCategoriesBasePersonCountsAnon="rarity.categories.basePerson.counts[anon.basePerson]"
        :rarityCategoriesHeadCountsAnon="rarity.categories.head.counts[anon.head]"
        :rarityCategoriesEyesCountsAnon="rarity.categories.eyes.counts[anon.eyes]"
        :rarityCategoriesClothesCountsAnon="rarity.categories.clothes.counts[anon.clothes]"
        :rarityCategoriesEarsCountsAnon="rarity.categories.ears.counts[anon.ears]"
        :rarityCategoriesMouthCountsAnon="rarity.categories.mouth.counts[anon.mouth]"
      />
    </div>
  </div>
</template>

<style>
.filters {
  text-align: center;
  margin: 15px;
}
.filters input {
  margin: 0 auto;
  text-align: center;
  margin-bottom: 20px;
}
.filters > div {
  display: flex;
  justify-content: center;
  align-items: center;
}
.filters > div > div {
  margin: 15px;
}

@media (max-width: 1280px) {
  .filters > div {
    flex-direction: column;
  }
}
</style>
