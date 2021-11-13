<script setup>
import AnonComponent from '../components/Anon.vue'

import anonsFixed from '../../_anons.json'
import rarity from '../../_rarity.json'

const worldExpoAnons = [
  4, 38, 60, 71, 73, 99, 111, 121, 147, 157, 195, 196, 228, 248, 258, 263, 267, 345, 356, 364, 397, 453, 473, 505, 523,
  534, 542
]

const anons = worldExpoAnons.map(x => anonsFixed.find(y => y.id === x))
</script>

<template>
  <div class="text-center">
    <h2>Dubai 2021 World Expo Anons</h2>
    These 27 Anons were featured at the Dubai 2021 World Expo
  </div>
  <template v-for="anon of anons" :key="anon.id">
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
  </template>
</template>
