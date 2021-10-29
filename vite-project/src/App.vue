<script setup>
import { ref } from 'vue'
import AnonComponent from '../components/Anon.vue'

import anonsFixed from '../../_anons.json'
import rarity from '../../_rarity.json'

console.log('anons', anonsFixed)
console.log('rarity', rarity)

const uriId = () => {
  const matches = window.location.hash.match(/id=(\d+)/)
  return matches ? matches[1] : ''
}

let anons = ref(anonsFixed)
let filterId = ref(uriId())
let filterTrait = ref('')
let sortBy = ref('id')

const filterAnonsById = () => {
  filterTrait.value = ''
  if (!filterId.value) {
    anons.value = anonsFixed
    sortAnons()
  } else {
    const results = anonsFixed.find(x => filterId.value === `${x.id}`)
    anons.value = results ? [results] : []
  }
}
const filterAnonsByTrait = () => {
  filterId.value = ''
  filterTrait.value = filterTrait.value.toLowerCase()
  if (!filterTrait.value) {
    anons.value = anonsFixed
    sortAnons()
  } else {
    anons.value = anonsFixed.filter(
      x =>
        (!!x.backgrounds && x.backgrounds.toLowerCase().includes(filterTrait.value)) ||
        (!!x.basePerson && x.basePerson.toLowerCase().includes(filterTrait.value)) ||
        (!!x.head && x.head.toLowerCase().includes(filterTrait.value)) ||
        (!!x.eyes && x.eyes.toLowerCase().includes(filterTrait.value)) ||
        (!!x.clothes && x.clothes.toLowerCase().includes(filterTrait.value)) ||
        (!!x.ears && x.ears.toLowerCase().includes(filterTrait.value)) ||
        (!!x.mouth && x.mouth.toLowerCase().includes(filterTrait.value))
    )
  }
}

const sortAnons = () => {
  if (sortBy.value === 'id') sortById()
  else if (sortBy.value === 'score') sortByScore()
}
const sortById = () => (anons.value = anons.value.sort((a, b) => a.id - b.id))
const sortByScore = () =>
  (anons.value = anons.value.sort((a, b) => rarity.anons[b.id].score - rarity.anons[a.id].score))

// Init uri anon id
if (uriId()) {
  filterId.value = uriId()
  filterAnonsById()
}
</script>

<template>
  <div class="credits">
    <div><a href="https://github.com/rigwild/anons-secret-nft">Available on GitHub</a></div>
    <div>Made with ❤ by <a href="https://github.com/rigwild">rigwild</a></div>
  </div>

  <h1 class="text-center">Anons NFT Rarity Scores</h1>
  <div class="actions">
    <button @click=";(sortBy = 'id'), sortAnons()">Sort by Anon ID</button>
    <button @click=";(sortBy = 'score'), sortAnons()">Sort by Score</button>
    <div>
      <div>
        <label for="filterId">Anon ID</label>
        <input
          v-model="filterId"
          @input="filterAnonsById"
          id="filterId"
          type="text"
          placeholder="Filter by Anon ID"
          maxlength="3"
        />
      </div>
      <div>
        <label for="filterTrait">Trait Name</label>
        <input
          v-model="filterTrait"
          @input="filterAnonsByTrait"
          id="filterTrait"
          type="text"
          placeholder="Filter by Trait Name"
        />
      </div>
    </div>
  </div>

  <div>
    <h2 class="text-center">{{ anons.length }} / {{ anonsFixed.length }} Anons</h2>
  </div>
  <div v-if="anons.length === 0">
    <h2 class="text-center">No anons found!</h2>
  </div>
  <AnonComponent
    v-else
    v-for="anon of anons"
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
  <!-- :key="`${anon.id}-sort-${sortBy}` -->

  <div class="credits">
    <div><a href="https://github.com/rigwild/anons-secret-nft">Available on GitHub</a></div>
    <div>Made with ❤ by <a href="https://github.com/rigwild">rigwild</a></div>
  </div>
</template>

<style>
body {
  max-width: 1260px;
}
.text-center {
  text-align: center;
}
.text-right {
  text-align: right;
}
.pointer {
  cursor: pointer;
}
.actions {
  text-align: center;
  margin: 15px;
}
.actions input {
  margin: 0 auto;
  text-align: center;
  margin-bottom: 20px;
}
.actions > div {
  display: flex;
  justify-content: center;
  align-items: center;
}
.actions > div > div {
  margin: 15px;
}

.credits {
  text-align: center;
  margin: 15px;
}

@media (max-width: 1200px) {
  .actions > div {
    flex-direction: column;
  }
}
</style>
