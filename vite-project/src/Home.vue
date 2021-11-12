<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import { UseVirtualList } from '@vueuse/components'
import { useRouteQuery } from '@vueuse/router'

import AnonComponent from '../components/Anon.vue'

import anonsFixed from '../../_anons.json'
import rarity from '../../_rarity.json'

console.log('Use `anons()` to show data')
window.anons = () => {
  console.log('This can be found here: https://github.com/rigwild/anons-secret-nft#raw-rarity-scores')
  console.log('anons', anonsFixed)
  console.log('rarity', rarity)
}

const breakpoints = useBreakpoints({ laptop: 1024 })

const anonCardSize = () => (breakpoints.isGreater('laptop') ? 500 : 1020)

const props = defineProps({
  sortBy: String,
  filterTrait: String
})

if (props.sortBy !== 'id' && props.sortBy !== 'score') throw new Error('Invalid sort')

let anons = ref(anonsFixed)
let filterId = ref()
let filterTrait = ref('')
let sortBy = ref(props.sortBy || 'id')

const filterTraitQuery = useRouteQuery('filterTrait')

let stateKey = computed(
  () => `${sortBy.value}-${filterId.value || '_'}-${filterTrait.value || '_'}-${anons.value.length}`
)

// Keep `sortBy` route query prop in sync with state
watch(
  () => props.sortBy,
  value => {
    sortBy.value = value
  }
)

// Auto-apply anon sort on sort type change
watch(
  () => sortBy.value,
  () => sortAnons()
)

// Keep `filterTrait` state in sync with route query prop
watch(
  () => filterTrait.value,
  value => {
    filterTraitQuery.value = value ? value : undefined
  }
)

const filterAnonsById = () => {
  filterTrait.value = ''
  if (!filterId.value) {
    anons.value = anonsFixed
    sortAnons()
  } else {
    anons.value = []
    const results = anonsFixed.find(x => filterId.value === `${x.id}`)
    nextTick(() => {
      anons.value = results ? [results] : []
    })
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

// Apply route query parameters on page load
sortAnons()
filterTrait.value = props.filterTrait
if (filterTrait.value) filterAnonsByTrait()
</script>

<template>
  <div class="filters">
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

  <div v-else :key="stateKey">
    <UseVirtualList :list="anons" :options="{ itemHeight: anonCardSize, overscan: 2 }" height="94vh">
      <template #="{ data: anon }">
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
    </UseVirtualList>
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
