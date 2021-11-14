<script setup>
import AnonComponent from '../components/Anon.vue'

import anonsFixed from '../../_output_anonsNullTraitsAsNone.json'
import rarity from '../../_output_rarity.json'

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
      :rarityCategoriesBackgroundsCountsAnon="rarity.categories.backgrounds[anon.backgrounds]"
      :rarityCategoriesBasePersonCountsAnon="rarity.categories.basePerson[anon.basePerson]"
      :rarityCategoriesHeadCountsAnon="rarity.categories.head[anon.head]"
      :rarityCategoriesEyesCountsAnon="rarity.categories.eyes[anon.eyes]"
      :rarityCategoriesClothesCountsAnon="rarity.categories.clothes[anon.clothes]"
      :rarityCategoriesEarsCountsAnon="rarity.categories.ears[anon.ears]"
      :rarityCategoriesMouthCountsAnon="rarity.categories.mouth[anon.mouth]"
    />
  </template>
</template>
